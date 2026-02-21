from flask import Flask,request
import random
import firebase_admin
from firebase_admin import credentials,firestore
import os
from flask_cors import CORS

types = ["Normal", "Fire", "Water", "Electric", "Grass", 'Ice', 'Fighting', "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"]
num_of_post = 0
app = Flask(__name__)

cred = credentials.Certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app) # This allows your React frontend to talk to this backend

num_of_post = 0

def betray(n):
    return n * random.random()

@app.route('/create', methods=['POST'])
def initialise():
    global num_of_post
    num_of_post += 1
    
    
    info_json = request.get_json()
    og_name = info_json.get("name")
    og_type = info_json.get("type")
    og_location = info_json.get("location")
    
   
    current_betray_score = betray(num_of_post)
    final_type = og_type 
    
    if current_betray_score > 5:
        wrong_types = [t for t in types if t != og_type]
        final_type = random.choice(wrong_types)
        

    db.collection('posts').add({
        "name": og_name,
        "type": final_type, 
        "location": og_location
    })
    
    return {"status": "success", "message": "Post saved!"}, 200

@app.route('/register', methods=['POST'])
def register():
    info = request.get_json()
    name = info.get("username")
    password = info.get("password")
    users_ref = db.collection('users').stream()
    for doc in users_ref:
        if doc.to_dict().get("username") == name:
            return {"message": "Username already exists!"}, 400
    db.collection('users').add({
        "username": name,
        "password": password
    })
    return {"message" : "User registered successfully!"}, 200

if __name__ == "__main__":
    app.run(debug=True)