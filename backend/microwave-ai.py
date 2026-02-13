# Overclock
import os 
os.environ["OMP_NUM_THREADS"] = "8"
os.environ["TF_NUM_INTRAOP_THREADS"] = "8"
import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
# import tensorflow as tf
import json

# TODO read in the training data json

with open ("data/food-101/meta/train.json", "r") as file:
    train_json = json.load(file)

with open ("data/food-101/meta/test.json", "r") as file:
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
            print(food_file)
            X_dat.append(mpimg.imread(f"data/food-101/images/{food_file}.jpg", format='jpg')[:,:,0])
            y_dat.append(food)
    return X_dat, y_dat


X_train, y_train = readData(train_json)
X_test, y_test = readData(test_json)

