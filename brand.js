window.AUVELL = {
  whatsapp: "",
  logo: "logo.svg",
  products: [
    { id: "p1", name: "Peptide 01", note: "Confirm the name in chat", sizes: ["5 mg", "10 mg"] },
    { id: "p2", name: "Peptide 02", note: "Confirm the name in chat", sizes: ["2 mg", "5 mg"] },
    { id: "p3", name: "Peptide 03", note: "Confirm the name in chat", sizes: ["5 mg", "10 mg"] },
    { id: "p4", name: "Peptide 04", note: "Confirm the name in chat", sizes: ["10 mg"] },
    { id: "p5", name: "Peptide 05", note: "Confirm the name in chat", sizes: ["5 mg", "10 mg"] },
    { id: "p6", name: "Something else", note: "Ask if it is not listed", sizes: ["Other"] }
  ]
};
window.AUVELL.basket = {};
function keyFor(id, size) { return id + "::" + size; }
function auvellWhatsApp(text) {
  var n = (window.AUVELL.whatsapp || "").replace(/\D/g, "");
  if (!n) { alert("Send your WhatsApp number with country code (example 447700900123) and this will open the chat."); return; }
  window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(text), "_blank", "noopener");
}
function qtyOf(id, size) { return window.AUVELL.basket[keyFor(id, size)] || 0; }
function setQty(id, size, qty) {
  qty = Math.max(0, Math.min(99, parseInt(qty, 10) || 0));
  var k = keyFor(id, size);
  if (qty === 0) delete window.AUVELL.basket[k]; else window.AUVELL.basket[k] = qty;
  renderBasket();
  var el = document.querySelector('[data-qty="' + k + '"]');
  if (el) el.textContent = String(qty);
}
function changeQty(id, size, delta) { setQty(id, size, qtyOf(id, size) + delta); }
function selectedLines() {
  var lines = [];
  window.AUVELL.products.forEach(function (p) {
    p.sizes.forEach(function (s) {
      var q = qtyOf(p.id, s);
      if (q > 0) lines.push(q + " x " + p.name + " (" + s + ")");
    });
  });
  return lines;
}
function buildMessage() {
  var lines = selectedLines();
  var question = ((document.getElementById("ask-anything") || {}).value || "").trim();
  var parts = ["Hello Auvell,"];
  if (lines.length) { parts.push(""); parts.push("I would like to enquire about:"); lines.forEach(function (l) { parts.push("- " + l); }); }
  if (question) { parts.push(""); parts.push("Question:"); parts.push(question); }
  if (!lines.length && !question) { parts.push(""); parts.push("I have a question."); }
  return parts.join("\n");
}
function sendEnquiry() { auvellWhatsApp(buildMessage()); }
function renderBasket() {
  var box = document.getElementById("basket-summary");
  var countEl = document.getElementById("basket-count");
  var lines = selectedLines();
  var total = 0;
  Object.keys(window.AUVELL.basket).forEach(function (k) { total += window.AUVELL.basket[k]; });
  if (countEl) countEl.textContent = String(total);
  if (!box) return;
  if (!lines.length) box.textContent = "Nothing selected yet. Add packs below, then write any question.";
  else box.innerHTML = lines.map(function (l) { return "<div>" + l + "</div>"; }).join("");
}
function renderProducts() {
  var grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = window.AUVELL.products.map(function (p) {
    var rows = p.sizes.map(function (s) {
      var k = keyFor(p.id, s);
      return '<div class="qty-row"><span>' + s + '</span><div class="stepper"><button type="button" onclick="changeQty(\'' + p.id + '\',\'' + s + '\',-1)">−</button><strong data-qty="' + k + '">0</strong><button type="button" onclick="changeQty(\'' + p.id + '\',\'' + s + '\',1)">+</button></div></div>';
    }).join("");
    return '<article class="card product"><h3>' + p.name + '</h3><div class="rule"></div><p>' + p.note + '</p>' + rows + '</article>';
  }).join("");
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-logo]").forEach(function (img) { img.src = window.AUVELL.logo; });
  renderProducts(); renderBasket();
  document.querySelectorAll("[data-wa]").forEach(function (btn) {
    btn.addEventListener("click", function () { auvellWhatsApp(btn.getAttribute("data-wa") || "Hello Auvell, I have a question."); });
  });
  var send = document.getElementById("send-enquiry");
  if (send) send.addEventListener("click", sendEnquiry);
  var menu = document.querySelector(".menu-btn");
  var links = document.querySelector(".links");
  if (menu && links) menu.addEventListener("click", function () { links.classList.toggle("open"); });
});
