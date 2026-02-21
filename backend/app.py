from flask import Flask,render_template,request, redirect, url_for
import random
import firebase_admin
from firebase_admin import credentials, firestore
import os

types = ["Normal", "Fire", "Water", "Electric", "Grass", 'Ice', 'Fighting', "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"]
app = Flask(__name__)

cred = credentials.certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
firebase_admin.initialize_app(cred)
db = firestore.client()


if __name__ == "__main__":
    app.run(debug=True)