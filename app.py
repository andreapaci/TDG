from flask import Flask, jsonify, request, abort, render_template, send_from_directory, json

from backend import handler, util

app = Flask(__name__)


@app.route('/assets/<path:path>', methods=['GET'])
def static_assets(path):
    return send_from_directory('./templates/src/assets/', path)


@app.route('/pages/<path:path>', methods=['GET'])
def static_pages(path):
    return send_from_directory('./templates/src/demo_1/pages/', path)


@app.route('/')
def index():
    return render_template('src/index.html')


#Aggiungere errore di ritrorno quando faccio results se non va a buon fine

@app.route('/results', methods=['POST'])
def results():
    print(request.get_json())
    data = request.get_json()


    strat1_number = data["strat1"]
    strat2_number = data["strat2"]

    strat1_names = data["strat1_name"]
    strat2_names = data["strat2_name"]

    matrixString = data["matrix"]


    matrix = util.convertMatrixToFloat(matrixString)

    if matrix is None:
        return "Inserire valori validi nella matrice", 403

    return handler.studio_analitico(matrix, strat1_names, strat2_names)

@app.route('/simulate', methods=['POST'])
def simulate():
    print(str(request.get_json()))
    data = request.get_json()

    strat1 = util.convertStratToFloat(data["strat1"])
    strat2 = util.convertStratToFloat(data["strat2"])
    iterations = data["n_iterazioni"]
    ultimo_val = data["ultimo_val"]
    matrix = util.convertMatrixToFloat(data["matrix"])

    if matrix is None:
        return "Inserire valori validi nella matrice", 403

    if strat1 is None or strat2 is None or not iterations.isnumeric() \
            or not util.check_strategy(strat1) or not util.check_strategy(strat2):
        return "Inserire valori validi di iterazioni e/o strategie", 403

    #CONTROLLA 1) CAMBIANDO LA MATRICE SENZA FARE PROCEDI, QUALE MATRICE PASSA? QUELLA VECCHIA O QUELLA NUOVA? 2) CONTROLLA SE FA I CHECK GIUSTI SULLE VARIABILI
    # CONTROLLA 3) CHE IL NUMERO DI ITERAZIONI CALCOLATO NEL JS è CORRETTO E NON SBALAZA DI -/+ 1
    # CONTROLLA 4) il checkstrategy
    return handler.simulazione(matrix, strat1, strat2, int(iterations), ultimo_val)


if __name__ == '__main__':
    app.run()
