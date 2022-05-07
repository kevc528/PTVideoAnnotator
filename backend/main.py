from flask import Flask, render_template, request, redirect, url_for

import os

TEMPLATE_DIR = os.path.abspath('../frontend/templates')
STATIC_DIR = os.path.abspath('../frontend/static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)

video_events = {}

@app.route('/')
def main():
    return "<h1>Sent to patient</h1>"

@app.route('/annotate/<filename>', methods=['GET', 'POST'])
def annotate(filename):
    if request.method == "GET":
        return render_template("annotate.html")
    else:
        body_json = request.get_json()
        print(body_json)
        video_events[filename] = body_json
        return ""

@app.route('/watch/<filename>')
def watch(filename):
    return render_template("watch.html")

@app.route('/events/<filename>')
def get_events(filename):
    events = video_events[filename] if filename in video_events else []
    return {"events": events}


if __name__ == "__main__":
    app.run(port=8000)
