import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import React, { useState, useRef, useEffect } from "react";


/* -------------------- PRESET MICROWAVES -------------------- */
const DEFAULT_MICROWAVES = [
{ name: "LG LMC1575ST", wattage: 1200 },
{ name: "Panasonic NN-SN686S", wattage: 1200 },
{ name: "Toshiba EM131A5C-SS", wattage: 1100 },
{ name: "Breville BMO734XL", wattage: 1100 },
{ name: "Kenmore 72122", wattage: 1100 },
{ name: "Sharp ZSMC113", wattage: 1050 },
{ name: "Emerson MWG9115SB", wattage: 1000 },
{ name: "Samsung MS14K6000AS", wattage: 1000 },
{ name: "Hamilton Beach 1000W", wattage: 1000 },
{ name: "Whirlpool WMC20005YB", wattage: 1000 },
{ name: "GE JES1095SMSS", wattage: 950 },
{ name: "Daewoo KOR6L77", wattage: 950 },
{ name: "Magic Chef MCM1111ST", wattage: 900 },
{ name: "Black+Decker EM720CB7", wattage: 700 },
];


const MASS_PRESETS = [
 { label: "🖊 Pen", value: 20 },
 { label: "📕 Paperback Book", value: 300 },
 { label: "🧴 Water Bottle", value: 500 },
 { label: "🧸 Teddy Bear", value: 400 },
 { label: "👜 Handbag", value: 700 },
 { label: "💻 Laptop", value: 1500 },
 { label: "🛋 Couch Cushion", value: 2000 },
 { label: "🪑 Chair", value: 5000 },
];


/* -------------------- SPECIFIC HEAT -------------------- */
const SPECIFIC_HEAT_CATEGORIES = {
high: { label: "High Moisture (Water-Based)", value: 4.0 },
medium: { label: "Medium Moisture (Meat/Dense)", value: 3.5 },
low: { label: "Low Moisture (Dry/Bread)", value: 2.8 },
};
const FOOD_SPECIFIC_HEAT = {
 churros: 2.8,
 hot_and_sour_soup: 4.0,
 samosa: 2.9,
 sashimi: 3.8,
 pork_chop: 3.4,
 spring_rolls: 2.9,
 panna_cotta: 3.2,
 beef_tartare: 3.6,
 greek_salad: 3.9,
 foie_gras: 3.0,
 tacos: 3.3,
 pad_thai: 3.6,
 poutine: 3.1,
 ramen: 3.9,
 pulled_pork_sandwich: 3.3,
 bibimbap: 3.6,
 beignets: 2.8,
 apple_pie: 2.8,
 crab_cakes: 3.3,
 risotto: 3.7,
 paella: 3.6,
 steak: 3.3,
 baby_back_ribs: 3.3,
 miso_soup: 4.0,
 frozen_yogurt: 2.3,
 club_sandwich: 3.2,
 carrot_cake: 2.8,
 falafel: 3.0,
 bread_pudding: 2.9,
 chicken_wings: 3.3,
 gnocchi: 3.5,
 caprese_salad: 3.7,
 creme_brulee: 3.1,
 escargots: 3.6,
 chocolate_cake: 2.8,
 tiramisu: 3.0,
 spaghetti_bolognese: 3.6,
 mussels: 3.7,
 scallops: 3.7,
 baklava: 2.7,
 edamame: 3.8,
 macaroni_and_cheese: 3.4,
 pancakes: 2.9,
 garlic_bread: 2.7,
 beet_salad: 3.9,
 onion_rings: 2.8,
 red_velvet_cake: 2.8,
 grilled_salmon: 3.5,
 chicken_curry: 3.6,
 deviled_eggs: 3.2,
 caesar_salad: 3.8,
 hummus: 3.4,
 fish_and_chips: 3.1,
 lasagna: 3.5,
 peking_duck: 3.2,
 guacamole: 3.6,
 strawberry_shortcake: 2.9,
 clam_chowder: 3.8,
 croque_madame: 3.2,
 french_onion_soup: 3.9,
 beef_carpaccio: 3.6,
 fried_rice: 3.5,
 donuts: 2.7,
 gyoza: 3.3,
 ravioli: 3.5,
 fried_calamari: 3.1,
 spaghetti_carbonara: 3.5,
 french_toast: 3.0,
 lobster_bisque: 3.9,
 ceviche: 3.8,
 bruschetta: 3.0,
 french_fries: 3.0,
 shrimp_and_grits: 3.6,
 filet_mignon: 3.3,
 hamburger: 3.3,
 dumplings: 3.4,
 tuna_tartare: 3.7,
 sushi: 3.6,
 cheese_plate: 3.1,
 eggs_benedict: 3.2,
 cup_cakes: 2.8,
 takoyaki: 3.2,
 chocolate_mousse: 3.0,
 breakfast_burrito: 3.4,
 hot_dog: 3.2,
 macarons: 2.7,
 waffles: 2.9,
 seaweed_salad: 3.9,
 cannoli: 2.9,
 huevos_rancheros: 3.4,
 pizza: 3.2,
 chicken_quesadilla: 3.3,
 pho: 4.0,
 prime_rib: 3.3,
 cheesecake: 3.0,
 ice_cream: 2.1,
 omelette: 3.2,
 grilled_cheese_sandwich: 3.1,
 lobster_roll_sandwich: 3.4,
 nachos: 3.0,
 oysters: 3.8
};

