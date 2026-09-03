const OFFICE = "office@readywellpsych.com";
const SCALE = {
  0: "Not at all",
  1: "Several days",
  2: "More than half the days",
  3: "Nearly every day"
};
const ITEMS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself \u2014 or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite \u2014 being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];
const DIFF = {
  0: "Not difficult at all",
  1: "Somewhat difficult",
  2: "Very difficult",
  3: "Extremely difficult"
};

const partA = document.getElementById("partA");
ITEMS.forEach((text, i) => {
  const n = i + 1;
  const code = String(n).padStart(2, "0");
  const extra = n === 9 ? " item9" : "";
  partA.insertAdjacentHTML("beforeend", `
    <div class="item${extra}">
      <p><span class="code">${code}.</span> ${text}</p>
      <div class="scale four">
        ${[0,1,2,3].map(v => `<label><input type="radio" name="I${n}" value="${v}" required> ${v}<small>${SCALE[v]}</small></label>`).join("")}
      </div>
    </div>`);
});

const diffScale = document.getElementById("diffScale");
diffScale.innerHTML = [0,1,2,3].map(v =>
  `<label><input type="radio" name="DIFF" value="${v}" required> ${v}<small>${DIFF[v]}</small></label>`
).join("");

document.getElementById("date").valueAsDate = new Date();

function val(name) {
  const el = document.querySelector(`[name="${name}"]:checked`);
  return el ? el.value : null;
}
function num(name) {
  const v = val(name);
  return v === null ? null : Number(v);
}
function bandFor(total) {
  if (total >= 20) return "20\u201327. Severe.";
  if (total >= 15) return "15\u201319. Moderately severe.";
  if (total >= 10) return "10\u201314. Moderate.";
  if (total >= 5) return "5\u20139. Mild.";
  return "0\u20134. None\u2013minimal.";
}
function bandClass(total) {
  if (total >= 15) return "pos";
  if (total >= 10) return "flag";
  if (total >= 5) return "flag";
  return "neg";
}

function score() {
  const initialsCheck = document.getElementById("name").value.trim();
  if (!initialsCheck) {
    alert("Please enter initials.");
    document.getElementById("name").focus();
    return;
  }
  const ratings = ITEMS.map((_, i) => num("I" + (i + 1)));
  if (ratings.some(v => v === null)) {
    alert("Please answer every item (0\u20133).");
    return;
  }
  const difficulty = num("DIFF");
  if (difficulty === null) {
    alert("Please answer the difficulty item.");
    return;
  }
  const total = ratings.reduce((s, n) => s + n, 0);
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value || "";
  const visit = document.getElementById("visit").value || "not given";
  const age = document.getElementById("age").value || "n/a";
  const band = bandFor(total);
  const item9 = ratings[8];
  const item9Flag = item9 > 0;

  let html = `
    <div class="score-row"><span>Initials</span><strong>${name}</strong></div>
    <div class="score-row"><span>Completed</span><strong>${date || "not dated"}</strong></div>
    <div class="score-row"><span>Age</span><strong>${age}</strong></div>
    <div class="score-row"><span>Next visit</span><strong>${visit}</strong></div>
    <div class="score-row"><span>Total (0\u201327)</span><strong>${total} / 27</strong></div>
    <div class="score-row"><span>Band</span><strong><span class="pill ${bandClass(total)}">${band}</span></strong></div>
    <div class="score-row"><span>Difficulty</span><strong>${DIFF[difficulty]}</strong></div>
    <div class="score-row"><span>Item 9</span><strong>${item9} \u00b7 ${SCALE[item9]}</strong></div>
  `;
  if (item9Flag) {
    html += `<div class="crisis-flag">Item 9 was marked above not at all. Review for safety today. If you are in crisis, call or text 988. If you are in immediate danger, call 911 or go to the nearest emergency room.</div>`;
  }
  document.getElementById("resultBody").innerHTML = html;

  const itemHtml = ITEMS.map((stem, i) => {
    const n = ratings[i];
    const code = String(i + 1).padStart(2, "0");
    return `<div class="item"><p><span class="code">${code}.</span> ${stem}</p><p class="ans">Answer: ${n} \u00b7 ${SCALE[n]}</p></div>`;
  }).join("") + `<div class="item"><p><span class="code">10.</span> Difficulty</p><p class="ans">Answer: ${DIFF[difficulty]}</p></div>`;
  document.getElementById("itemList").innerHTML = "<p class=\"hint\">Every item and the rating selected</p>" + itemHtml;

  const lines = [
    "PHQ-9",
    "Initials: " + name,
    "Completed: " + (date || "n/a"),
    "Age: " + age,
    "Next visit: " + visit,
    "Score: " + total + " / 27",
    "Band: " + band,
    "Difficulty: " + DIFF[difficulty],
    "Item 9: " + item9 + "  " + SCALE[item9] + (item9Flag ? "  FLAG" : ""),
    "",
    "Item, rating, label"
  ];
  ITEMS.forEach((stem, i) => {
    const n = ratings[i];
    lines.push("");
    lines.push((i + 1) + ". " + stem);
    lines.push("Answer: " + n + "  " + SCALE[n]);
  });
  lines.push("");
  lines.push("10. If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?");
  lines.push("Answer: " + DIFF[difficulty]);
  if (item9Flag) {
    lines.push("");
    lines.push("SAFETY: Item 9 above 0. Review today. Crisis: 988. Immediate danger: 911 or nearest ER.");
  }
  window._ocsSummary = lines.join("\n");
  window._meta = { name, date, visit, age, total, band, difficulty, item9, item9Flag };
  const box = document.getElementById("summaryBox");
  if (box) box.value = window._ocsSummary;
  document.getElementById("results").classList.add("show");
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
  return true;
}

function copySummary() {
  const box = document.getElementById("summaryBox");
  const status = document.getElementById("copyStatus");
  if (!window._ocsSummary) {
    if (!score()) return false;
  }
  box.value = window._ocsSummary;
  box.focus();
  box.select();
  box.setSelectionRange(0, box.value.length);
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
  if (!ok && navigator.clipboard) {
    navigator.clipboard.writeText(window._ocsSummary).then(() => {
      status.textContent = "Summary copied.";
    }).catch(() => {
      status.textContent = "Select the box and copy (Ctrl+C or Cmd+C).";
    });
    return true;
  }
  status.textContent = ok ? "Summary copied." : "Select the box and copy (Ctrl+C or Cmd+C).";
  return ok;
}

function openGmail() {
  if (!score()) return;
  copySummary();
  const subject = "FOR REVIEW : PHQ-9 screener";
  let body = window._ocsSummary;
  if (body.length > 1500) {
    body = body.slice(0, 1500) + "\n\n[Gmail cut the rest. Paste the copied summary.]";
  }
  const gmail = "https://mail.google.com/mail/?view=cm&fs=1&tf=1"
    + "&to=" + encodeURIComponent(OFFICE)
    + "&su=" + encodeURIComponent(subject)
    + "&body=" + encodeURIComponent(body);
  const a = document.createElement("a");
  a.href = gmail;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  const status = document.getElementById("copyStatus");
  status.textContent = "Gmail draft should open in a new tab. If it did not, paste the box into Gmail.";
}

document.getElementById("scoreBtn").onclick = score;
document.getElementById("gmailBtn").onclick = openGmail;
document.getElementById("copyBtn").onclick = copySummary;
document.getElementById("printBtn").onclick = () => {
  if (!window._ocsSummary) score();
  window.print();
};
