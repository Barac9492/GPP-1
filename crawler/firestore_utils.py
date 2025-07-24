import os
from google.cloud import firestore

def get_firestore_client():
    return firestore.Client()

def save_product(collection, data):
    db = get_firestore_client()
    db.collection(collection).add(data) 