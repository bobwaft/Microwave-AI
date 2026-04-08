# TODO 0: Import required libraries
# - Flask tools for building the API
# - CORS so the React frontend can access the API
# - numpy for numerical operations
# - tensorflow for loading the trained model
# - base64 for decoding the image sent from React
# - PIL and io for image processing
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import base64
from PIL import Image
import io


# TODO 1: Initialize the Flask app
app = Flask(__name__)

# TODO 2: Enable CORS so React (running on a different port)
# can communicate with this backend API
CORS(app)


# -------------------- MODEL LOADING --------------------

# TODO 3: Create a function that loads the trained TensorFlow model
# - Use tensorflow keras model loader
# - Load the file "microwave-ai.h5"
# - Disable compile since we only need inference
def load_model():
    model = tf.keras.models.load_model("microwave-ai.h5", compile=False)
    return model


# TODO 4: Call the model loading function once when the server starts
# This prevents reloading the model on every prediction request
model = load_model()


# -------------------- LABEL DECODER --------------------

# TODO 5: Create a dictionary that converts model output indices
# back into readable food names
# NOTE: These values must match the encoding used during training
foods_trimmed = ['hot_and_sour_soup', 'samosa', 'sashimi', 'pork_chop', 'spring_rolls', 'panna_cotta', 'tacos', 'pad_thai', 'poutine', 'ramen', 'pulled_pork_sandwich', 'bibimbap', 'beignets', 'apple_pie', 'crab_cakes', 'risotto', 'paella', 'steak', 'baby_back_ribs', 'miso_soup', 'club_sandwich', 'carrot_cake', 'falafel', 'bread_pudding', 'chicken_wings', 'gnocchi', 'creme_brulee', 'escargots','spaghetti_bolognese', 'mussels', 'scallops', 'baklava', 'edamame', 'macaroni_and_cheese', 'pancakes', 'garlic_bread', 'onion_rings', 'red_velvet_cake', 'grilled_salmon', 'chicken_curry', 'fish_and_chips', 'lasagna', 'peking_duck', 'clam_chowder', 'french_onion_soup', 'fried_rice', 'donuts', 'gyoza', 'ravioli', 'fried_calamari', 'spaghetti_carbonara', 'french_toast', 'lobster_bisque', 'french_fries', 'shrimp_and_grits', 'filet_mignon', 'hamburger', 'dumplings', 'eggs_benedict', 'breakfast_burrito', 'hot_dog', 'waffles', 'huevos_rancheros', 'pizza', 'chicken_quesadilla', 'pho', 'prime_rib', 'omelette', 'grilled_cheese_sandwich', 'lobster_roll_sandwich', 'nachos']
def decode(index):
    return foods_trimmed[index]
# decodeTable = {
#     0: "pizza",
#     1: "burger",
#     2: "sushi",
#     3: "rice",
#     4: "soup"
# }


# -------------------- IMAGE PREPROCESSING --------------------

# TODO 6: Create a helper function to prepare images for the model
# Steps:
# - Resize the image to match the model input size
# - Convert image to numpy array
# - Normalize pixel values
# - Add a batch dimension
def preprocess_image(image):

    # TODO 7: Resize the image to the size used during training
    image = image.resize((512, 512))

    # TODO 8: Convert the image into a numpy array
    img_array = np.array(image)

    # TODO 9: Normalize pixel values (0–255 -> 0–1)
    img_array = img_array / 255.0
    return img_array


# -------------------- PREDICTION ROUTE --------------------

# TODO 11: Create a POST endpoint "/predict"
# The React frontend will send captured images here
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # get uploaded blob file
        file = request.files['image']
        # convert blob to PIL image
        image = Image.open(file.stream).convert("RGB")

        # preprocess
        processed_image = preprocess_image(image)

        # add batch dimension
        processed_image = np.expand_dims(processed_image, axis=0)

        # run model prediction
        prediction = model.predict(processed_image)

        # get predicted class
        class_id = int(np.argmax(prediction))
        food_prediction = decode(class_id)

        return jsonify({
            "prediction": food_prediction
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- RUN SERVER --------------------

# TODO 23: Start the Flask server
# Enable debug mode during development
if __name__ == "__main__":
    app.run(host = '0.0.0.0', port=5000)