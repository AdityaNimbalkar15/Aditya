// ====================================================
// 🔌 Sentiment‑Analysis Integration  (unchanged)
// ====================================================
(async () => {
  const API = "http://localhost:8000";
  try {
    await fetch(API + "/start", { method: "POST" });
    let running = true;
    async function poll() {
      if (!running) return;
      try {
        const res = await fetch(API + "/latest");
        const data = await res.json();
        console.clear();
        console.table(data);
      } catch (_) {
        console.warn("Waiting for sentiment data…");
      }
      setTimeout(poll, 1000);
    }
    poll();
    window.addEventListener("keydown", async (e) => {
      if (e.key === "Escape") {
        running = false;
        await fetch(API + "/stop", { method: "POST" });
        console.log("Emotion monitor stopped.");
      }
    });
  } catch (err) {
    console.error("⚠️ Sentiment‑analysis API unreachable:", err);
  }
})();

// ====================================================
// ✅ Udemy AI Bookmarklet Tool – FINAL VERSION + Meme Button
// ====================================================
(async () => {
  if (document.getElementById("udemyMemeBtn")) return;
  if (!location.hostname.includes("udemy.com")) return alert("⚠️ Open this on a Udemy course page.");

  try {
    const { default: tool } = await import("https://cdn.jsdelivr.net/gh/04Sahil/mama-dev@main/trial.js?t=" + Date.now());
    if (typeof tool === "function") tool();
  } catch (e) {
    console.warn("Main Udemy analyzer script failed to load", e);
  }

  const templates = ["112126428", "131087935", "87743020", "181913649", "61579", "101470", "178591752", "217743513", "97984", "148909805"];
  const getRandomTemplate = () => templates[Math.floor(Math.random() * templates.length)];

  const memeBtn = document.createElement("button");
  memeBtn.id = "udemyMemeBtn";
  memeBtn.textContent = "🎭 Show Me a Meme";
  memeBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 10001;
    padding: 10px 15px;
    background: #2c2c2c;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,.35);
  `;

  memeBtn.onclick = async () => {
    const topic = document.querySelector("h1").textContent.trim();
    const prompt = `You're a meme caption writer. Make a funny meme about: "${topic}".\nFormat:\nTop: <text>\nBottom: <text>`;
    const resp = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": "Bearer zXH8KUSA3ncfZcxvIAZx5boAlGlTirN6LJmp706Q",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "command", prompt, max_tokens: 50, temperature: 0.9 })
    });
    const json = await resp.json();
    const lines = json.generations?.[0]?.text?.split("\n") || [];
    const text0 = lines.find(l => l.startsWith("Top:"))?.replace("Top:", "").trim() || "Debugging for hours";
    const text1 = lines.find(l => l.startsWith("Bottom:"))?.replace("Bottom:", "").trim() || "Then it was a semicolon 😭";

    const form = new URLSearchParams();
    form.append("template_id", getRandomTemplate());
    form.append("username", "SHANTNUTALOKAR");
    form.append("password", "Sahil@9043");
    form.append("text0", text0);
    form.append("text1", text1);
    const imgRes = await fetch("https://api.imgflip.com/caption_image", { method: "POST", body: form });
    const memeJson = await imgRes.json();
    if (!memeJson.success) return alert("❌ Imgflip error: " + memeJson.error_message);

    const pop = document.createElement("div");
    pop.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10002;
      background: #fff;
      border: 2px solid #000;
      border-radius: 10px;
      padding: 12px;
      box-shadow: 2px 2px 10px rgba(0,0,0,.35);
      max-width: 280px;
      text-align: center;
      font-family: sans-serif;
    `;
    pop.innerHTML = `<strong>🎉 Meme Unlocked!</strong><br><img src="${memeJson.data.url}" style="max-width:100%;border-radius:6px;margin-top:10px"/><br><button style="margin-top:8px;padding:4px 10px;border:none;background:#f44336;color:#fff;border-radius:4px;cursor:pointer;">Close</button>`;
    pop.querySelector("button").onclick = () => pop.remove();
    document.body.appendChild(pop);
  };

  document.body.appendChild(memeBtn);
})();
