from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# Expected order of features:
# [no_of_dependents, education, self_employed, income_annum, loan_amount,
#  loan_term, cibil_score, residential_assets_value, commercial_assets_value,
#  luxury_assets_value, bank_asset_value, total_assets, debt_to_income,
#  loan_to_assets, cibil_bucket]

model_path = "../model/random_forest_model.pkl"
model = joblib.load(model_path)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

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
