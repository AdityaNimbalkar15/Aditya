// ====================================================
// 🔌 Sentiment-Analysis Integration  (NEW block)
// ====================================================
// (async () => {
//   const API = "http://localhost:8000";

//   try {
//     // 1  Launch the Python backend (no-op if already running)
//     await fetch(API + "/start", { method: "POST" });

//     // 2  Poll /latest every second and log to console
//     let running = true;
//     async function poll() {
//       if (!running) return;
//       try {
//         const res  = await fetch(API + "/latest");
//         const data = await res.json();
//         console.clear();
//         console.table(data);
//       } catch (_) {
//         console.warn("Waiting for sentiment data…");
//       }
//       setTimeout(poll, 1000);
//     }
//     poll();

//     // 3  Press Esc anywhere to stop analysis
//     window.addEventListener("keydown", async (e) => {
//       if (e.key === "Escape") {
//         running = false;
//         await fetch(API + "/stop", { method: "POST" });
//         console.log("Emotion monitor stopped.");
//       }
//     });
//   } catch (err) {
//     console.error("⚠️ Sentiment-analysis API unreachable:", err);
//   }
// })();

// ====================================================
// ✅ Udemy AI Bookmarklet Tool – ORIGINAL (unchanged)
// ====================================================
// ✅ Udemy AI Bookmarklet Tool – FINAL VERSION
// Features: Analysis, Chat, Project Suggestions, Quiz (with realistic MCQs)
// Use with Bookmarklet:
// javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Shantnu-Talokar/Mama-Developer/script.js?t='+Date.now();document.body.appendChild(s);})();

