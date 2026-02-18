# Overclock
import os 
os.environ["OMP_NUM_THREADS"] = "8"
os.environ["TF_NUM_INTRAOP_THREADS"] = "8"
import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import tensorflow as tf
import json
import random

# TODO read in the training data json

# For local use

# with open ("data/food-101/meta/train.json", "r") as file:
#     train_json = json.load(file)

# with open ("data/food-101/meta/test.json", "r") as file:
#     test_json = json.load(file)

with open ("gs://microwave-ai-food-101/food-101/food-101/meta/train.json", "r") as file:
    train_json = json.load(file)

with open ("gs://microwave-ai-food-101/food-101/food-101/meta/test.json", "r") as file:
    test_json = json.load(file)


# Create Encoder & Decoder
encodeTable = {}
decodeTable = {}
foods = list(train_json.keys())
for i in range(0,len(foods)):
    encodeTable[foods[i]] = i
    decodeTable[i] = foods[i]

def encodeList(list):
    return [encodeTable[item] for item in list]

def decode(item):
    return decodeTable[item]


def readData(json):
    X_dat = []
    y_dat = []
    for food in json:
        for food_file in train_json[food]:
            # For local use
            # X_dat.append(mpimg.imread(f"data/food-101/images/{food_file}.jpg", format='jpg')[:,:,0])
            X_dat.append(mpimg.imread(f"gs://microwave-ai-food-101/food-101/food-101/images/{food_file}.jpg", format='jpg')[:,:,0])
            y_dat.append(food)
    return X_dat, y_dat


X_train, y_train = readData(train_json)
X_test, y_test = readData(test_json)

# Only for local testing bc big data

model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32,(3,3),activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(50,activation='relu'),
    tf.keras.layers.Dense(100),
    tf.keras.layers.Softmax()
])

lr = 0.0002

model.compile(
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    optimizer=tf.keras.optimizers.Adam(learning_rate=lr),
    metrics=["accuracy"]
)

history = model.fit(X_train, y_train, epochs=8, validation_data=(X_test,y_test))