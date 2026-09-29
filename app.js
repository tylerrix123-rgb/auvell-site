window.AUVELL = {
  logo: "logo.svg",
  whatsapp: "",
  products: [
    { id: "p1", name: "Compound 01", sizeLabel: "5 mg or 10 mg", lot: "AUV-P01",
      sizes: [{ label: "5 mg", typical: 45 }, { label: "10 mg", typical: 75 }] },
    { id: "p2", name: "Compound 02", sizeLabel: "2 mg or 5 mg", lot: "AUV-P02",
      sizes: [{ label: "2 mg", typical: 30 }, { label: "5 mg", typical: 48 }] },
    { id: "p3", name: "Compound 03", sizeLabel: "5 mg or 10 mg", lot: "AUV-P03",
      sizes: [{ label: "5 mg", typical: 42 }, { label: "10 mg", typical: 70 }] },
    { id: "p4", name: "Compound 04", sizeLabel: "10 mg", lot: "AUV-P04",
      sizes: [{ label: "10 mg", typical: 80 }] },
    { id: "p5", name: "Compound 05", sizeLabel: "5 mg or 10 mg", lot: "AUV-P05",
      sizes: [{ label: "5 mg", typical: 50 }, { label: "10 mg", typical: 85 }] },
    { id: "p6", name: "Further compounds", sizeLabel: "On request", lot: "ASK",
      sizes: [{ label: "On request", typical: 0 }] }
  ]
};
window.AUVELL.basket = JSON.parse(localStorage.getItem("auvell-basket") || "{}");
function vialSrc() { return window.AUVELL_VIAL || "vial.jpg"; }
function money(n) { return n ? "£" + n : "Ask"; }
function findProduct(id) { return window.AUVELL.products.filter(function (p) { return p.id === id; })[0] || null; }
function sizeObj(p, label) { return (p.sizes || []).filter(function (s) { return s.label === label; })[0] || { label: label, typical: 0 }; }
function keyFor(id, size) { return id + "::" + size; }
function qtyOf(id, size) { return window.AUVELL.basket[keyFor(id, size)] || 0; }
function persist() { localStorage.setItem("auvell-basket", JSON.stringify(window.AUVELL.basket)); }
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
    var s = p ? sizeObj(p, parts.slice(1).join("::")) : { label: parts[1], typical: 0 };
    return { id: parts[0], name: p ? p.name : parts[0], size: s.label, typical: s.typical, qty: window.AUVELL.basket[k] };
  }).filter(function (i) { return i.qty; });
}
function count() { return items().reduce(function (t, i) { return t + i.qty; }, 0); }
function refTotal() { return items().reduce(function (t, i) { return t + i.typical * i.qty; }, 0); }
function addOne(id, size) { setQty(id, size, qtyOf(id, size) + 1); openCart(); }
function buildMessage() {
  var list = items();
  var q = ((document.getElementById("ask") || {}).value || "").trim();
  var lines = ["Hello Auvell,", "", "I am interested in the following. Typical listed ranges are for context only — not a quote from you."];
  if (list.length) {
    list.forEach(function (i) { lines.push("- " + i.qty + " × " + i.name + " (" + i.size + "), typical listed range about " + money(i.typical)); });
    if (refTotal()) lines.push("Combined typical listed figure: " + money(refTotal()) + " (reference only).");
  } else lines.push("- I have not added a pack yet.");
  lines.push("", "I am wondering how you are able to help, and how we can go about this.");
  if (q) lines.push("", q);
  return lines.join("\n");
}
function sendNote() {
  var n = (window.AUVELL.whatsapp || "").replace(/\D/g, "");
  var text = buildMessage();
  if (!n) { prompt("WhatsApp is not connected yet. Copy this note:", text); return; }
  window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(text), "_blank", "noopener");
}
function renderGrid(limit) {
  var grid = document.getElementById("grid");
  if (!grid) return;
  var list = window.AUVELL.products.slice();
  if (limit) list = list.slice(0, limit);
  grid.innerHTML = list.map(function (p) {
    var first = p.sizes[0];
    var price = first.typical ? "Typical listed " + money(first.typical) + (p.sizes[1] ? "–" + money(p.sizes[1].typical) : "") : "Typical listed range on request";
    return '<article class="card"><a class="shot" href="product.html?id=' + p.id + '"><img src="' + vialSrc() + '" alt=""></a><div class="meta"><strong>' + p.name + "</strong><em>" + p.sizeLabel + '</em><p class="ref">' + price + '</p><p class="hint">Not an Auvell price.</p><div class="card-actions"><a class="text-link" href="product.html?id=' + p.id + '">Details</a><button type="button" class="btn slim" onclick="addOne(\'' + p.id + "','" + first.label + "')">Add to note</button></div></div></article>";
  }).join("");
}
function renderProduct() {
  var root = document.getElementById("product");
  if (!root) return;
  var p = findProduct(new URLSearchParams(location.search).get("id"));
  if (!p) { root.innerHTML = "<p>That compound is not on the list.</p>"; return; }
  var chips = p.sizes.map(function (s, i) {
    return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-size="' + s.label + '">' + s.label + (s.typical ? " · typical " + money(s.typical) : "") + "</button>";
  }).join("");
  root.innerHTML = '<div class="shot large"><img src="' + vialSrc() + '" alt=""></div><div><p class="kicker">Research material</p><h1>' + p.name + "</h1><p>Pack sizes on the card: " + p.sizeLabel + ". Lot mark: " + p.lot + '.</p><p class="ref">Figures next to a size are typical listed ranges. They are not a charge from Auvell.</p><div class="sizes">' + chips + '</div><h3>Useful questions</h3><ul class="ask-list"><li>Which pack size do you need for the work?</li><li>Can the lot file be sent before anything is agreed?</li><li>How should the note be written so it is easy to answer?</li></ul><p>This page does not say how a compound is used. It only helps you name the pack and the paperwork.</p><button class="btn solid" type="button" id="add-this">Add this size to the note</button></div>';
  root.querySelectorAll("[data-size]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      root.querySelectorAll("[data-size]").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
    });
  });
  document.getElementById("add-this").addEventListener("click", function () {
    var on = root.querySelector("[data-size].on");
    addOne(p.id, on ? on.getAttribute("data-size") : p.sizes[0].label);
  });
}
function renderQuality() {
  var box = document.getElementById("lots");
  if (!box) return;
  var q = ((document.getElementById("q") || {}).value || new URLSearchParams(location.search).get("lot") || "").toLowerCase();
  var rows = window.AUVELL.products.filter(function (p) { return !q || (p.name + " " + p.lot).toLowerCase().indexOf(q) !== -1; });
  box.innerHTML = rows.map(function (p) { return '<article class="note"><div><strong>' + p.name + "</strong><em>" + p.lot + "</em><p>No file uploaded for this lot yet.</p></div></article>"; }).join("") || "<p>No lot matches that search.</p>";
}
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
    return '<div class="line"><div><strong>' + i.name + "</strong><span>" + i.size + " · typical " + money(i.typical) + '</span></div><div class="step"><button type="button" onclick="setQty(\'' + i.id + "','" + i.size + "'," + (i.qty - 1) + ')">−</button><b>' + i.qty + '</b><button type="button" onclick="setQty(\'' + i.id + "','" + i.size + "'," + (i.qty + 1) + ')">+</button></div></div>';
  }).join("");
}
function openCart() { document.body.classList.add("cart-open"); }
function closeCart() { document.body.classList.remove("cart-open"); }
function bindChrome() {
  document.querySelectorAll("[data-logo]").forEach(function (img) { img.src = window.AUVELL.logo; });
  var menu = document.querySelector(".menu");
  if (menu) menu.addEventListener("click", function () { document.body.classList.toggle("menu-open"); });
  if (!document.getElementById("open-cart")) {
    var bag = document.createElement("button");
    bag.id = "open-cart"; bag.className = "bag"; bag.type = "button";
    bag.innerHTML = 'Note <span id="basket-count">0</span>';
    var top = document.querySelector(".top");
    if (top) top.appendChild(bag);
  }
  var bagBtn = document.getElementById("open-cart");
  if (bagBtn) bagBtn.addEventListener("click", openCart);
  var close = document.getElementById("close-cart");
  if (close) close.addEventListener("click", closeCart);
  var scrim = document.getElementById("scrim");
  if (scrim) scrim.addEventListener("click", function () { document.body.classList.remove("cart-open"); document.body.classList.remove("menu-open"); });
  var send = document.getElementById("send-note");
  if (send) send.addEventListener("click", sendNote);
  var gate = document.getElementById("gate");
  var enter = document.getElementById("enter");
  if (gate && sessionStorage.getItem("auvell-in") === "1") gate.classList.add("hide");
  if (enter) enter.addEventListener("click", function () {
    if (!document.getElementById("age").checked || !document.getElementById("ruo").checked) return;
    sessionStorage.setItem("auvell-in", "1"); gate.classList.add("hide");
  });
  var search = document.getElementById("q");
  if (search) {
    var lot = new URLSearchParams(location.search).get("lot");
    if (lot) search.value = lot;
    search.addEventListener("input", renderQuality);
  }
}
function cartHtml() {
  if (document.getElementById("enquiry-cart")) return;
  var wrap = document.createElement("div");
  wrap.innerHTML = '<div id="scrim" class="scrim"></div><aside id="enquiry-cart" class="drawer"><div class="drawer-top"><h2>Your note</h2><button type="button" id="close-cart">Close</button></div><p class="hint">This is not a checkout. Typical figures are listed ranges, not a charge.</p><p id="cart-empty">Nothing in the note yet.</p><div id="cart-lines"></div><p id="cart-ref" class="ref"></p><label>Anything you want to ask<textarea id="ask" placeholder="Ask anything."></textarea></label><button class="btn solid" type="button" id="send-note">Send this note</button></aside>';
  document.body.appendChild(wrap);
}
document.addEventListener("DOMContentLoaded", function () {
  cartHtml(); bindChrome();
  var grid = document.getElementById("grid");
  if (grid) renderGrid(grid.dataset.limit ? 3 : null);
  renderProduct(); renderQuality(); renderBasket();
});
