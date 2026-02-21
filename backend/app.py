from flask import Flask,render_template,request, redirect, url_for
from markupsafe import escape
import random

types = ["Normal", "Fire", "Water", "Electric", "Grass", 'Ice', 'Fighting', "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"]
app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)