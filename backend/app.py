from flask import Flask,render_template,request, redirect, url_for
import random
import firebase_admin
from firebase_admin import credentials, firestore
import os

app = Flask(__name__)

cred = credentials.certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello, World'
if __name__ == "__main__":
    app.run(debug=True)