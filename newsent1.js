// ✅ Udemy AI Bookmarklet Tool – FINAL VERSION
(async () => {
  // ========== CONFIG ========== //
  const API = "http://localhost:8000";
  const SNAP_INTERVAL = 2 * 60 * 1000;
  const TRIGGER_STATES = ["sleepy", "tired", "bored", "drowsy"];

  // ========== BASIC UI ========== //
  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed", top: "60px", right: "20px",
    background: "#fff", padding: "16px", width: "300px",
    fontFamily: "sans-serif", fontSize: "14px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.2)", borderRadius: "12px",
    zIndex: 999999, maxHeight: "80vh", overflowY: "auto"
  });

  panel.innerHTML = `
    <h2 style="margin-top:0;font-size:16px;">📚 AI Course Assistant</h2>
    <button id="dailyQuiz" style="margin:4px;">🧠 Daily Quiz</button>
    <button id="generateMeme" style="margin:4px;">😂 Meme Reward</button>
    <div id="aiOutput" style="margin-top:12px;"></div>
  `;

  document.body.appendChild(panel);

  // ========== Event Listeners ========== //
  document.getElementById("dailyQuiz").onclick = async () => {
    document.getElementById("aiOutput").innerHTML = "<b>Generating quiz…</b>";
    const q = [
      "Q1. What does HTML stand for?",
      "A) Hyper Text Markup Language",
      "B) HighText Machine Language",
      "C) Hyper Tabular Markup Language",
      "D) None of these"
    ].join("<br>");
    document.getElementById("aiOutput").innerHTML = q;
  };

  document.getElementById("generateMeme").onclick = () => {
    const img = document.createElement("img");
    img.src = "https://api.memegen.link/images/success/You_completed/Your_quiz!.png";
    img.style.maxWidth = "100%";
    document.getElementById("aiOutput").innerHTML = "";
    document.getElementById("aiOutput").appendChild(img);
  };

  // ========== EMOTION MONITOR POPUP ========== //
  const popup = document.createElement("div");
  Object.assign(popup.style, {
    position: "fixed", bottom: "20px", right: "20px",
    background: "#ff4444", color: "white", padding: "10px 16px",
    borderRadius: "10px", fontSize: "14px", fontWeight: "bold",
    fontFamily: "sans-serif", zIndex: 100000, display: "none",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  });
  popup.textContent = "😴 You look tired! Take a break.";
  document.body.appendChild(popup);

  const buzz = new Audio(
    "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQgAAA=="
  );

  function showAlert(message = "😴 You look tired!") {
    popup.textContent = message;
    popup.style.display = "block";
    buzz.play().catch(() => {});
    setTimeout(() => {
      popup.style.display = "none";
    }, 5000);
  }

  // ========== EMOTION TRACKING ========== //
  try {
    await fetch(API + "/start", { method: "POST" });

    let running = true;
    async function poll() {
      if (!running) return;
      try {
        const res = await fetch(API + "/latest");
        const data = await res.json();
        const mood = data.emotion || data.sentiment || "unknown";
        if (TRIGGER_STATES.includes(mood.toLowerCase())) {
          showAlert(`⚠️ You seem ${mood}! Time for a break.`);
        }
      } catch (_) {
        // nothing
      }
      setTimeout(poll, SNAP_INTERVAL);
    }

    poll();

    window.addEventListener("keydown", async (e) => {
      if (e.key === "Escape") {
        running = false;
        await fetch(API + "/stop", { method: "POST" });
        showAlert("🛑 Emotion monitoring stopped.");
      }
    });
  } catch (err) {
    console.warn("❌ Emotion API offline");
  }
})();
