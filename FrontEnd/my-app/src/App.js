import React, { useState, useRef, useEffect } from "react";

function App() {
  const [wattage, setWattage] = useState("");
  const [heatLevel, setHeatLevel] = useState(50);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera error:", err));
  }, []);



const [capturedImage, setCapturedImage] = useState(null);
const [imageBlob, setImageBlob] = useState(null);

const captureImage = async () => {
  const video = videoRef.current; //live camera stream element
  const canvas = canvasRef.current; // canvas we paint the video onto
  const context = canvas.getContext("2d"); ///2d drawing tool for the canvas, not possible to draw anything without ts
  //make the canvas the same size as the video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
//the actual photo. copies the current video frame and puts it on the canvas (at position 0,0)
  context.drawImage(video, 0, 0);
//converts canvas to file to Blob.
  canvas.toBlob(async (blob) => {
//checks that it is actually a blob (safety net)
    if (!blob) return;

    //stores the image file in react state
    setImageBlob(blob);

    //creates a temporary url. points to inside the browser to get the image file
    const previewUrl = URL.createObjectURL(blob);
    //store the temporary url in state
    setCapturedImage(previewUrl);

//mimics how file uploads work in HTML form
    const formData = new FormData();
    formData.append("image", blob, "food.png");

    try {
      //send to backend
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      // // Check if server responded correctly
      // if (!response.ok) {
      //   throw new Error("Server responded with an error");
      // }

      const data = await response.json();
      console.log("Server response:", data);
    } catch (error) {
      // It will probably error until backend is ready — that’s fine
      console.log("Backend not ready yet.");
    }

  }, "image/png"); //converts the canvas into a png
};
















  return (
    <div style={styles.container}>
      <h2>Smart Microwave AI</h2>



      {/*Camera */}
      <div style={styles.card}>
        <h3>2. Take Photo of Food</h3>

        <video ref={videoRef} autoPlay style={styles.video} />
        <button onClick={captureImage}>Capture</button>
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

{/* proof that picture was actually taken */}
{capturedImage && ( //if the image exists, show this -->
  <div style={{ marginTop: "15px" }}>
    <h4>Captured Image:</h4> 
    <img
      src={capturedImage}
      alt="Captured food"
      style={{ width: "100%", borderRadius: "10px" }}
    />
  </div>
)}
  </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    fontFamily: "Arial",
    textAlign: "center",
  },
  card: {
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
  input: {
    marginTop: "10px",
    padding: "5px",
    width: "100%",
  },
  video: {
    width: "100%",
    borderRadius: "10px",
  },
};

export default App;
