from flask import Flask, render_template, request
import requests

app = Flask(__name__)

# This points to your API server
API_ENDPOINT = "http://localhost:8080/predict"

# List of expected features - replace with your actual feature names
FEATURE_NAMES = [
    'feature_1', 'feature_2', 'feature_3', 'feature_4', 'feature_5',
    'feature_6', 'feature_7', 'feature_8', 'feature_9', 'feature_10',
    'feature_11', 'feature_12', 'feature_13', 'feature_14', 'feature_15'
]

@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    
    if request.method == 'POST':
        # Collect all features from the form
        features = []
        for feature in FEATURE_NAMES:
            value = request.form.get(feature)
            try:
                features.append(float(value))
            except (ValueError, TypeError):
                # Handle invalid input
                return render_template('index.html', 
                                     prediction="Error: Please enter valid numbers for all fields",
                                     feature_names=FEATURE_NAMES)
        
        # Prepare data for API
        data = {'features': features}
        
        try:
            # Send data to your API
            response = requests.post(API_ENDPOINT, json=data)
            
            if response.status_code == 200:
                prediction = response.json().get('loan_approval', 'Error')
            else:
                prediction = f"API Error: {response.status_code}"
        except requests.exceptions.RequestException as e:
            prediction = f"Connection Error: {str(e)}"
    
    return render_template('index.html', 
                         prediction=prediction,
                         feature_names=FEATURE_NAMES)

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Different port than your API