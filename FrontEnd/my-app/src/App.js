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

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");

    console.log("Captured Image:", imageData);
  };

  return (
    <div style={styles.container}>
      <h2>Smart Microwave AI</h2>

      {/* Step 1: Wattage */}
      <div style={styles.card}>
        <h3>1. Select Microwave Wattage</h3>

        <div>
          <button onClick={() => setWattage(700)}>700W</button>
          <button onClick={() => setWattage(900)}>900W</button>
          <button onClick={() => setWattage(1100)}>1100W</button>
        </div>

        <input
          type="number"
          placeholder="Custom wattage"
          value={wattage}
          onChange={(e) => setWattage(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Step 2: Camera */}
      <div style={styles.card}>
        <h3>2. Take Photo of Food</h3>

        <video ref={videoRef} autoPlay style={styles.video} />
        <button onClick={captureImage}>Capture</button>
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {/* Step 3: Heat Slider */}
      <div style={styles.card}>
        <h3>3. Select Heat Preference</h3>

        <input
          type="range"
          min="0"
          max="100"
          value={heatLevel}
          onChange={(e) => setHeatLevel(e.target.value)}
          style={{
            width: "100%",
            background: `linear-gradient(to right, lightblue, red)`
          }}
        />

        <p>
          Heat Level:{" "}
          {heatLevel < 33
            ? "Warm"
            : heatLevel < 66
            ? "Medium"
            : "Hot"}
        </p>
      </div>
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
