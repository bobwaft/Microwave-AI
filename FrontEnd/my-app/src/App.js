import React, { useState, useRef, useEffect } from "react";

/* -------------------- PRESET MICROWAVES -------------------- */
const DEFAULT_MICROWAVES = [
  { name: "Panasonic NN-SN686S", wattage: 1200 },
  { name: "Toshiba EM131A5C-SS", wattage: 1100 },
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

/* -------------------- SPECIFIC HEAT CATEGORIES (TEMP TEST) -------------------- */
const SPECIFIC_HEAT_CATEGORIES = {
  high: { label: "High Moisture (Water-Based)", value: 4.0 },
  medium: { label: "Medium Moisture (Meat/Dense)", value: 3.5 },
  low: { label: "Low Moisture (Dry/Bread)", value: 2.8 },
};

const MICROWAVE_EFFICIENCY = 0.6;

function App() {
  const [step, setStep] = useState(1);
  const [microwaves, setMicrowaves] = useState(DEFAULT_MICROWAVES);
  const [selectedMicrowave, setSelectedMicrowave] = useState(null);
  const [customMicrowave, setCustomMicrowave] = useState({ name: "", wattage: "" });
const [microwaveTime, setMicrowaveTime] = useState(null);


  const [preferences, setPreferences] = useState({
    targetTemp: 60,
    mass: "",
    moisture: 50,
  });

  const [capturedImage, setCapturedImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);   
  const [foodInput, setFoodInput] = useState("");
  const [specificHeatResult, setSpecificHeatResult] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);


//calc
  const calculateMicrowaveTime = () => {
  if (!specificHeatResult) {
    alert("Analyze food first");
    return;
  }

  const deltaT = preferences.targetTemp - preferences.initialTemp;
  const timeSeconds =
    (preferences.mass *
      specificHeatResult.value *
      deltaT) /
    (MICROWAVE_EFFICIENCY * selectedMicrowave.wattage);
  setMicrowaveTime(timeSeconds);
};

  /* -------------------- CAMERA -------------------- */
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

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const previewUrl = URL.createObjectURL(blob);
      setCapturedImage(previewUrl);
      setImageBlob(blob);
    }, "image/png");
  };
