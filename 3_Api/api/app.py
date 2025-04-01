from flask import Flask, request, jsonify
import joblib
import numpy as np

model_path = "../model/random_forest_model.pkl"
model = joblib.load(model_path)

# Initialize Flask app
app = Flask(__name__)

@app.route('/')
def home():
    return "Loan Approval Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data 
    data = request.json
    
    # Convert data to numpy array
    features = np.array(data['features']).reshape(1, -1)
    
    # Make prediction
    prediction = model.predict(features)
    
    # Return the prediction
    result = {"loan_approval": "Approved" if prediction[0] == 1 else "Rejected"}
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