const MICROWAVE_EFFICIENCY = 0.6;

function App() {
const [step, setStep] = useState(1);
const [microwaves, setMicrowaves] = useState(DEFAULT_MICROWAVES);
const [selectedMicrowave, setSelectedMicrowave] = useState(null);
const [customMicrowave, setCustomMicrowave] = useState({ name: "", wattage: "" });
const [microwaveTime, setMicrowaveTime] = useState(null);
const [preferences, setPreferences] = useState({
 initialTemp: 21, // default room temp
 startingCondition: "room",
 targetTemp: 60,
 mass: ""
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

   // ✅ SAVE IMAGE FOR PREVIEW
   const previewUrl = URL.createObjectURL(blob);
   setCapturedImage(previewUrl);
   setImageBlob(blob);


   // ✅ AUTO ANALYZE
   sendImageToAPI(blob);
 }, "image/png");
};
//send image to API
const sendImageToAPI = async (blob) => {
 const formData = new FormData();
 formData.append("image", blob);


 try {
   const response = await fetch("http://34.124.219.23:5000/predict", {
     method: "POST",
     body: formData
   });


   const data = await response.json();


   setFoodInput(data.prediction);


   const result = detectSpecificHeatCategory(data.prediction);
   setSpecificHeatResult(result);


   // 🔥 AUTO CALCULATE TIME
   const deltaT = preferences.targetTemp - preferences.initialTemp;


   const timeSeconds =
     (preferences.mass *
       result.value *
       deltaT) /
     (MICROWAVE_EFFICIENCY * selectedMicrowave.wattage);


   setMicrowaveTime(timeSeconds);


   // 🔥 go straight to results
   setStep(4);




 } catch (err) {
   console.error("Upload error:", err);
 }
};




const reanalyzeImage = () => {
 if (!imageBlob) {
   alert("No image to analyze");
   return;
 }
 sendImageToAPI(imageBlob);
};

/* -------------------- SPECIFIC HEAT TEST FUNCTION -------------------- */
const detectSpecificHeatCategory = (food) => {
 const key = food.toLowerCase().replace(/\s+/g, "_");




 // 🔥 First: check exact food match
 if (FOOD_SPECIFIC_HEAT[key]) {
   return {
     label: "Exact Match",
     value: FOOD_SPECIFIC_HEAT[key]
   };
 }




 // fallback to your old category logic
 const f = food.toLowerCase();

 if (f.includes("soup") || f.includes("rice") || f.includes("pasta") || f.includes("vegetable"))
   return SPECIFIC_HEAT_CATEGORIES.high;

 if (f.includes("chicken") || f.includes("beef") || f.includes("meat"))
   return SPECIFIC_HEAT_CATEGORIES.medium;

 if (f.includes("bread") || f.includes("cake") || f.includes("pastry"))
   return SPECIFIC_HEAT_CATEGORIES.low;

 return SPECIFIC_HEAT_CATEGORIES.high;
};

/* -------------------- condition selection function -------------------- */
const handleStartingCondition = (condition) => {
 let temp;

 if (condition === "freezer") temp = -18;
 else if (condition === "fridge") temp = 3;
 else temp = 21;

 setPreferences({
   ...preferences,
   startingCondition: condition,
   initialTemp: temp
 });
};

/* -------------------- Target temp func -------------------- */
const getTempLabel = (temp) => {
 if (temp < 25) return "Room Temperature";
 if (temp < 35) return "Warm";
 if (temp < 45) return "Hot";
 if (temp < 55) return "Very Hot";
 return "Scalding Hot";
};

