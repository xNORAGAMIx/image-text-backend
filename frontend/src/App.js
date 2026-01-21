import { useState } from "react";
import "./App.css";

function App() {
  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Mission text
  const [missionText, setMissionText] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // 🔹 Run Detection → BACKEND CONNECTED
  const handleRunDetection = async () => {
    if (!imageFile || !missionText) return;

    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("text", missionText);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Detection failed:", error);
      alert("Backend error. Check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        Identify the Imposter Pokémon
        <span className="status">
          {loading ? "Processing..." : "Ready"}
        </span>
      </header>

      <div className="layout">
        {/* LEFT COLUMN */}
        <div className="left">
          <div className="card">
            <h3>Upload Image</h3>
            <p className="subtitle">Select an image to detect objects</p>

            {/* IMAGE UPLOAD */}
            <div className="upload-box">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
              />

              <p>
                Drop your image here <br />
                or click to browse
              </p>

              <span>Supports PNG, JPG, WEBP</span>
            </div>

            {/* MISSION TEXT */}
            <div className="mission-box" style={{ marginTop: "16px" }}>
              <h3>Mission Instructions</h3>
              <p className="subtitle">
                Describe which Pokémon to attack and protect
              </p>

              <textarea
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                placeholder={`Enter mission instructions here...
Example:
Neutralize all Bulbasaurs.
Do not harm Pikachu or Charizard.`}
              />

              <span className="mission-help">
                This text is used to identify target and protected Pokémon.
              </span>
            </div>

            {/* RUN BUTTON */}
            <button
              className="run-btn"
              onClick={handleRunDetection}
              disabled={!imageFile || !missionText || loading}
              style={{
                opacity:
                  !imageFile || !missionText || loading ? 0.6 : 1,
                cursor:
                  !imageFile || !missionText || loading
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {loading ? "Running Detection..." : "Run Detection"}
            </button>
          </div>

          {/* RESULTS */}
          <div className="card">
            <h3>Results</h3>

            {!results ? (
              <div className="empty">
                <p>No detections yet</p>
                <span>Upload an image and run detection</span>
              </div>
            ) : (
              <pre
                style={{
                  fontSize: "12px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {JSON.stringify(results, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="card preview">
          <h3>Detection Preview</h3>

          <div className="preview-box">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "12px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <>
                <p>No image selected</p>
                <span>Upload an image to start detection</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