(function () {
    if (document.getElementById('udemyAnalyzerBtn')) return;
    if (!location.hostname.includes('udemy.com')) return alert('⚠️ Open this on a Udemy course page.');

    const btn = document.createElement('button');
    btn.id = 'udemyAnalyzerBtn';
    btn.textContent = '📘';
    btn.style.cssText =
        'position:fixed;bottom:20px;right:20px;background:#4CAF50;color:white;border:none;border-radius:50%;' +
        'width:60px;height:60px;font-size:28px;font-weight:bold;cursor:move;z-index:9999;box-shadow:0 4px 10px rgba(0,0,0,0.3);';

    const panel = document.createElement('div');
    panel.id = 'udemyAnalysisPanel';
    panel.style.cssText =
        'display:none;position:fixed;bottom:90px;right:20px;width:350px;height:600px;padding:15px;background:white;color:black;' +
        'border:1px solid #ccc;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.3);overflow:auto;z-index:9999;' +
        'font-family:sans-serif;font-size:14px;line-height:1.4;white-space:pre-wrap;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '❌';
    closeBtn.style.cssText =
        'position:absolute;top:8px;right:10px;background:none;border:none;font-size:16px;cursor:pointer;';
    closeBtn.onclick = () => (panel.style.display = 'none');
    panel.appendChild(closeBtn);
    document.body.appendChild(panel);

    let moved = false;
    btn.onmousedown = e => {
        moved = false;
        e.preventDefault();
        const sx = e.clientX - btn.getBoundingClientRect().left;
        const sy = e.clientY - btn.getBoundingClientRect().top;
        function mm(e) {
            moved = true;
            btn.style.left = e.pageX - sx + 'px';
            btn.style.top = e.pageY - sy + 'px';
            btn.style.bottom = 'auto';
            btn.style.right = 'auto';
            panel.style.left = parseInt(btn.style.left) + 'px';
            panel.style.top = parseInt(btn.style.top) - 630 + 'px';
        }
        document.addEventListener('mousemove', mm);
        btn.onmouseup = () => {
            document.removeEventListener('mousemove', mm);
            btn.onmouseup = null;
        };
    };
    btn.ondragstart = () => false;

    btn.onclick = async () => {
        if (moved) return;
        moved = false;

        const url = location.href;
        const title = document.querySelector('h1')?.innerText || 'Untitled Course';
        const apiKey = 'zXH8KUSA3ncfZcxvIAZx5boAlGlTirN6LJmp706Q';
        const endpoint = 'https://api.cohere.ai/v1/generate';
        const cohereQuery = async (p, max = 400) => {
            const r = await fetch(endpoint, {
                method: 'POST',
                headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'command-r-plus', prompt: p, max_tokens: max, temperature: 0.7 })
            });
            const d = await r.json();
            return d.generations?.[0]?.text || '⚠️ No response';
        };

        panel.style.display = 'block';
        panel.innerHTML = '<b>⏳ Analyzing course…</b>';
        panel.appendChild(closeBtn);

        try {
            const analysisPrompt =
                `You are an educational analyst. Analyze this Udemy course:\nTitle:${title}\nURL:${url}\n\n` +
                `Provide:\n1. Modules Covered\n2. Disadvantages\n3. Detailed Learning Outcomes`;
            const analysis = await cohereQuery(analysisPrompt, 500);

            panel.innerHTML = '<b>📘 Course Analysis:</b><br><br>' + analysis.replace(/\n/g, '<br>');
            panel.appendChild(closeBtn);

            const input = document.createElement('textarea');
            input.placeholder = 'Ask anything…';
            input.style.cssText = 'width:100%;height:60px;margin-top:10px;border-radius:5px;border:1px solid #ccc;padding:5px;resize:vertical;';
            const askBtn = document.createElement('button');
            askBtn.textContent = 'Ask';
            askBtn.style.cssText = 'margin-top:8px;padding:6px 12px;border:none;background:#007BFF;color:white;border-radius:4px;cursor:pointer;float:right;';
            const reply = document.createElement('div');
            reply.style.cssText = 'clear:both;margin-top:15px;';
            askBtn.onclick = async () => {
                if (!input.value.trim()) return;
                reply.innerHTML = '⏳ Thinking…';
                reply.innerHTML = '<b>💬 Response:</b><br>' + (await cohereQuery(input.value)).replace(/\n/g, '<br>');
            };
            panel.append(input, askBtn, reply);

            const modBtn = document.createElement('button');
            modBtn.textContent = '📋 Modules';
            modBtn.style.cssText = 'margin-top:10px;padding:6px 12px;border:none;background:#6c757d;color:white;border-radius:4px;cursor:pointer;float:left;';
            panel.appendChild(modBtn);

            const modulesArea = document.createElement('div');
            modulesArea.style = 'margin-top:15px;clear:both;';
            panel.appendChild(modulesArea);

            modBtn.onclick = () => {
                modulesArea.innerHTML = '<b>📂 Course Modules</b><br><br>';
                const mods = [...document.querySelectorAll('div[data-purpose="curriculum-section-container"] h3')];
                if (!mods.length) {
                    modulesArea.innerHTML += '❌ Could not find modules.';
                    return;
                }
                mods.forEach((m, i) => {
                    const key = 'udemyMod-' + i;
                    const chk = document.createElement('input');
                    chk.type = 'checkbox';
                    chk.checked = localStorage.getItem(key) === '1';
                    chk.onchange = () => localStorage.setItem(key, chk.checked ? '1' : '0');
                    const lbl = document.createElement('label');
                    lbl.style = 'display:block;margin:5px 0;';
                    lbl.append(chk, ' ', m.innerText.trim());
                    modulesArea.appendChild(lbl);
                });

                const projBtn = document.createElement('button');
                projBtn.textContent = '🎯 Suggest Projects';
                projBtn.style.cssText =
                    'margin-top:10px;padding:6px 12px;border:none;background:#28a745;color:white;border-radius:4px;cursor:pointer;';
                projBtn.onclick = async () => {
                    const sel = mods
                        .filter((_, i) => localStorage.getItem('udemyMod-' + i) === '1')
                        .map(m => m.innerText.trim());

                    if (!sel.length) return alert('Select modules first.');

                    let ideasDiv = document.getElementById('projectIdeasBox');
                    if (!ideasDiv) {
                        ideasDiv = document.createElement('div');
                        ideasDiv.id = 'projectIdeasBox';
                        modulesArea.appendChild(ideasDiv);
                    }

                    ideasDiv.innerHTML = '<b>⏳ Fetching ideas…</b>';

                    const ideas = await cohereQuery(
                        `I completed these modules:\n\n${sel.join('\n')}\n\nSuggest three hands-on project ideas.`,
                        350
                    );

                    ideasDiv.innerHTML = '<b>🚀 Project Ideas:</b><br>' + ideas.replace(/\n/g, '<br>');
                };

                modulesArea.appendChild(projBtn);

                const quizBtn = document.createElement('button');
                quizBtn.textContent = '📝 Quiz Me';
                quizBtn.style.cssText =
                    'margin-top:10px;margin-left:8px;padding:6px 12px;border:none;background:#ffc107;color:#000;border-radius:4px;cursor:pointer;';
                modulesArea.appendChild(quizBtn);

                let overlay = document.getElementById('udemyQuizOverlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'udemyQuizOverlay';
                    overlay.style.cssText =
                        'display:none;position:fixed;top:10%;left:10%;width:80%;height:80%;background:#fffbd6;' +
                        'border:6px solid #ff9800;border-radius:20px;z-index:10000;padding:25px;overflow:auto;' +
                        'box-shadow:0 8px 25px rgba(0,0,0,0.4);font-family:sans-serif;';
                    document.body.appendChild(overlay);
                }

                quizBtn.onclick = async () => {
                    const chosen = mods
                        .filter((_, i) => localStorage.getItem('udemyMod-' + i) === '1')
                        .map(m => m.innerText.trim());

                    if (!chosen.length) return alert('Select modules first.');

                    overlay.innerHTML = '<h2>📝 Generating quiz…</h2>';

                    const qPrompt =
                        `You are an advanced technical course quiz generator.\n` +
                        `Generate EXACTLY 5 high-quality multiple-choice questions (MCQs) based strictly on the technical content from these modules:\n` +
                        `${chosen.join('\n')}\n\n` +
                        `Guidelines:\n` +
                        `1. Questions must cover a range of difficulty levels: 2 easy, 2 medium, and 1 hard.\n` +
                        `2. Only include content that is clearly present in the modules.\n` +
                        `3. Each question must be clear, unambiguous, and test conceptual understanding or practical application.\n` +
                        `4. Include exactly 4 options (A–D). ONLY ONE must be correct.\n` +
                        `5. Wrap the correct option in <span class="answer"></span> tags.\n` +
                        `6. Avoid repeating questions or options.\n\n` +
                        `Format strictly as:\nQ1. <question>\nA) <opt>\nB) <opt>\nC) <opt>\nD) <opt>\n\n` +
                        `Begin:`;

                    try {
                        const txt = await cohereQuery(qPrompt, 650);
                        overlay.style.display = 'block';
                        overlay.innerHTML =
                            '<button id="closeQuiz" style="position:absolute;top:15px;right:20px;font-size:20px;' +
                            'background:#f44336;color:white;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;">✖</button>' +
                            '<h2 style="text-align:center;margin:10px 0 20px">📝 Module Quiz</h2>' +
                            '<form id="quizForm" style="font-size:16px;line-height:1.6"></form>' +
                            '<button id="submitQuiz" style="margin-top:25px;display:block;background:#4caf50;color:white;' +
                            'border:none;padding:10px 20px;border-radius:6px;cursor:pointer;margin-left:auto;margin-right:auto;">Show Answers</button>' +
                            '<div id="scoreBox" style="text-align:center;font-size:18px;margin-top:15px;font-weight:bold;"></div>';

                        document.getElementById('closeQuiz').onclick = () => (overlay.style.display = 'none');
                        const form = overlay.querySelector('#quizForm');
                        const blocks = txt.match(/(?:Q?\d+[.)])[\s\S]*?(?=(?:Q?\d+[.)])|$)/g) || [];

                        const correctMap = [];
                        blocks.forEach((blk, qi) => {
                            const lines = blk.trim().split('\n').filter(Boolean);
                            const qLine = lines.shift();
                            const qDiv = document.createElement('div');
                            qDiv.style.marginBottom = '20px';
                            qDiv.innerHTML = `<b>${qLine.replace(/^Q?\d+[.)]\s*/, '')}</b><br><br>`;
                            const options = lines.slice(0, 4).map((line, oi) => {
                                const isCorrect = /class=["']answer["']/.test(line);
                                const text = line.replace(/<span class=["']answer["']>/, '').replace('</span>', '').replace(/^[A-Da-d][).]\s*/, '').trim();
                                return { text, isCorrect };
                            });
                            for (let i = options.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [options[i], options[j]] = [options[j], options[i]];
                            }
                            options.forEach((opt, oi) => {
                                const id = `q${qi}o${oi}`;
                                const radio = document.createElement('input');
                                radio.type = 'radio';
                                radio.name = `q${qi}`;
                                radio.id = id;
                                radio.setAttribute('data-correct', opt.isCorrect);
                                const label = document.createElement('label');
                                label.htmlFor = id;
                                label.style.cssText = 'display:block;margin:6px 0;padding:6px 10px;border-radius:5px;cursor:pointer;border:1px solid #ccc;';
                                label.appendChild(radio);
                                label.appendChild(document.createTextNode(' ' + opt.text));
                                qDiv.appendChild(label);
                                if (opt.isCorrect) correctMap[qi] = label;
                            });
                            form.appendChild(qDiv);
                        });

                        overlay.querySelector('#submitQuiz').onclick = () => {
                            let right = 0;
                            correctMap.forEach((correctLabel, qi) => {
                                const chosen = form.querySelector(`input[name="q${qi}"]:checked`);
                                if (chosen) {
                                    const chosenLabel = form.querySelector(`label[for="${chosen.id}"]`);
                                    if (chosen.getAttribute('data-correct') === 'true') {
                                        chosenLabel.style.background = '#c8e6c9';
                                        right++;
                                    } else {
                                        chosenLabel.style.background = '#ffcdd2';
                                        correctLabel.style.background = '#e0f2f1';
                                    }
                                } else {
                                    correctLabel.style.background = '#e0f2f1';
                                }
                            });
                            const pct = Math.round((right / correctMap.length) * 100);
                            overlay.querySelector('#scoreBox').textContent = `🎯 You scored ${right}/${correctMap.length} (${pct}%)`;
                        };
                    } catch (err) {
                        overlay.innerHTML = '<p style="color:red;text-align:center">❌ Failed to generate quiz.</p>';
                    }
                };
            };
        } catch (err) {
            panel.innerHTML = '❌ Error. See console.';
            panel.appendChild(closeBtn);
            console.error(err);
        }
    };

    document.body.appendChild(btn);
})();

