// ========= EMOTION MONITOR SYSTEM =========
(async function () {
  const API = "http://localhost:8000";
  const SNAP_INTERVAL = 2 * 60 * 1000; // every 2 min
  const TRIGGER_STATES = ["sleepy", "tired", "bored", "drowsy"];

  // ✅ Floating popup box (like toast inside bookmarklet UI)
  const popup = document.createElement("div");
  Object.assign(popup.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#ff4444",
    color: "white",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    zIndex: 100000,
    display: "none",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  });
  popup.textContent = "😴 You look tired! Take a break.";
  document.body.appendChild(popup);

  // ✅ Audio alert
  const buzz = new Audio(
    "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQgAAA=="
  );

  function showAlert(message = "😴 You look tired! Take a break.") {
    popup.textContent = message;
    popup.style.display = "block";
    buzz.play().catch(() => {});
    setTimeout(() => {
      popup.style.display = "none";
    }, 5000); // hide after 5 sec
  }

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
          showAlert(`😴 You seem ${mood}. Take a break!`);
        }
      } catch (_) {
        // no-op
      }
      setTimeout(poll, SNAP_INTERVAL);
    }

    poll();

    // ESC to stop monitoring
    window.addEventListener("keydown", async (e) => {
      if (e.key === "Escape") {
        running = false;
        await fetch(API + "/stop", { method: "POST" });
        popup.textContent = "🛑 Emotion monitoring stopped.";
        popup.style.background = "#444";
        popup.style.display = "block";
        setTimeout(() => popup.remove(), 4000);
      }
    });
  } catch (err) {
    console.error("❌ Could not connect to backend:", err);
  }
})();
