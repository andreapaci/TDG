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
def hello_world():
    return render_template('src/index.html')


@app.route('/simulate', methods=['POST'])
def simulate():
    print(request.get_json())
    data = request.get_json()

    print(data)
    print(data["strat1"])

    strat1_number = data["strat1"]
    strat2_number = data["strat2"]

    strat1_names = data["strat1_name"]
    strat2_names = data["strat2_name"]

    matrixString = data["matrix"]

    #if not util.check_matrix(matrixString, strat1_number, strat2_number):
    #    return "Errore nel check della matrice", 403

    matrix = util.convertToFloat(matrixString)

    if matrix is None:
        return "Errore nel check della matrice", 403

    return handler.studio_analitico(matrix, strat1_names, strat2_names)


if __name__ == '__main__':
    app.run()