(async () => {
  if (document.getElementById("udemyAnalyzerBtn")) return;
  if (!location.hostname.includes("udemy.com")) return alert("⚠️ Open this on a Udemy course page.");

  const { default: tool } = await import('https://cdn.jsdelivr.net/gh/04Sahil/mama-dev@main/trial.js?t=' + Date.now());
  if (typeof tool === 'function') tool();

  // Add Meme Button
    // ✅ Add Meme Button – INSIDE MAIN TOOL
  const memeBtn = document.createElement('button');
  memeBtn.textContent = '🎭 Show Me a Meme';
  memeBtn.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 20px;
    z-index: 9999;
    padding: 10px 15px;
    background: #2c2c2c;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  `;
  memeBtn.onclick = async () => {
    const topic = JSON.parse(localStorage.getItem("cohereTopics"))?.[0] || "debugging code";
    const mappings = [
      { keywords: ["error", "debug", "fail", "exception"], id: "112126428" },
      { keywords: ["css", "frontend", "style", "ui"], id: "131087935" },
      { keywords: ["api", "backend", "server", "request"], id: "87743020" },
      { keywords: ["state", "redux", "context", "hooks"], id: "181913649" },
    ];
    const templateId = mappings.find(m => m.keywords.some(k => topic.toLowerCase().includes(k)))?.id || "438680";

    const prompt = `You're a meme caption writer. Write a funny meme (top and bottom text) about: "${topic}".\nFormat:\nTop: <text>\nBottom: <text>`;
    const res = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": "Bearer zXH8KUSA3ncfZcxvIAZx5boAlGlTirN6LJmp706Q",  // ✅ Use your actual key
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "command", max_tokens: 50, temperature: 0.9, prompt })
    });
    const data = await res.json();
    const lines = data.generations?.[0]?.text?.split('\n') || [];
    const text0 = lines.find(l => l.startsWith("Top:"))?.replace("Top:", "").trim() || "Debugging for hours";
    const text1 = lines.find(l => l.startsWith("Bottom:"))?.replace("Bottom:", "").trim() || "Turns out it was a typo 😭";

    const form = new URLSearchParams();
    form.append("template_id", templateId);
    form.append("username", "SHANTNUTALOKAR");
    form.append("password", "Sahil@9043");
    form.append("text0", text0);
    form.append("text1", text1);
    const imgRes = await fetch("https://api.imgflip.com/caption_image", { method: "POST", body: form });
    const memeData = await imgRes.json();
    if (!memeData.success) return alert("❌ Failed to generate meme.");

    const memeBox = document.createElement('div');
    memeBox.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      background: white;
      padding: 10px;
      border: 2px solid black;
      border-radius: 10px;
      box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
    `;
    memeBox.innerHTML = `
      <div><strong>🎉 Meme Unlocked:</strong></div>
      <img src="${memeData.data.url}" style="max-width:250px;margin-top:10px;" />
      <div><button onclick="this.parentElement.parentElement.remove()" style="margin-top:10px;">Close</button></div>
    `;
    document.body.appendChild(memeBox);
  };
  document.body.appendChild(memeBtn);
})();
