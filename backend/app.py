from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
def gen_forensic_report(log):
    model=genai.GenerativeModel("gemini-1.5-pro-latest")
    prompt=f'''
    Analyze the following forensic log and generate forensic report. 
    Include:
    - Key findings
    - Potential security threats
    - Recommended actions

    Log data:
    {log}

    Structured report:
    '''
    response=model.generate_content(prompt)
    return response.text

@app.route('/forensic_report', methods=['POST'])
def forensic_report():
    data = request.json
    log = data["log"]

    if not log:
        return jsonify({"error": "Missing log data"}), 400
    
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_text = f"{current_time} - {log}"

    report = gen_forensic_report(log_text)

    return jsonify({"forensic_report": report})

if __name__ == '__main__':
    app.run(debug=True)