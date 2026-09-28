window.AUVELL = {
  whatsapp: "",
  logo: "logo.svg",
  products: [
    { id: "p1", name: "Peptide 01", note: "Vial photo coming soon", photo: "", sizes: ["5 mg", "10 mg"] },
    { id: "p2", name: "Peptide 02", note: "Vial photo coming soon", photo: "", sizes: ["2 mg", "5 mg"] },
    { id: "p3", name: "Peptide 03", note: "Vial photo coming soon", photo: "", sizes: ["5 mg", "10 mg"] },
    { id: "p4", name: "Peptide 04", note: "Vial photo coming soon", photo: "", sizes: ["10 mg"] },
    { id: "p5", name: "Peptide 05", note: "Vial photo coming soon", photo: "", sizes: ["5 mg", "10 mg"] },
    { id: "p6", name: "Something else", note: "If you cannot see it here, add this and tell us the name", photo: "", sizes: ["Other"] }
  ]
};
window.AUVELL.basket = {};
function vialFrame(p) {
  if (p.photo) return '<div class="vial"><img src="' + p.photo + '" alt="' + p.name + ' vial" /></div>';
  return '<div class="vial placeholder">' +
    '<svg viewBox="0 0 80 140" aria-hidden="true"><rect x="30" y="8" width="20" height="10" rx="2" fill="#c4a35a"/><rect x="22" y="18" width="36" height="12" rx="2" fill="#1b2a4a"/><rect x="18" y="30" width="44" height="96" rx="10" fill="none" stroke="#1b2a4a" stroke-width="2"/><rect x="22" y="78" width="36" height="42" rx="6" fill="#c4a35a" opacity="0.35"/></svg>' +
    '<span>Vial photo</span></div>';
}
function keyFor(id, size) { return id + "::" + size; }
function parseKey(k) { var p = k.split("::"); return { id: p[0], size: p.slice(1).join("::") }; }
function findProduct(id) {
  for (var i = 0; i < window.AUVELL.products.length; i++) if (window.AUVELL.products[i].id === id) return window.AUVELL.products[i];
  return null;
}
function auvellWhatsApp(text) {
  var n = (window.AUVELL.whatsapp || "").replace(/\D/g, "");
  if (!n) { alert("Once the WhatsApp number is added, this will open the chat. Send the number with country code when you are ready."); return; }
  window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(text), "_blank", "noopener");
}
function qtyOf(id, size) { return window.AUVELL.basket[keyFor(id, size)] || 0; }
function setQty(id, size, qty) {
  qty = Math.max(0, Math.min(99, parseInt(qty, 10) || 0));
  var k = keyFor(id, size);
  if (qty === 0) delete window.AUVELL.basket[k]; else window.AUVELL.basket[k] = qty;
  renderBasket();
  updateAddLabels();
}
function changeQty(id, size, delta) { setQty(id, size, qtyOf(id, size) + delta); }
function addOne(id, size) { changeQty(id, size, 1); }
function selectedItems() {
  var items = [];
  Object.keys(window.AUVELL.basket).forEach(function (k) {
    var q = window.AUVELL.basket[k];
    if (!q) return;
    var parsed = parseKey(k);
    var p = findProduct(parsed.id);
    items.push({ id: parsed.id, size: parsed.size, qty: q, name: p ? p.name : parsed.id });
  });
  return items;
}
function basketCount() {
  var t = 0;
  selectedItems().forEach(function (i) { t += i.qty; });
  return t;
}
function buildMessage() {
  var items = selectedItems();
  var question = ((document.getElementById("ask-anything") || {}).value || "").trim();
  var parts = ["Hello Auvell,"];
  if (items.length) {
    parts.push("");
    parts.push("I would love to ask about:");
    items.forEach(function (i) { parts.push("- " + i.qty + " x " + i.name + " (" + i.size + ")"); });
  }
  if (question) { parts.push(""); parts.push(question); }
  if (!items.length && !question) { parts.push(""); parts.push("I have a question."); }
  return parts.join("\n");
}
function sendEnquiry() { auvellWhatsApp(buildMessage()); }
function updateAddLabels() {
  document.querySelectorAll("[data-add]").forEach(function (btn) {
    var id = btn.getAttribute("data-id");
    var size = btn.getAttribute("data-size");
    var q = qtyOf(id, size);
    btn.textContent = q ? ("Add another " + size + " · " + q + " in your note") : ("Add " + size);
  });
  var countEl = document.getElementById("basket-count");
  if (countEl) countEl.textContent = String(basketCount());
}
function renderBasket() {
  var box = document.getElementById("cart-lines");
  var empty = document.getElementById("cart-empty");
  var items = selectedItems();
  updateAddLabels();
  if (!box) return;
  if (!items.length) {
    box.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";
  box.innerHTML = items.map(function (i) {
    return '<div class="cart-line">' +
      '<div><strong>' + i.name + '</strong><span>' + i.size + '</span></div>' +
      '<div class="stepper">' +
        '<button type="button" onclick="changeQty(\'' + i.id + '\',\'' + i.size + '\',-1)">−</button>' +
        '<strong>' + i.qty + '</strong>' +
        '<button type="button" onclick="changeQty(\'' + i.id + '\',\'' + i.size + '\',1)">+</button>' +
      '</div>' +
      '<button class="linkish" type="button" onclick="setQty(\'' + i.id + '\',\'' + i.size + '\',0)">Take this off</button>' +
    '</div>';
  }).join("");
}
function renderProducts() {
  var grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = window.AUVELL.products.map(function (p) {
    var btns = p.sizes.map(function (s) {
      return '<button class="btn ghost add-btn" type="button" data-add data-id="' + p.id + '" data-size="' + s + '" onclick="addOne(\'' + p.id + '\',\'' + s + '\')">Add ' + s + '</button>';
    }).join("");
    return '<article class="card product">' + vialFrame(p) + '<div class="product-copy"><h3>' + p.name + '</h3><p>' + p.note + '</p><div class="add-row">' + btns + '</div></div></article>';
  }).join("");
  updateAddLabels();
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-logo]").forEach(function (img) { img.src = window.AUVELL.logo; });
  renderProducts();
  renderBasket();
  document.querySelectorAll("[data-wa]").forEach(function (btn) {
    btn.addEventListener("click", function () { auvellWhatsApp(btn.getAttribute("data-wa") || "Hello Auvell, I have a question."); });
  });
  var send = document.getElementById("send-enquiry");
  if (send) send.addEventListener("click", sendEnquiry);
  var menu = document.querySelector(".menu-btn");
  var links = document.querySelector(".links");
  if (menu && links) menu.addEventListener("click", function () { links.classList.toggle("open"); });
});
