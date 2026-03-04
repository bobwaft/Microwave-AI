import React, { useState, useRef, useEffect } from "react";

const MICROWAVES = [
  { name: "Panasonic NN‑SN686S", wattage: 1200 },
  { name: "Toshiba EM131A5C‑SS", wattage: 1100 },
  { name: "Samsung MS14K6000AS", wattage: 1000 },
  { name: "GE JES1095SMSS", wattage: 950 },
  { name: "Sharp ZSMC113", wattage: 1050 },
  { name: "Breville BMO734XL", wattage: 1100 },
  { name: "Hamilton Beach 1000W", wattage: 1000 },
  { name: "LG LMC1575ST", wattage: 1200 },
  { name: "Whirlpool WMC20005YB", wattage: 1000 },
  { name: "Kenmore 72122", wattage: 1100 },
  { name: "Magic Chef MCM1111ST", wattage: 900 },
  { name: "Emerson MWG9115SB", wattage: 1000 },
  { name: "Daewoo KOR6L77", wattage: 950 },
  { name: "Black+Decker EM720CB7", wattage: 700 },
];

function App() {
  const [step, setStep] = useState(1); // 1 = Microwaves, 2 = Preferences, 3 = Camera
  const [selectedMicrowave, setSelectedMicrowave] = useState(null);
  const [customMicrowave, setCustomMicrowave] = useState({ name: "", wattage: "" });
  const [preferences, setPreferences] = useState({
    heat: 50,
    portion: 1,
    moisture: 50,
  });
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Camera setup
  useEffect(() => {
    if (step === 3) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Camera error:", err);
        }
      };
      startCamera();
    }
  }, [step]);

  // Capture image
  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setImageBlob(blob);

      const previewUrl = URL.createObjectURL(blob);
      setCapturedImage(previewUrl);

      const formData = new FormData();
      formData.append("image", blob, "food.png");
      formData.append("wattage", selectedMicrowave.wattage);
      formData.append("heat", preferences.heat);
      formData.append("portion", preferences.portion);
      formData.append("moisture", preferences.moisture);

      try {
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setPrediction(data);
      } catch (error) {
        console.log("Backend not ready yet.");
      }
    }, "image/png");
  };

  const renderTabs = () => (
    <div style={styles.tabsContainer}>
      <div style={{ ...styles.tab, ...(step === 1 ? styles.activeTab : {}) }} onClick={() => setStep(1)}>Microwaves</div>
      <div style={{ ...styles.tab, ...(step === 2 ? styles.activeTab : {}) }} onClick={() => selectedMicrowave && setStep(2)}>Preferences</div>
      <div style={{ ...styles.tab, ...(step === 3 ? styles.activeTab : {}) }} onClick={() => selectedMicrowave && setStep(3)}>Camera</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.header}>☕ Smart Microwave AI</h1>
        {renderTabs()}

        {/* PAGE 1 — Microwaves */}
        {step === 1 && (
          <>
            <div style={styles.gridContainer}>
              {MICROWAVES.map((mw, idx) => (
                <div
                  key={idx}
                  style={styles.microwaveCard}
                  onClick={() => {
                    setSelectedMicrowave(mw);
                    setStep(2);
                  }}
                >
                  <strong>{mw.name}</strong>
                  <div style={styles.mwWattage}>{mw.wattage} W</div>
                </div>
              ))}
            </div>

            {/* Custom Microwave Input */}
            <div style={styles.customContainer}>
              <input
                style={styles.input}
                placeholder="Microwave Name"
                value={customMicrowave.name}
                onChange={(e) => setCustomMicrowave({ ...customMicrowave, name: e.target.value })}
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Wattage (W)"
                value={customMicrowave.wattage}
                onChange={(e) => setCustomMicrowave({ ...customMicrowave, wattage: e.target.value })}
              />
              <button
                style={styles.customButton}
                onClick={() => {
                  if (customMicrowave.name && customMicrowave.wattage) {
                    setSelectedMicrowave({
                      name: customMicrowave.name,
                      wattage: Number(customMicrowave.wattage),
                    });
                    setStep(2);
                  }
                }}
              >
                Add Custom Microwave
              </button>
            </div>
          </>
        )}

        {/* PAGE 2 — Preferences */}
        {step === 2 && selectedMicrowave && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Set Your Preferences</h3>
            <div style={styles.preferenceItem}>
              <label>🌡 Heat Level: {preferences.heat}%</label>
              <input type="range" min="0" max="100" value={preferences.heat} onChange={(e) => setPreferences({...preferences, heat: e.target.value})}/>
            </div>
            <div style={styles.preferenceItem}>
              <label>🍲 Portion Size: {preferences.portion}x</label>
              <input type="range" min="1" max="3" value={preferences.portion} onChange={(e) => setPreferences({...preferences, portion: e.target.value})}/>
            </div>
            <div style={styles.preferenceItem}>
              <label>💧 Moisture Level: {preferences.moisture}%</label>
              <input type="range" min="0" max="100" value={preferences.moisture} onChange={(e) => setPreferences({...preferences, moisture: e.target.value})}/>
            </div>
            <button style={styles.button} onClick={() => setStep(3)}>Next: Take Photo</button>
          </div>
        )}

        {/* PAGE 3 — Camera & Results */}
        {step === 3 && selectedMicrowave && (
          <>
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Microwave Selected</h3>
              <div style={styles.selectedInfo}>
                <strong>{selectedMicrowave.name}</strong>
                <div>Wattage: {selectedMicrowave.wattage} W</div>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Take Photo of Food</h3>
              <video ref={videoRef} autoPlay style={styles.video} />
              <button style={styles.button} onClick={captureImage}>📸 Capture Food</button>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            {capturedImage && (
              <div style={styles.card}>
                <h4 style={styles.sectionTitle}>Captured Image</h4>
                <img src={capturedImage} alt="Captured food" style={styles.previewImage} />
              </div>
            )}

            {prediction && (
              <div style={styles.resultBox}>
                <div>🍽 Detected: {prediction.food}</div>
                <div>⏱ Microwave Time: {prediction.time} sec</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    background: "#F3EDE7", // cream/light milk background
  },
  container: { width: "100%", maxWidth: "900px" },
  header: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px",
    padding: "15px 0",
    borderRadius: "18px",
    color: "#3E2C2A",
    background: "#FFF9F4", // light cream for header
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  tabsContainer: { display: "flex", borderBottom: "2px solid #D8BFA6", marginBottom: "15px" },
  tab: { flex: 1, textAlign: "center", padding: "12px 0", cursor: "pointer", fontWeight: "600", color: "#7B5E57", transition: "0.2s ease" },
  activeTab: { borderBottom: "4px solid #3E2C2A", color: "#3E2C2A" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", padding: "10px 0" },
  microwaveCard: { background: "#FFF9F4", borderRadius: "20px", padding: "20px", textAlign: "center", cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s", color: "#3E2C2A" },
  mwWattage: { marginTop: "8px", fontWeight: "500" },
  card: { background: "#FFF9F4", padding: "20px", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)", marginBottom: "20px", color: "#3E2C2A" },
  sectionTitle: { marginBottom: "12px", fontWeight: "600" },
  selectedInfo: { fontSize: "16px" },
  video: { width: "100%", borderRadius: "18px", marginBottom: "15px" },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    color: "#FFF9F4", // light text for contrast
    background: "linear-gradient(90deg, #BFA17E, #D9B382)", // milk-tea brown button
    marginTop: "10px",
    transition: "0.2s ease",
  },
  previewImage: { width: "100%", borderRadius: "14px" },
  resultBox: { background: "#F3EDE7", padding: "18px", borderRadius: "20px", fontWeight: "600", textAlign: "center", color: "#FFF9F4", boxShadow: "0 8px 25px rgba(0,0,0,0.05)" },
  preferenceItem: { marginBottom: "20px", display: "flex", flexDirection: "column" },
  customContainer: { marginTop: "20px", display: "flex", gap: "10px", flexDirection: "column", alignItems: "center" },
  input: { padding: "10px", borderRadius: "10px", border: "1px solid #BFA17E", width: "80%", textAlign: "center" },
  customButton: { padding: "12px", borderRadius: "14px", border: "none", fontWeight: "600", fontSize: "16px", cursor: "pointer", background: "#BFA17E", color: "#FFF9F4", width: "80%" },
};
export default App;