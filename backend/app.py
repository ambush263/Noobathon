from flask import Flask,request
import random
import firebase_admin
from firebase_admin import credentials,firestore
import os
from flask_cors import CORS
from google.cloud.firestore_v1 import ArrayUnion, Increment
from werkzeug.security import generate_password_hash, check_password_hash
types = ["Normal", "Fire", "Water", "Electric", "Grass", 'Ice', 'Fighting', "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"]

app = Flask(__name__)

cred = credentials.Certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
firebase_admin.initialize_app(cred)
db = firestore.client()

CORS(app) # This allows  React frontend to talk to backend

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
    

    db.collection('posts').add({
        "name": og_name,
        "type": og_type, 
        "location": og_location
    })
    
    return {"status": "success", "message": "Post saved!"}, 200

@app.route('/register', methods=['POST'])
def register():
    info = request.get_json()
    name = info.get("username")
    password_hash = generate_password_hash(info.get("password"))
    users_ref = db.collection('users').stream()
    for doc in users_ref:
        if doc.to_dict().get("username") == name:
            return {"message": "Username already exists!"}, 400
    db.collection('users').add({
        "username": name,
        "password": password_hash,
        "posts": [],
        "seen_posts" : [],
        "seen_posts_count": 0,
        "login_count": 0,
        "refresh_count": 0,
        "is_admin": False
    })
    return {"message" : "User registered successfully!"}, 200

@app.route('/login', methods=['POST'])
def login():
    info = request.get_json()
    name = info.get("username")
    password_hash = info.get("password")
    users_ref = db.collection('users').stream()
    for doc in users_ref:
        user_data = doc.to_dict()
        if user_data.get("username") == name and check_password_hash(user_data.get("password"), password_hash):
            # Increment login count
            login_count = user_data.get("login_count", 0) + 1
            is_admin = user_data.get("is_admin", False)
            db.collection("users").document(doc.id).update({
                "login_count": login_count
            })
            return {"user": {"username": name, "login_count": login_count, "is_admin": is_admin}}, 200
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
        "imageUrl": image_url,
        "original_type": type_,
        "original_location": location,
        "betrayed": False,
        "upvotes": 0,
        "downvotes": 0,
        "upvoters": [],
        "downvoters": [],
        "weight": 0
    }

    doc_ref.set(post_data)

    users = db.collection("users").where("username", "==", username).stream()

    for user in users:
        db.collection("users").document(user.id).update({
            "posts": ArrayUnion([doc_ref.id])
        })

    return {"id": doc_ref.id}, 200

@app.route("/posts/<post_id>/view", methods=["POST"])
def mark_post_seen(post_id):
    info = request.get_json()
    username = info.get("username")

    users = db.collection("users").where("username", "==", username).stream()

    for user in users:
        db.collection("users").document(user.id).update({
            "seen_posts_count": Increment(1),
            "seen_posts": ArrayUnion([post_id])
        })

    return {"status": "ok"}, 200

@app.route('/posts', methods=['GET'])
def get_posts():
    posts_ref = db.collection('posts').stream()
    posts = []
    
    for doc in posts_ref:
        post_data = doc.to_dict()
        post_data["id"] = doc.id
        posts.append((doc.id, doc, post_data))
    
    # Apply advanced betray logic
    for post_id, post_doc, post_data in posts:
        if not post_data.get("betrayed", False):
            username = post_data.get("username")
            
            # Get user data
            user_docs = db.collection("users").where("username", "==", username).stream()
            user_data = None
            for user_doc in user_docs:
                user_data = user_doc.to_dict()
                break
            
            if user_data:
                login_count = user_data.get("login_count", 0)
                refresh_count = user_data.get("refresh_count", 0)
                num_posts_by_user = len(user_data.get("posts", []))
                num_posts_seen_by_user = user_data.get("seen_posts_count", 0)
                
                # Calculate betray coefficient
                betray_coeff = (3 * betray(login_count) + 2 * betray(num_posts_by_user) + betray(refresh_count) / 2 + betray(num_posts_seen_by_user)) / 6.5
                
                # If coefficient > 10, betray
                if betray_coeff > 10:
                    og_type = post_data.get("original_type", post_data.get("type"))
                    og_location = post_data.get("original_location", post_data.get("location"))
                    
                    # Get all original locations for shuffling
                    all_locations = []
                    for _, _, p in posts:
                        if not p.get("betrayed", False):
                            all_locations.append(p.get("original_location", p.get("location")))
                    
                    # Shuffle locations
                    random.shuffle(all_locations)
                    
                    # Betray type
                    wrong_types = [t for t in types if t != og_type]
                    new_type = random.choice(wrong_types) if wrong_types else og_type
                    
                    # Betray location
                    new_location = all_locations[0] if all_locations else og_location
                    
                    # Update post
                    db.collection("posts").document(post_id).update({
                        "type": new_type,
                        "location": new_location,
                        "betrayed": True
                    })
                    
                    post_data["type"] = new_type
                    post_data["location"] = new_location
                    post_data["betrayed"] = True
    
    # Return only post data (without doc references) and include weight calculation
    result_posts = []
    for _, _, post_data in posts:
        weight = post_data.get("upvotes", 0) - post_data.get("downvotes", 0)
        post_data["weight"] = weight
        result_posts.append(post_data)
    
    # Sort by weight (descending)
    result_posts.sort(key=lambda x: x.get("weight", 0), reverse=True)
    
    return {"posts": result_posts}, 200

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