//send image to API
const sendImageToAPI = async () => {
  if (!imageBlob) {
    alert("Capture an image first");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageBlob);

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    console.log("Prediction:", data);

  } catch (err) {
    console.error("Upload error:", err);
  }
};


  /* -------------------- SPECIFIC HEAT TEST FUNCTION -------------------- */
  const detectSpecificHeatCategory = (food) => {
    const f = food.toLowerCase();

    if (f.includes("soup") || f.includes("rice") || f.includes("pasta") || f.includes("vegetable"))
      return SPECIFIC_HEAT_CATEGORIES.high;

    if (f.includes("chicken") || f.includes("beef") || f.includes("meat"))
      return SPECIFIC_HEAT_CATEGORIES.medium;

    if (f.includes("bread") || f.includes("cake") || f.includes("pastry"))
      return SPECIFIC_HEAT_CATEGORIES.low;

    return SPECIFIC_HEAT_CATEGORIES.high;
  };

  /* -------------------- TABS -------------------- */
  const renderTabs = () => (
    <div style={styles.tabsContainer}>
      {["Microwaves", "Preferences", "Camera", "Test Specific Heat"].map((label, index) => (
        <div
          key={index}
          style={{ ...styles.tab, ...(step === index + 1 ? styles.activeTab : {}) }}
          onClick={() => {
            if (index === 0) setStep(1);
            else if (selectedMicrowave) setStep(index + 1);
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.header}>🍲 Smart Microwave AI</h1>
        {renderTabs()}

        {/* -------------------- STEP 1: MICROWAVES -------------------- */}
        {step === 1 && (
          <>
            <div style={styles.gridContainer}>
              {microwaves.map((mw, idx) => (
                <div
                  key={idx}
                  style={styles.microwaveCard}
                  onClick={() => {
                    setSelectedMicrowave(mw);
                    setStep(2);
                  }}
                >
                  <strong>{mw.name}</strong>
                  <div>{mw.wattage} W</div>
                </div>
              ))}
            </div>

            <div style={styles.customContainer}>
              <input
                style={styles.input}
                placeholder="Microwave Name"
                value={customMicrowave.name}
                onChange={(e) =>
                  setCustomMicrowave({ ...customMicrowave, name: e.target.value })
                }
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Wattage (W)"
                value={customMicrowave.wattage}
                onChange={(e) =>
                  setCustomMicrowave({ ...customMicrowave, wattage: e.target.value })
                }
              />
              <button
                style={styles.button}
                onClick={() => {
                  if (customMicrowave.name && customMicrowave.wattage) {
                    const newMicrowave = {
                      name: customMicrowave.name,
                      wattage: Number(customMicrowave.wattage),
                    };
                    setMicrowaves([...microwaves, newMicrowave]);
                    setCustomMicrowave({ name: "", wattage: "" });
                  }
                }}
              >
                Add Custom Microwave
              </button>
            </div>
          </>
        )}

        {/* -------------------- STEP 2: PREFERENCES -------------------- */}
        {step === 2 && selectedMicrowave && (
          <div style={styles.card}>

            <h3>Set Heating Preferences</h3>

            <label>🌡 Initial Temperature: {preferences.InitialTemp}°C</label>
            <p></p>
            <input
              type="range"
              min="30"
              max="60"
              value={preferences.InitialTemp}
              onChange={(e) =>
                setPreferences({ ...preferences, InitialTemp: Number(e.Initial.value), })
              }
            
            />

            <p></p>
            <p></p>
            
            <label>🌡 Target Temperature: {preferences.targetTemp}°C</label>
             <p></p>
            <input
              type="range"
              min="30"
              max="60"
              value={preferences.targetTemp}
              onChange={(e) =>
                setPreferences({ ...preferences, targetTemp: Number(e.target.value), })
              }
            />
            <p></p>
            <label>⚖ Mass (grams)</label>
            <input
              type="number"
              style={styles.input}
              placeholder="Enter mass in grams"
              value={preferences.mass}
              onChange={(e) =>
                setPreferences({ ...preferences, mass: Number(e.target.value), })
              }
            />

            <button style={styles.button} onClick={() => setStep(3)}>
              Next
            </button>
          </div>
        )}

        
   {/* -------------------- STEP 3: CAMERA -------------------- */}
{step === 3 && selectedMicrowave && (
  <>
    <div style={styles.card}>
      <strong>{selectedMicrowave.name}</strong>
      <div>{selectedMicrowave.wattage} W</div>
    </div>

    <div style={styles.card}>
      <video ref={videoRef} autoPlay style={styles.video} />
      <button style={styles.button} onClick={captureImage}>
        📸 Capture Food
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>

    {capturedImage && (
      <div style={styles.card}>
        <img src={capturedImage} alt="Captured" style={styles.previewImage} />

        <button style={styles.button} onClick={sendImageToAPI}>
          Analyze Food
        </button>
      </div>
    )}
  </>
)}

        {/* -------------------- STEP 4: SPECIFIC HEAT TEST -------------------- */}
        {step === 4 && (
          <div style={styles.card}>
            <h3>Test Specific Heat Category (Temporary)</h3>

            <input
              style={styles.input}
              placeholder="Enter food (e.g. soup, chicken, bread)"
              value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
            />

            <button
              style={styles.button}
              onClick={() => {
                const result = detectSpecificHeatCategory(foodInput);
                setSpecificHeatResult(result);
              }}
            >
              Classify Food
            </button>

            {specificHeatResult && (
              <div style={{ marginTop: 20 }}>
                <div>Category: {specificHeatResult.label}</div>
                <div>Specific Heat: {specificHeatResult.value} J/g°C</div>
              </div>
            )}

            <button
              style={styles.button}
              onClick={calculateMicrowaveTime}
            >
  Calculate Microwave Time

  {microwaveTime && (
  <div style={{ marginTop: 20 }}>
    <strong>Microwave Time:</strong>
    <div>{microwaveTime.toFixed(1)} seconds</div>
    <div>{(microwaveTime / 60).toFixed(2)} minutes</div>
  </div>
)}
</button>

          </div>
        )}
      </div>
    </div>
  );
}







/* -------------------- STYLES -------------------- */
const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    background: "#F3EDE7",
  },
  container: { width: "100%", maxWidth: "900px" },
  header: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  tabsContainer: { display: "flex", marginBottom: "20px" },
  tab: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  activeTab: {
    borderBottom: "3px solid black",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  microwaveCard: {
    background: "#FFF9F4",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  card: {
    background: "#FFF9F4",
    padding: "20px",
    borderRadius: "15px", 
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#BFA17E",
    color: "white",
    fontWeight: "600",
    marginTop: "10px",
    cursor: "pointer",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    marginTop: "10px",
    marginBottom: "10px",
  },
  customContainer: {
    marginTop: "20px",
  },
  video: { width: "100%", borderRadius: "10px", marginBottom: "15px" },
  previewImage: { width: "100%", borderRadius: "10px" },
};

export default App;