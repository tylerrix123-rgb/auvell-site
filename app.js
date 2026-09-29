window.AUVELL = {
  logo: "logo.svg",
  whatsapp: "",
  products: [
    { id: "mt2", name: "Melanotan 2", sizeLabel: "10 mg", lot: "AUV-MT2", sizes: [{ label: "10 mg", typical: 49 }] },
    { id: "ghkcu", name: "GHK-Cu", sizeLabel: "100 mg", lot: "AUV-GHK", sizes: [{ label: "100 mg", typical: 55 }] },
    { id: "water", name: "Bacteriostatic water", sizeLabel: "10 mL", lot: "AUV-BW", sizes: [{ label: "10 mL", typical: 12 }] },
    { id: "blend", name: "KPV / BPC-157 / TB-500", sizeLabel: "30 mg total · 10 mg of each", lot: "AUV-BLD", sizes: [{ label: "30 mg mixed vial", typical: 65 }] },
    { id: "reta", name: "Retatrutide", sizeLabel: "30 mg", lot: "AUV-R30", sizes: [{ label: "30 mg", typical: 165 }] }
  ]
};
try { window.AUVELL.basket = JSON.parse(localStorage.getItem("auvell-basket") || "{}"); }
catch (e) { window.AUVELL.basket = {}; }
function money(n) { return n ? "£" + n : "Ask"; }
function findProduct(id) { return window.AUVELL.products.filter(function (p) { return p.id === id; })[0] || null; }
function keyFor(id, size) { return id + "::" + size; }
function qtyOf(id, size) { return window.AUVELL.basket[keyFor(id, size)] || 0; }
function persist() { try { localStorage.setItem("auvell-basket", JSON.stringify(window.AUVELL.basket)); } catch (e) {} }
function setQty(id, size, qty) {
  qty = Math.max(0, Math.min(99, parseInt(qty, 10) || 0));
  var k = keyFor(id, size);
  if (!qty) delete window.AUVELL.basket[k]; else window.AUVELL.basket[k] = qty;
  persist(); renderBasket();
}
function items() {
  return Object.keys(window.AUVELL.basket).map(function (k) {
    var parts = k.split("::");
    var p = findProduct(parts[0]);
    var label = parts.slice(1).join("::");
    var s = p && p.sizes.filter(function (x) { return x.label === label; })[0];
    return { id: parts[0], name: p ? p.name : parts[0], size: label, typical: s ? s.typical : 0, qty: window.AUVELL.basket[k] };
  }).filter(function (i) { return i.qty; });
}
function count() { return items().reduce(function (t, i) { return t + i.qty; }, 0); }
function refTotal() { return items().reduce(function (t, i) { return t + i.typical * i.qty; }, 0); }
function addOne(id, size) { setQty(id, size, qtyOf(id, size) + 1); openCart(); }
function buildMessage() {
  var list = items();
  var q = ((document.getElementById("ask") || {}).value || "").trim();
  var ref = "";
  try { ref = sessionStorage.getItem("auvell-ref") || ""; } catch (e) {}
  var lines = ["Hello Auvell,", "", "This is a research enquiry only. These materials are for laboratory research purposes. This is not an order for human or veterinary use.", "", "I am interested in the following. Typical listed ranges are context only — not a quote."];
  if (list.length) {
    list.forEach(function (i) { lines.push("- " + i.qty + " × " + i.name + " (" + i.size + "), typical listed about " + money(i.typical)); });
    if (refTotal()) lines.push("Combined typical listed figure: " + money(refTotal()) + " (reference only).");
  } else lines.push("- I have not added a pack yet.");
  if (ref) lines.push("Referral code: " + ref);
  lines.push("", "I have questions about availability and paperwork for research use. How can you help with that?");
  if (q) lines.push("", q);
  return lines.join("\n");
}
function sendNote() {
  var n = (window.AUVELL.whatsapp || "").replace(/\D/g, "");
  var text = buildMessage();
  if (!n) { prompt("WhatsApp is not connected yet. Copy this research enquiry:", text); return; }
  window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(text), "_blank", "noopener");
}
function observeReveal() {
  var cards = document.querySelectorAll(".reveal");
  if (!cards.length) return;
  if (!("IntersectionObserver" in window)) { cards.forEach(function (c) { c.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  cards.forEach(function (c) { io.observe(c); });
}
function openDetail(id) {
  var p = findProduct(id);
  if (!p) return;
  var box = document.getElementById("detail");
  if (!box) { box = document.createElement("aside"); box.id = "detail"; box.className = "detail"; document.body.appendChild(box); }
  var first = p.sizes[0];
  var q = qtyOf(p.id, first.label) || 1;
  box.innerHTML = "<p class='kicker'>Research material</p><h2>" + p.name + "</h2><p>" + p.sizeLabel + ". Lot mark " + p.lot + ".</p><p class='ref'>Typical listed " + money(first.typical) + " — not an Auvell price.</p><div class='qty'><button type='button' onclick=\"setQty('" + p.id + "','" + first.label + "'," + (q-1) + ")\">−</button><b>" + q + "</b><button type='button' onclick=\"addOne('" + p.id + "','" + first.label + "')\">+</button></div><p><a class='text-link' href='quality.html?lot=" + encodeURIComponent(p.lot) + "'>Check the lot file</a></p><p>Questions here are for research-material context only. Not advice for human use.</p><p><button class='btn solid' type='button' onclick=\"addOne('" + p.id + "','" + first.label + "')\">Add to note</button> <button class='btn' type='button' onclick='closeDetail()'>Close</button></p>";
  document.body.classList.add("detail-open");
}
function closeDetail() { document.body.classList.remove("detail-open"); }
function renderBasket() {
  var box = document.getElementById("cart-lines");
  var empty = document.getElementById("cart-empty");
  var badge = document.getElementById("basket-count");
  var ref = document.getElementById("cart-ref");
  var list = items();
  if (badge) badge.textContent = String(count());
  if (ref) ref.textContent = refTotal() ? "Typical listed total " + money(refTotal()) + " — reference only, not a bill." : "";
  if (!box) return;
  if (!list.length) { box.innerHTML = ""; if (empty) empty.style.display = "block"; return; }
  if (empty) empty.style.display = "none";
  box.innerHTML = list.map(function (i) {
    return "<div class='line'><div><strong>" + i.name + "</strong><span class='sub'>" + i.size + "</span><span class='sub'>typical " + money(i.typical) + "</span></div><div class='step'><button type='button' onclick=\"setQty('" + i.id + "','" + i.size + "'," + (i.qty-1) + ")\">−</button><b>" + i.qty + "</b><button type='button' onclick=\"setQty('" + i.id + "','" + i.size + "'," + (i.qty+1) + ")\">+</button></div></div>";
  }).join("");
}
function openCart() { document.body.classList.add("cart-open"); }
function closeCart() { document.body.classList.remove("cart-open"); }
function cartHtml() {
  if (document.getElementById("enquiry-cart")) return;
  var wrap = document.createElement("div");
  wrap.innerHTML = '<div id="scrim" class="scrim"></div><aside id="enquiry-cart" class="drawer"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Your note</h2><button type="button" id="close-cart">Close</button></div><p class="hint">Research enquiry only. Typical figures are not a charge.</p><p id="cart-empty">Nothing in the note yet.</p><div id="cart-lines"></div><p id="cart-ref" class="ref"></p><p><a class="btn" href="note.html">Open full note</a></p></aside>';
  document.body.appendChild(wrap);
}
function bindChrome() {
  document.querySelectorAll("[data-logo]").forEach(function (img) { img.src = window.AUVELL.logo; });
  var menu = document.querySelector(".menu");
  if (menu) menu.addEventListener("click", function () { document.body.classList.toggle("menu-open"); });
  var bag = document.getElementById("open-cart");
  if (bag) bag.addEventListener("click", openCart);
  var close = document.getElementById("close-cart");
  if (close) close.addEventListener("click", closeCart);
  var scrim = document.getElementById("scrim");
  if (scrim) scrim.addEventListener("click", function () {
    document.body.classList.remove("cart-open"); document.body.classList.remove("menu-open"); closeDetail();
  });
  var send = document.getElementById("send-note");
  if (send) send.addEventListener("click", sendNote);
  window.addEventListener("scroll", function () {
    document.body.classList.toggle("scrolled", window.scrollY > 24);
  }, { passive: true });
  var gate = document.getElementById("gate");
  if (gate) {
    try {
      if (sessionStorage.getItem("auvell-in") === "1") {
        gate.className = "gate hide";
        gate.style.display = "none";
        document.body.classList.add("entered");
      }
    } catch (e) {}
  } else {
    document.body.classList.add("entered");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  cartHtml(); bindChrome(); renderBasket(); observeReveal();
});
