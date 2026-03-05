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
decodeTable = {
    0: "pizza",
    1: "burger",
    2: "sushi",
    3: "rice",
    4: "soup"
}


# -------------------- IMAGE PREPROCESSING --------------------

# TODO 6: Create a helper function to prepare images for the model
# Steps:
# - Resize the image to match the model input size
# - Convert image to numpy array
# - Normalize pixel values
# - Add a batch dimension
def preprocess_image(image):

    # TODO 7: Resize the image to the size used during training
    image = image.resize((224, 224))

    # TODO 8: Convert the image into a numpy array
    img_array = np.array(image)

    # TODO 9: Normalize pixel values (0–255 -> 0–1)
    img_array = img_array / 255.0

    # TODO 10: Add a batch dimension so the shape becomes
    # (1, height, width, channels)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


# -------------------- PREDICTION ROUTE --------------------

# TODO 11: Create a POST endpoint "/predict"
# The React frontend will send captured images here
@app.route("/predict", methods=["POST"])
def predict():

    try:

        # TODO 12: Read JSON data sent from the frontend
        data = request.json

        # TODO 13: Extract the base64 encoded image string
        image_data = data["image"]

        # TODO 14: Remove the base64 header
        # Example header: "data:image/png;base64,"
        image_data = image_data.split(",")[1]

        # TODO 15: Decode the base64 string into raw image bytes
        image_bytes = base64.b64decode(image_data)

        # TODO 16: Convert the raw bytes into a PIL Image
        image = Image.open(io.BytesIO(image_bytes))

        # TODO 17: Preprocess the image using the helper function
        processed_image = preprocess_image(image)

        # TODO 18: Run the TensorFlow model prediction
        prediction = model.predict(processed_image)

        # TODO 19: Find the predicted class index
        class_id = int(np.argmax(prediction))

        # TODO 20: Convert the predicted class index into a food name
        food_prediction = decodeTable.get(class_id, "Unknown")

        # TODO 21: Return the prediction as a JSON response
        return jsonify({
            "prediction": food_prediction
        })

    # TODO 22: Add basic error handling so the API doesn't crash
    except Exception as e:
        return jsonify({
            "error": str(e)
        })


# -------------------- RUN SERVER --------------------

# TODO 23: Start the Flask server
# Enable debug mode during development
if __name__ == "__main__":
    app.run(debug=True)