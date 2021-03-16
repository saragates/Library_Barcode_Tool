from application import app
from flask import render_template, url_for, request, json, Response, jsonify

@app.route("/")

def index():
  	return render_template("input.html")

