window.AUVELL = window.AUVELL || {
  logo: "logo.svg",
  products: [
    { id: "p1", name: "Compound 01", sizeLabel: "5 mg · 10 mg", sizes: ["5 mg", "10 mg"], lot: "AUV-P01" },
    { id: "p2", name: "Compound 02", sizeLabel: "2 mg · 5 mg", sizes: ["2 mg", "5 mg"], lot: "AUV-P02" },
    { id: "p3", name: "Compound 03", sizeLabel: "5 mg · 10 mg", sizes: ["5 mg", "10 mg"], lot: "AUV-P03" },
    { id: "p4", name: "Compound 04", sizeLabel: "10 mg", sizes: ["10 mg"], lot: "AUV-P04" },
    { id: "p5", name: "Compound 05", sizeLabel: "5 mg · 10 mg", sizes: ["5 mg", "10 mg"], lot: "AUV-P05" },
    { id: "p6", name: "Further compounds", sizeLabel: "On request", sizes: ["On request"], lot: "ASK" }
  ]
};

function vialSrc() { return window.AUVELL_VIAL || "vial.jpg"; }
function findProduct(id) {
  return window.AUVELL.products.filter(function (p) { return p.id === id; })[0] || null;
}

function renderGrid(limit) {
  var grid = document.getElementById("grid");
  if (!grid) return;
  var list = window.AUVELL.products.slice();
  if (limit) list = list.slice(0, limit);
  grid.innerHTML = list.map(function (p) {
    return '<a class="card" href="product.html?id=' + p.id + '">' +
      '<div class="shot"><img src="' + vialSrc() + '" alt=""></div>' +
      '<div class="meta"><strong>' + p.name + '</strong><em>' + p.sizeLabel + '</em></div></a>';
  }).join("");
}

function renderProduct() {
  var root = document.getElementById("product");
  if (!root) return;
  var p = findProduct(new URLSearchParams(location.search).get("id"));
  if (!p) { root.innerHTML = "<p>That compound is not on the list.</p>"; return; }
  var sizes = p.sizes.map(function (s, i) {
    return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-size="' + s + '">' + s + "</button>";
  }).join("");
  root.innerHTML =
    '<div class="shot large"><img src="' + vialSrc() + '" alt=""></div>' +
    '<div><p class="kicker">Research material</p><h1>' + p.name + "</h1>" +
    "<p>Listed sizes: " + p.sizeLabel + ". Lot on the card: " + p.lot + ".</p>" +
    '<div class="sizes">' + sizes + "</div>" +
    "<p>Paperwork for this lot is not uploaded yet. Search Quality by the lot code, or leave a note.</p>" +
    '<label>A short note<textarea id="note" placeholder="Name, size, and anything you need to ask."></textarea></label>' +
    '<p style="margin-top:16px"><button class="btn solid" type="button" id="keep-note">Keep this note</button> ' +
    '<a class="btn" href="quality.html?lot=' + encodeURIComponent(p.lot) + '">Look up the lot</a></p></div>';
  root.querySelectorAll("[data-size]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      root.querySelectorAll("[data-size]").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
    });
  });
  var keep = document.getElementById("keep-note");
  if (keep) keep.addEventListener("click", function () {
    var size = (root.querySelector("[data-size].on") || {}).textContent || p.sizeLabel;
    var text = (document.getElementById("note") || {}).value || "";
    localStorage.setItem("auvell-note", p.name + " · " + size + "\n" + text);
    keep.textContent = "Note kept on this device";
  });
}

function renderQuality() {
  var box = document.getElementById("lots");
  if (!box) return;
  var q = ((document.getElementById("q") || {}).value || new URLSearchParams(location.search).get("lot") || "").toLowerCase();
  var rows = window.AUVELL.products.filter(function (p) {
    return !q || (p.name + " " + p.lot).toLowerCase().indexOf(q) !== -1;
  });
  box.innerHTML = rows.map(function (p) {
    return '<article class="note"><div><strong>' + p.name + "</strong><em>" + p.lot + "</em>" +
      "<p>No file uploaded for this lot yet.</p></div></article>";
  }).join("") || "<p>No lot matches that search.</p>";
}

function bindChrome() {
  document.querySelectorAll("[data-logo]").forEach(function (img) { img.src = window.AUVELL.logo; });
  var menu = document.querySelector(".menu");
  if (menu) menu.addEventListener("click", function () { document.body.classList.toggle("menu-open"); });
  var gate = document.getElementById("gate");
  var enter = document.getElementById("enter");
  if (gate && sessionStorage.getItem("auvell-in") === "1") gate.classList.add("hide");
  if (enter) enter.addEventListener("click", function () {
    var a = document.getElementById("age");
    var r = document.getElementById("ruo");
    if (!a.checked || !r.checked) return;
    sessionStorage.setItem("auvell-in", "1");
    gate.classList.add("hide");
  });
  var search = document.getElementById("q");
  if (search) {
    if (new URLSearchParams(location.search).get("lot")) search.value = new URLSearchParams(location.search).get("lot");
    search.addEventListener("input", renderQuality);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  bindChrome();
  var grid = document.getElementById("grid");
  if (grid) renderGrid(grid.dataset.limit ? 3 : null);
  renderProduct();
  renderQuality();
});
