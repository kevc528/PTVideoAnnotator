from flask import Flask, render_template

import os

TEMPLATE_DIR = os.path.abspath('../frontend/templates')
STATIC_DIR = os.path.abspath('../frontend/static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)

@app.route('/')
def main():
    return "Hello"

@app.route('/annotate/<filename>')
def annotate(filename):
    return render_template("annotate.html")

if __name__ == "__main__":
    app.run(port=8000)
