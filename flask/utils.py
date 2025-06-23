import re
import nltk
import pandas as pd
import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

contractions = {
    "don't": "do not", "doesn't": "does not", "can't": "cannot", "won't": "will not",
    "isn't": "is not", "aren't": "are not", "i'm": "i am", "you're": "you are",
    "it's": "it is", "they're": "they are", "we're": "we are", "i've": "i have",
    "didn't": "did not", "couldn't": "could not", "wouldn't": "would not",
}

genz_dict = {
    "fr": "for real", "cap": "lie", "no cap": "not lying", "sus": "suspicious",
    "simp": "obsessive admirer", "glow up": "transformation", "dm": "direct message",
    "finsta": "fake instagram", "w": "win", "l": "loss", "vibe": "atmosphere",
    "thirst trap": "provocative photo", "lit": "exciting", "ghosted": "ignored",
    "drop": "reveal", "flex": "show off", "cringe": "embarrassing", "lmao": "laughing hard",
    "rofl": "rolling on the floor laughing", "lol": "laughing out loud", "btw": "by the way",
    "idk": "i do not know", "ikr": "i know right", "brb": "be right back", "omg": "oh my god",
    "tbh": "to be honest", "skibid": "nonsense", "rizz": "charisma", "mid": "average",
    "based": "unapologetically true", "ratio": "disagreed with", "goat": "greatest of all time",
    "bussin": "very good", "slay": "succeeding with style", "yeet": "throw", "stan": "super fan",
    "drip": "fashionable clothing", "finna": "going to", "lowkey": "subtly", "highkey": "obviously",
    "sksksk": "laughing or excitement", "oop": "surprise or mistake", "tea": "gossip",
    "shook": "shocked", "savage": "bold or ruthless", "salty": "bitter", "deadass": "seriously"
}

def clean_text(text):
    text = text.lower()
    for word, expanded in contractions.items():
        text = re.sub(r"\b" + re.escape(word) + r"\b", expanded, text)
    for slang, meaning in genz_dict.items():
        text = re.sub(r"\b" + re.escape(slang) + r"\b", meaning, text)
    text = re.sub(r"http\S+|@\w+|#\w+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\d+", "", text)
    return text.strip()

def load_tokenizer_and_max_len():
    df = pd.read_csv("cyber_crime_natural_balanced_datasett.csv")
    df['cleaned'] = df['comment'].apply(clean_text)
    tokenizer = Tokenizer(oov_token="<OOV>")
    tokenizer.fit_on_texts(df['cleaned'])
    max_len = max(len(x.split()) for x in df['cleaned'])
    return tokenizer, max_len
