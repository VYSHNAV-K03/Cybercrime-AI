from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import numpy as np
import pandas as pd
from utils import clean_text, load_tokenizer_and_max_len

app = Flask(__name__)
CORS(app)

# Load model and setup
model = load_model("cybercrime_detection_model.h5")
tokenizer, max_len = load_tokenizer_and_max_len()

# Encode labels
df = pd.read_csv("cyber_crime_natural_balanced_datasett.csv")
le = LabelEncoder()
le.fit(df['label'])

# Crime info
crime_info = {
    'flaming': {
        'description': "Flaming is hostile and insulting interaction between Internet users...",
        'legal': "IPC 499, 500",
        'wiki': "https://en.wikipedia.org/wiki/Flaming_(Internet)"
    },
    'sexual harassment': {
        'description': "Unwelcome sexual advances...",
        'legal': "Section 354A IPC",
        'wiki': "https://en.wikipedia.org/wiki/Sexual_harassment"
    },
    'impersonation': {
        'description': "Pretending to be someone else...",
        'legal': "Section 66D of IT Act",
        'wiki': "https://en.wikipedia.org/wiki/Identity_theft"
    },
    'outing and trickery': {
        'description': "Sharing secrets online...",
        'legal': "IT Act Section 66E",
        'wiki': "https://en.wikipedia.org/wiki/Outing"
    },
    'exclusion': {
        'description': "Deliberately leaving someone out...",
        'legal': "Contributes to cyberbullying",
        'wiki': "https://en.wikipedia.org/wiki/Cyberbullying"
    },
    'not bullying': {
        'description': "Not cyberbullying",
        'legal': "No action needed",
        'wiki': "https://en.wikipedia.org/wiki/Online_behavior"
    }
}



@app.route('/generate_complaint', methods=['POST'])
def generate_complaint():
    data = request.json
    comment = data.get('comment')
    predicted_label = data.get('label')
    email = data.get('email')
    name = data.get('name')
    location = data.get('location')
    evidence = data.get('evidence')

    complaint = generate_formal_complaint(comment, predicted_label,name, email, location, evidence)

    return jsonify({"complaint": complaint})

def generate_formal_complaint(comment, predicted_label, name=None, email=None, location=None, evidence=None):
    complaint = f"""
🛡️ **To The Cyber Cell Authority**

📌 **Subject:** Formal Complaint Regarding Online {predicted_label.upper()} Incident

Dear Sir/Madam,

I am writing to formally report an online incident that I believe constitutes a serious case of **{predicted_label}**. The nature of this content has caused considerable emotional distress and raises significant concerns regarding online safety and digital conduct.

---

💬 **Offending Content:**
> "{comment}"

This content has deeply impacted me and I believe it clearly falls under the category of **{predicted_label}**. I am reaching out in good faith, requesting that your esteemed department look into this matter and take appropriate action in accordance with the law.

---

👤 **My Personal Details:**
"""

    if name:
        complaint += f"- **Name:** {name}\n"
    if email:
        complaint += f"- **Email:** {email}\n"
    if location:
        complaint += f"- **Location:** {location}\n"

    if evidence:
        complaint += f"\n📎 **Evidence Submitted:**\n{evidence}\n"

    complaint += f"""
---

I trust that your department will give this matter the attention it deserves and take the necessary steps to ensure justice is served. Please feel free to reach out to me for any further details or clarifications.

Thank you for your time and support.

Sincerely,  
{name if name else 'Anonymous'}
"""
    return complaint


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    comment = data.get('comment', '')
    print("comment",comment)

    cleaned = clean_text(comment)
    seq = tokenizer.texts_to_sequences([cleaned])
    padded = pad_sequences(seq, maxlen=max_len, padding='post')
    
    prediction = model.predict(padded)
    label_index = np.argmax(prediction)
    label = le.inverse_transform([label_index])[0]

    info = crime_info.get(label.lower(), {})
    return jsonify({
        "label": label,
        "description": info.get('description', 'N/A'),
        "legal": info.get('legal', 'N/A'),
        "wiki": info.get('wiki', 'N/A'),
        "confidence": float(np.max(prediction))
    })

if __name__ == '__main__':
    app.run(debug=True)
