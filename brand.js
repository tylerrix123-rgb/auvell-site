window.AUVELL = {
  whatsapp: "447836447315",
  logo: "logo.svg",
  products: [
    { id: "p1", name: "Compound 01", sizeLabel: "5 mg", sizes: ["5 mg", "10 mg"] },
    { id: "p2", name: "Compound 02", sizeLabel: "2 mg", sizes: ["2 mg", "5 mg"] },
    { id: "p3", name: "Compound 03", sizeLabel: "5 mg", sizes: ["5 mg", "10 mg"] },
    { id: "p4", name: "Compound 04", sizeLabel: "10 mg", sizes: ["10 mg"] },
    { id: "p5", name: "Compound 05", sizeLabel: "5 mg", sizes: ["5 mg", "10 mg"] },
    { id: "p6", name: "Something else", sizeLabel: "Ask us", sizes: ["Other"] }
  ]
};
window.AUVELL.basket = {};
window.AUVELL.filter = "all";
window.AUVELL.sort = "name";
function vialSrc() { return window.AUVELL_VIAL || "vial.jpg"; }
function keyFor(id, size) { return id + "::" + size; }
function findProduct(id) {
  return window.AUVELL.products.filter(function (p) { return p.id === id; })[0] || null;
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
  renderProducts();
}
function changeQty(id, size, delta) { setQty(id, size, qtyOf(id, size) + delta); }
function toast(msg) {
  var el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window.AUVELL._toast);
  window.AUVELL._toast = setTimeout(function () { el.classList.remove("show"); }, 1600);
}
function addOne(id, size) {
  changeQty(id, size, 1);
  var p = findProduct(id);
  toast((p ? p.name : "Item") + " · " + size + " added to your note");
}
function selectedItems() {
  return Object.keys(window.AUVELL.basket).map(function (k) {
    var parts = k.split("::");
    var id = parts[0];
    var size = parts.slice(1).join("::");
    var p = findProduct(id);
    return { id: id, size: size, qty: window.AUVELL.basket[k], name: p ? p.name : id };
  }).filter(function (i) { return i.qty; });
}
function basketCount() {
  return selectedItems().reduce(function (t, i) { return t + i.qty; }, 0);
}
function buildMessage() {
  var items = selectedItems();
  var question = ((document.getElementById("ask-anything") || {}).value || "").trim();
  var parts = ["Hello Auvell,"];
  if (items.length) {
    parts.push("", "I would love to ask about:");
    items.forEach(function (i) { parts.push("- " + i.qty + " x " + i.name + " (" + i.size + ")"); });
  }
  if (question) parts.push("", question);
  if (!items.length && !question) parts.push("", "I have a question.");
  return parts.join("\n");
}
function openCart() {
  closeMenu();
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
function openMenu() { document.body.classList.add("menu-open"); }
function closeMenu() { document.body.classList.remove("menu-open"); }
function toggleMenu() { document.body.classList.toggle("menu-open"); }
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
    return '<div class="line"><div><strong>' + i.name + '</strong><div>' + i.size + '</div></div>' +
      '<div class="step"><button type="button" onclick="changeQty(\'' + i.id + '\',\'' + i.size + '\',-1)">−</button><strong>' + i.qty + '</strong><button type="button" onclick="changeQty(\'' + i.id + '\',\'' + i.size + '\',1)">+</button></div>' +
      '<button class="linkish" type="button" onclick="setQty(\'' + i.id + '\',\'' + i.size + '\',0)">Remove</button></div>';
  }).join("");
}
function visibleProducts() {
  var list = window.AUVELL.products.slice();
  if (window.AUVELL.filter !== "all") {
    list = list.filter(function (p) { return p.sizes.indexOf(window.AUVELL.filter) !== -1; });
  }
  list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  if (window.AUVELL.sort === "za") list.reverse();
  return list;
}
function renderProducts() {
  var grid = document.getElementById("product-grid");
  if (!grid) return;
  var list = visibleProducts();
  if (grid.dataset.limit) list = list.slice(0, parseInt(grid.dataset.limit, 10));
  var count = document.getElementById("result-count");
  if (count && !grid.dataset.limit) count.textContent = "Showing " + list.length + " compounds";
  grid.innerHTML = list.map(function (p) {
    var sizes = p.sizes.map(function (s) {
      var on = qtyOf(p.id, s) ? " on" : "";
      return '<button class="' + on + '" type="button" onclick="addOne(\'' + p.id + '\',\'' + s + '\')">' + s + "</button>";
    }).join("");
    return '<article class="card"><div class="shot"><img src="' + vialSrc() + '" alt="' + p.name + '" /></div>' +
      '<div class="meta"><div><strong>' + p.name + "</strong><em>" + p.sizeLabel + "</em></div>" +
      '<button class="plus" type="button" onclick="addOne(\'' + p.id + '\',\'' + p.sizes[0] + '\')" aria-label="Add">+</button></div>' +
      '<div class="sizes">' + sizes + "</div></article>";
  }).join("");
}
function bindChrome() {
  document.querySelectorAll("[data-logo]").forEach(function (img) { img.src = window.AUVELL.logo; });
  document.querySelectorAll("[data-hero-vial]").forEach(function (img) { img.src = vialSrc(); });
  var bar = document.getElementById("float-nav");
  if (bar) {
    var tick = function () { bar.classList.toggle("show", window.scrollY > 80); };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    if (!bar.querySelector(".menu-btn")) {
      var b = document.createElement("button");
      b.className = "menu-btn"; b.type = "button"; b.textContent = "☰";
      b.addEventListener("click", function (e) { e.preventDefault(); toggleMenu(); });
      bar.appendChild(b);
    }
  }
  if (!document.getElementById("mobile-menu")) {
    var veil = document.createElement("div"); veil.id = "menu-veil";
    var menu = document.createElement("div"); menu.id = "mobile-menu";
    menu.innerHTML = '<button class="menu-close" type="button">×</button><a href="index.html">Home</a><a href="compounds.html">Shop</a><a href="learn.html">Guide</a><a href="about.html">About</a><a href="legal.html">Notes</a>';
    document.body.appendChild(veil); document.body.appendChild(menu);
    veil.addEventListener("click", closeMenu);
    menu.querySelector(".menu-close").addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  }
  document.querySelectorAll(".menu-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) { e.preventDefault(); toggleMenu(); });
  });
  ["open-cart", "open-cart-2"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("click", openCart);
  });
  var close = document.getElementById("close-cart");
  if (close) close.addEventListener("click", closeCart);
  var scrim = document.getElementById("scrim");
  if (scrim) scrim.addEventListener("click", closeCart);
  var send = document.getElementById("send-enquiry");
  if (send) send.addEventListener("click", function () { auvellWhatsApp(buildMessage()); });
  document.querySelectorAll("[data-filter]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      window.AUVELL.filter = chip.getAttribute("data-filter");
      document.querySelectorAll("[data-filter]").forEach(function (c) { c.classList.toggle("on", c === chip); });
      renderProducts();
    });
  });
  var sort = document.getElementById("sort");
  if (sort) sort.addEventListener("change", function () { window.AUVELL.sort = sort.value; renderProducts(); });
  var gate = document.getElementById("age-gate");
  var enter = document.getElementById("enter-site");
  if (gate && sessionStorage.getItem("auvell-in") === "1") gate.classList.add("hide");
  if (enter) enter.addEventListener("click", function () {
    var a = document.getElementById("age-ok");
    var r = document.getElementById("ruo-ok");
    if (!a.checked || !r.checked) { alert("Please tick both boxes."); return; }
    sessionStorage.setItem("auvell-in", "1");
    gate.classList.add("hide");
  });
}
document.addEventListener("DOMContentLoaded", function () {
  bindChrome();
  renderProducts();
  renderBasket();
});
