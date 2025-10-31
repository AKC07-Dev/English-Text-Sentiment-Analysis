from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module
import joblib
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Load the saved model and vectorizer
model = joblib.load('sentiment_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')

# Define the preprocessing function
stop_words = set(stopwords.words('english'))
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = word_tokenize(text)
    filtered_tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(filtered_tokens)

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Define the API endpoint
@app.route('/predict_sentiment', methods=['POST'])
def predict_sentiment():
    data = request.get_json(force=True)
    review = data['review']

    # Preprocess and vectorize the review
    cleaned_review = preprocess_text(review)
    vectorized_review = vectorizer.transform([cleaned_review])

    # Get the prediction from the model
    prediction = model.predict(vectorized_review)

    # Return the prediction as a JSON response
    return jsonify({'sentiment': prediction[0]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)