@app.route('/posts/<post_id>/upvote', methods=['POST'])
def upvote_post(post_id):
    info = request.get_json()
    username = info.get("username")
    
    post_doc = db.collection("posts").document(post_id)
    post_data = post_doc.get().to_dict() if post_doc.get().exists else None
    
    if not post_data:
        return {"message": "Post not found"}, 404
    
    upvoters = post_data.get("upvoters", [])
    downvoters = post_data.get("downvoters", [])
    
    # Check if user already upvoted
    if username in upvoters:
        # Remove upvote
        upvoters.remove(username)
        post_doc.update({
            "upvotes": len(upvoters),
            "upvoters": upvoters
        })
        return {"upvoters": upvoters, "downvoters": downvoters, "voted": None}, 200
    
    # Check if user downvoted, remove it
    if username in downvoters:
        downvoters.remove(username)
    
    # Add upvote
    upvoters.append(username)
    post_doc.update({
        "upvotes": len(upvoters),
        "downvotes": len(downvoters),
        "upvoters": upvoters,
        "downvoters": downvoters
    })
    
    return {"upvoters": upvoters, "downvoters": downvoters, "voted": "up"}, 200

@app.route('/posts/<post_id>/downvote', methods=['POST'])
def downvote_post(post_id):
    info = request.get_json()
    username = info.get("username")
    
    post_doc = db.collection("posts").document(post_id)
    post_data = post_doc.get().to_dict() if post_doc.get().exists else None
    
    if not post_data:
        return {"message": "Post not found"}, 404
    
    upvoters = post_data.get("upvoters", [])
    downvoters = post_data.get("downvoters", [])
    
    # Check if user already downvoted
    if username in downvoters:
        # Remove downvote
        downvoters.remove(username)
        post_doc.update({
            "downvotes": len(downvoters),
            "downvoters": downvoters
        })
        return {"upvoters": upvoters, "downvoters": downvoters, "voted": None}, 200
    
    # Check if user upvoted, remove it
    if username in upvoters:
        upvoters.remove(username)
    
    # Add downvote
    downvoters.append(username)
    post_doc.update({
        "upvotes": len(upvoters),
        "downvotes": len(downvoters),
        "upvoters": upvoters,
        "downvoters": downvoters
    })
    
    return {"upvoters": upvoters, "downvoters": downvoters, "voted": "down"}, 200

@app.route('/refresh', methods=['POST'])
def increment_refresh():
    info = request.get_json()
    username = info.get("username")
    
    users = db.collection("users").where("username", "==", username).stream()
    for user in users:
        refresh_count = user.to_dict().get("refresh_count", 0) + 1
        db.collection("users").document(user.id).update({
            "refresh_count": refresh_count
        })
        return {"refresh_count": refresh_count}, 200
    
    return {"message": "User not found"}, 404

@app.route('/admin/init', methods=['POST'])
def init_admin():
    """Initialize admin user with username 'admin' and password 'hail rocket'"""
    admin_username = "admin"
    admin_password = "hail rocket"
    
    # Check if admin already exists
    users_ref = db.collection('users').stream()
    for doc in users_ref:
        user_data = doc.to_dict()
        if user_data.get("username") == admin_username:
            return {"message": "Admin user already exists!"}, 400
    
    # Create admin user
    admin_password_hash = generate_password_hash(admin_password)
    db.collection('users').add({
        "username": admin_username,
        "password": admin_password_hash,
        "posts": [],
        "seen_posts": [],
        "seen_posts_count": 0,
        "login_count": 0,
        "refresh_count": 0,
        "is_admin": True
    })
    
    return {"message": "Admin user 'admin' created successfully! Password: hail rocket"}, 200