/* -------------------- TABS -------------------- */
const renderTabs = () => (
 <div style={styles.tabsContainer}>
   {["Microwaves", "Preferences", "Camera", "Time"].map((label, index) => (
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
     <h1 style={styles.header}>Smart Microwave AI</h1>
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


         {/* <label>🌡 Initial Temperature: {preferences.InitialTemp}°C</label>
         <p></p>
         <input
           type="range"
           min="30"
           max="60"
           value={preferences.InitialTemp}
           onChange={(e) =>
             setPreferences({ ...preferences, InitialTemp: Number(e.Initial.value), })
           }
 
         /> */}

<h4>Starting Condition of Food</h4>
<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
 <button
   style={{
     ...styles.button,
     background:
       preferences.startingCondition === "freezer" ? "#D9BC97" : "#BFA17E"
   }}
   onClick={() => handleStartingCondition("freezer")}
 >
   From Freezer
 </button>
 <button
   style={{
     ...styles.button,
     background:
       preferences.startingCondition === "fridge" ? "#D9BC97" : "#BFA17E"
   }}
   onClick={() => handleStartingCondition("fridge")}
 >
   From Refrigerator
 </button>
 <button
   style={{
     ...styles.button,
     background:
       preferences.startingCondition === "room" ? "#D9BC97" : "#BFA17E"
   }}
   onClick={() => handleStartingCondition("room")}
 >
   Room Temperature
 </button>
</div>
{/* delete later */}
<p style={{ marginTop: "10px" }}>
 Estimated starting temp: {preferences.initialTemp}°C
</p>
{/* delete later */}

         <p></p>
         <p></p>




         <label>
 Desired heat: {" "}
 <strong>{getTempLabel(preferences.targetTemp)}</strong>
</label>


{/* <input
 type="range"
 min="20"
 max="60"
 value={preferences.targetTemp}
 onChange={(e) =>
   setPreferences({
     ...preferences,
     targetTemp: Number(e.target.value),
   })
 }
/> */}






<Box sx={{ width: 400, marginTop: 2, mx: "auto" }}>
 <Slider
   value={preferences.targetTemp}
   min={20}
   max={60}
   valueLabelDisplay="auto"
   // add the C symbol
   valueLabelFormat={(value) => `${value}°C`}
   onChange={(e, newValue) =>
     setPreferences({ ...preferences, targetTemp: newValue })
   }
   sx={{
     height: 10, // thicker slider
     '& .MuiSlider-thumb': {
       height: 24,
       width: 24,
       backgroundColor: '#BFA17E',
       border: '2px solid white',
     },
     '& .MuiSlider-track': {
       border: 'none',
       backgroundColor: '#BFA17E',
     },
     '& .MuiSlider-rail': {
       opacity: 0.5,
       backgroundColor: '#bfbfbf',
     },
     '& .MuiSlider-valueLabel': {
       fontSize: 14,
       backgroundColor: '#BFA17E',
       color: 'white',
     },
   }}
 />
</Box> 




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
         <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>


           <h4 style={{ marginTop: "15px" }}>Or pick a common item:</h4>


           <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
         {MASS_PRESETS.map((item, index) => (
           <button
             key={index}
             style={{
               ...styles.button,
               width: "auto",
               padding: "8px 12px",
               background: preferences.mass === item.value ? "#D9BC97" : "#BFA17E",
             }}
             onClick={() => setPreferences({ ...preferences, mass: item.value })}
           >
             {item.label} ({item.value} g)
           </button>
         ))}
</div>


</div>
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
     🔥 Analyze Food
   </button>
   <canvas ref={canvasRef} style={{ display: "none" }} />
 </div>
</>
)}




     {/* -------------------- STEP 4: SPECIFIC HEAT TEST -------------------- */}
     {step === 4 && (
       <div style={styles.card}>
         <h3>Time:</h3>

         {specificHeatResult && (
           <div style={{ marginTop: 20 }}>
             <div>Category: {specificHeatResult.label}</div>
             <div>Specific Heat: {specificHeatResult.value} J/g°C</div>
             <div>Food: {foodInput}</div>
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
{capturedImage && (
 <div style={{ marginTop: 20 }}>
   <img
     src={capturedImage}
     alt="Captured"
     style={styles.previewImage}
   />


   <button
     style={styles.button}
     onClick={reanalyzeImage}
   >
     🔁 Analyze Again
   </button>
 </div>
)}

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