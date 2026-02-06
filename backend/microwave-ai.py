# Overclock
import os 
os.environ["OMP_NUM_THREADS"] = "8"
os.environ["TF_NUM_INTRAOP_THREADS"] = "8"
import pandas as pd
import numpy as np
import math
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import plotly.express as px
import tensorflow as tf
import json

# TODO read in the training data json

with open ("data/food-101/meta/train.json", "r") as file:
    train_json = json.load(file)


# TODO read in images from this

def show_img(array):
    plt.imshow(array, cmap="gray")
    plt.axis("off")
    plt.show()

X_train = []
y_train = []

encoder = LabelEncoder()

for food in train_json:
    for food_file in train_json[food]:
        X_train.append("data/food-101/images/{food_file}.jpg")
        y_train.append(food)

        