@app.route('/admin/delete-post/<post_id>', methods=['POST'])
def admin_delete_post(post_id):
    """Admin can delete any post"""
    info = request.get_json()
    admin_username = info.get("username")
    
    # Verify admin
    users = db.collection("users").where("username", "==", admin_username).stream()
    is_admin = False
    for user in users:
        is_admin = user.to_dict().get("is_admin", False)
        break
    
    if not is_admin:
        return {"message": "Admin access required!"}, 403
    
    # Delete post
    db.collection("posts").document(post_id).delete()
    
    # Remove from user's posts
    posts = db.collection("users").stream()
    for user in posts:
        user_data = user.to_dict()
        if "posts" in user_data and post_id in user_data["posts"]:
            user_posts = user_data["posts"]
            user_posts.remove(post_id)
            db.collection("users").document(user.id).update({"posts": user_posts})
    
    return {"message": f"Post {post_id} deleted by admin"}, 200

@app.route('/admin/edit-post/<post_id>', methods=['POST'])
def admin_edit_post(post_id):
    """Admin can edit any post"""
    info = request.get_json()
    admin_username = info.get("username")
    
    # Verify admin
    users = db.collection("users").where("username", "==", admin_username).stream()
    is_admin = False
    for user in users:
        is_admin = user.to_dict().get("is_admin", False)
        break
    
    if not is_admin:
        return {"message": "Admin access required!"}, 403
    
    # Update post fields
    update_data = {}
    if "name" in info:
        update_data["name"] = info.get("name")
    if "type" in info:
        update_data["type"] = info.get("type")
    if "location" in info:
        update_data["location"] = info.get("location")
    if "imageUrl" in info:
        update_data["imageUrl"] = info.get("imageUrl")
    
    if update_data:
        db.collection("posts").document(post_id).update(update_data)
        return {"message": f"Post {post_id} updated by admin", "updated_fields": update_data}, 200
    
    return {"message": "No fields to update"}, 400

@app.route('/admin/delete-user/<username>', methods=['POST'])
def admin_delete_user(username):
    """Admin can delete any user"""
    info = request.get_json()
    admin_username = info.get("username")
    
    # Verify admin
    users = db.collection("users").where("username", "==", admin_username).stream()
    is_admin = False
    for user in users:
        is_admin = user.to_dict().get("is_admin", False)
        break
    
    if not is_admin:
        return {"message": "Admin access required!"}, 403
    
    if username == "admin":
        return {"message": "Cannot delete admin user!"}, 403
    
    # Find and delete user
    users = db.collection("users").where("username", "==", username).stream()
    for user in users:
        user_data = user.to_dict()
        user_posts = user_data.get("posts", [])
        
        # Delete all their posts
        for post_id in user_posts:
            db.collection("posts").document(post_id).delete()
        
        # Delete user
        db.collection("users").document(user.id).delete()
        return {"message": f"User {username} and all their posts deleted by admin"}, 200
    
    return {"message": "User not found"}, 404

@app.route('/admin/all-users', methods=['POST'])
def admin_all_users():
    """Admin can view all users"""
    info = request.get_json()
    admin_username = info.get("username")
    
    # Verify admin
    users = db.collection("users").where("username", "==", admin_username).stream()
    is_admin = False
    for user in users:
        is_admin = user.to_dict().get("is_admin", False)
        break
    
    if not is_admin:
        return {"message": "Admin access required!"}, 403
    
    # Get all users
    all_users = []
    users = db.collection("users").stream()
    for user in users:
        user_data = user.to_dict()
        all_users.append({
            "username": user_data.get("username"),
            "is_admin": user_data.get("is_admin", False),
            "posts_count": len(user_data.get("posts", [])),
            "login_count": user_data.get("login_count", 0)
        })
    
    return {"users": all_users}, 200

@app.route('/admin/all-posts', methods=['POST'])
def admin_all_posts():
    """Admin can view all posts with details"""
    info = request.get_json()
    admin_username = info.get("username")
    
    # Verify admin
    users = db.collection("users").where("username", "==", admin_username).stream()
    is_admin = False
    for user in users:
        is_admin = user.to_dict().get("is_admin", False)
        break
    
    if not is_admin:
        return {"message": "Admin access required!"}, 403
    
    # Get all posts
    all_posts = []
    posts = db.collection("posts").stream()
    for post in posts:
        post_data = post.to_dict()
        all_posts.append({
            "id": post_data.get("id"),
            "username": post_data.get("username"),
            "name": post_data.get("name"),
            "type": post_data.get("type"),
            "location": post_data.get("location"),
            "betrayed": post_data.get("betrayed", False),
            "upvotes": post_data.get("upvotes", 0),
            "downvotes": post_data.get("downvotes", 0),
            "weight": post_data.get("upvotes", 0) - post_data.get("downvotes", 0)
        })
    
    return {"posts": all_posts}, 200

if __name__ == "__main__":
    app.run(debug=True)