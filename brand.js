window.AUVELL = {
  whatsapp: "",
  logo: "logo.svg",
  products: [
    { id: "p1", name: "Peptide 01", sizeLabel: "5 mg / 10 mg", photo: "", sizes: ["5 mg", "10 mg"] },
    { id: "p2", name: "Peptide 02", sizeLabel: "2 mg / 5 mg", photo: "", sizes: ["2 mg", "5 mg"] },
    { id: "p3", name: "Peptide 03", sizeLabel: "5 mg / 10 mg", photo: "", sizes: ["5 mg", "10 mg"] },
    { id: "p4", name: "Peptide 04", sizeLabel: "10 mg", photo: "", sizes: ["10 mg"] },
    { id: "p5", name: "Peptide 05", sizeLabel: "5 mg / 10 mg", photo: "", sizes: ["5 mg", "10 mg"] },
    { id: "p6", name: "Something else", sizeLabel: "Tell us the name", photo: "", sizes: ["Other"] }
  ]
};
window.AUVELL.basket = {};
function vialSrc(p) { return (p && p.photo) || window.AUVELL_VIAL || "vial.jpg"; }
function keyFor(id, size) { return id + "::" + size; }
function parseKey(k) { var p = k.split("::"); return { id: p[0], size: p.slice(1).join("::") }; }
function findProduct(id) {
  for (var i = 0; i < window.AUVELL.products.length; i++) if (window.AUVELL.products[i].id === id) return window.AUVELL.products[i];
  return null;
}
function auvellWhatsApp(text) {
  var n = (window.AUVELL.whatsapp || "").replace(/\D/g, "");
  if (!n) { alert("Add the WhatsApp number and this will open the chat."); return; }
  window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(text), "_blank", "noopener");
}
function qtyOf(id, size) { return window.AUVELL.basket[keyFor(id, size)] || 0; }
function setQty(id, size, qty) {
  qty = Math.max(0, Math.min(99, parseInt(qty, 10) || 0));
  var k = keyFor(id, size);
  if (qty === 0) delete window.AUVELL.basket[k]; else window.AUVELL.basket[k] = qty;
  renderBasket();
}
function changeQty(id, size, delta) { setQty(id, size, qtyOf(id, size) + delta); }
function addOne(id, size) { changeQty(id, size, 1); openCart(); }
function selectedItems() {
  var items = [];
  Object.keys(window.AUVELL.basket).forEach(function (k) {
    var q = window.AUVELL.basket[k]; if (!q) return;
    var parsed = parseKey(k); var p = findProduct(parsed.id);
    items.push({ id: parsed.id, size: parsed.size, qty: q, name: p ? p.name : parsed.id });
  });
  return items;
}
function basketCount() {
  var t = 0; selectedItems().forEach(function (i) { t += i.qty; }); return t;
}
function buildMessage() {
  var items = selectedItems();
  var question = ((document.getElementById("ask-anything") || {}).value || "").trim();
  var parts = ["Hello Auvell,"];
  if (items.length) {
    parts.push(""); parts.push("I would love to ask about:");
    items.forEach(function (i) { parts.push("- " + i.qty + " x " + i.name + " (" + i.size + ")"); });
  }
  if (question) { parts.push(""); parts.push(question); }
  if (!items.length && !question) { parts.push(""); parts.push("I have a question."); }
  return parts.join("\n");
}
function sendEnquiry() { auvellWhatsApp(buildMessage()); }
function openCart() {
  var d = document.getElementById("enquiry-cart");
  var s = document.getElementById("scrim");
  if (d) d.classList.add("open");
  if (s) s.classList.add("on");
}
function closeCart() {
  var d = document.getElementById("enquiry-cart");
  var s = document.getElementById("scrim");
  if (d) d.classList.remove("open");
  if (s) s.classList.remove("on");
}
function renderBasket() {
  var box = document.getElementById("cart-lines");
  var empty = document.getElementById("cart-empty");
  var countEl = document.getElementById("basket-count");
  var items = selectedItems();
  if (countEl) countEl.textContent = String(basketCount());
  if (!box) return;
  if (!items.length) { box.innerHTML = ""; if (empty) empty.style.display = "block"; return; }
  if (empty) empty.style.display = "none";
  box.innerHTML = items.map(function (i) {
    return '<div class="cart-line"><div><strong>' + i.name + '</strong><div>' + i.size + '</div></div>' +
      '<div class="stepper"><button type="button" onclick="changeQty(\'' + i.id + '\',\'' + i.size + '\',-1)">−</button><strong>' + i.qty + '</strong><button type="button" onclick="changeQty(\'' + i.id + '\',\'' + i.size + '\',1)">+</button></div>' +
      '<button class="linkish" type="button" onclick="setQty(\'' + i.id + '\',\'' + i.size + '\',0)">Remove</button></div>';
  }).join("");
}
function renderHeroVials() {
  document.querySelectorAll("[data-hero-vial]").forEach(function (img) { img.src = vialSrc(); });
}
function renderProducts() {
  var grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = window.AUVELL.products.map(function (p) {
    var sizes = p.sizes.map(function (s) {
      return '<button type="button" onclick="addOne(\'' + p.id + '\',\'' + s + '\')">' + s + '</button>';
    }).join("");
    return '<article class="pcard"><div class="shot"><img src="' + vialSrc(p) + '" alt="' + p.name + '" /></div>' +
      '<div class="meta"><div><strong>' + p.name + '</strong><em>' + p.sizeLabel + '</em></div>' +
      '<button class="add-circle" type="button" onclick="addOne(\'' + p.id + '\',\'' + p.sizes[0] + '\')" aria-label="Add">+</button></div>' +
      '<div class="sizes">' + sizes + '</div></article>';
  }).join("");
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-logo]").forEach(function (img) { img.src = window.AUVELL.logo; });
  renderHeroVials();
  renderProducts(); renderBasket();
  var send = document.getElementById("send-enquiry");
  if (send) send.addEventListener("click", sendEnquiry);
  ["open-cart", "open-cart-2"].forEach(function (id) {
    var el = document.getElementById(id); if (el) el.addEventListener("click", openCart);
  });
  var close = document.getElementById("close-cart"); if (close) close.addEventListener("click", closeCart);
  var scrim = document.getElementById("scrim"); if (scrim) scrim.addEventListener("click", closeCart);
  var menu = document.querySelector(".menu-btn");
  var links = document.querySelector(".links");
  if (menu && links) menu.addEventListener("click", function () { links.classList.toggle("open"); });
  var gate = document.getElementById("age-gate");
  var enter = document.getElementById("enter-site");
  if (gate && sessionStorage.getItem("auvell-in") === "1") gate.classList.add("hide");
  if (enter) enter.addEventListener("click", function () {
    var a = document.getElementById("age-ok");
    var r = document.getElementById("ruo-ok");
    if (!a || !r || !a.checked || !r.checked) { alert("Please tick both boxes to come in."); return; }
    sessionStorage.setItem("auvell-in", "1");
    gate.classList.add("hide");
  });
});
