from flask import Flask, jsonify, request, abort, render_template, send_from_directory

app = Flask(__name__)


@app.route('/assets/<path:path>', methods=['GET'])
def static_assets(path):
    return send_from_directory('./templates/src/assets/', path)


@app.route('/pages/<path:path>', methods=['GET'])
def static_pages(path):
    return send_from_directory('./templates/src/demo_1/pages/', path)



@app.route('/')
def hello_world():
    print(eval("1/3", {'__builtins__': None}))
    return render_template('src/index.html')



if __name__ == '__main__':
    app.run()
