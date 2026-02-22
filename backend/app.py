from flask import Flask,request
import random
import firebase_admin
from firebase_admin import credentials,firestore
import os
from flask_cors import CORS
from google.cloud.firestore_v1 import ArrayUnion

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
        "password": password,
        "posts": [],
        "seen_posts": 0
    })
    return {"message" : "User registered successfully!"}, 200

@app.route('/login', methods=['POST'])
def login():
    info = request.get_json()
    name = info.get("username")
    password = info.get("password")
    users_ref = db.collection('users').stream()
    for doc in users_ref:
        user_data = doc.to_dict()
        if user_data.get("username") == name and user_data.get("password") == password:
            return {"user": {"username" : name}}, 200
    return {"message": "Invalid credentials!"}, 400

@app.route('/posts', methods=['POST'])
def add_post():
    info = request.get_json()

    username = info.get("username")
    name = info.get("name")
    type_ = info.get("type")
    location = info.get("location")
    image_url = info.get("imageUrl")

    # Create post doc with known ID
    doc_ref = db.collection("posts").document()

    post_data = {
        "id": doc_ref.id,
        "username": username,
        "name": name,
        "type": type_,
        "location": location,
        "imageUrl": image_url
    }

    doc_ref.set(post_data)

    users = db.collection("users").where("username", "==", username).stream()

    for user in users:
        db.collection("users").document(user.id).update({
            "posts": ArrayUnion([doc_ref.id])
        })

    return {"id": doc_ref.id}, 200
@app.route('/posts', methods=['GET'])
def get_posts():
    posts_ref = db.collection('posts').stream()
    posts = []
    post_index = 0
    
    for doc in posts_ref:
        post_index += 1
        post_data = doc.to_dict()
        post_data["id"] = doc.id
        posts.append(post_data)
    
    # Collect all original locations
    all_locations = [post.get("location") for post in posts]
    
    # Apply betray logic
    for index, post in enumerate(posts, 1):
        current_betray_score = betray(index)
        
        if current_betray_score > 5:
            # Betray the type
            og_type = post.get("type")
            wrong_types = [t for t in types if t != og_type]
            post["type"] = random.choice(wrong_types)
            
            # Betray the location - shuffle all locations and reassign
            shuffled_locations = all_locations.copy()
            random.shuffle(shuffled_locations)
            post["location"] = shuffled_locations[index - 1]
    
    return {"posts": posts}, 200

@app.route('/posts/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    # Delete from posts collection
    db.collection("posts").document(post_id).delete()
    
    # Remove from user's posts array
    users = db.collection("users").stream()
    for user in users:
        user_data = user.to_dict()
        if "posts" in user_data and post_id in user_data["posts"]:
            user_posts = user_data["posts"]
            user_posts.remove(post_id)
            db.collection("users").document(user.id).update({
                "posts": user_posts
            })
    
    return {"message": "Post deleted successfully!"}, 200

if __name__ == "__main__":
    app.run(debug=True)