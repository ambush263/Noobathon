from flask import Flask

app = Flask(__name__)

@app.route('/')
def welcome():
    # This is the "Public" face of the island
    return """
    <h1>Welcome to the New Pokemon Island!</h1>
    <p>Document your discoveries and share them with the world.</p>
    <hr>
    <p style='color: grey;'>Property of the Regional Research Committee (Not Team Rocket)</p>
    """

if __name__ == "__main__":
    app.run(debug=True)