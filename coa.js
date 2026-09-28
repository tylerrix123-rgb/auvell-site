if (!document.querySelector('link[href="glamour.css"]')) {
  var theme = document.createElement("link");
  theme.rel = "stylesheet";
  theme.href = "glamour.css";
  document.head.appendChild(theme);
}
window.AUVELL.email = window.AUVELL.email || "";
window.AUVELL.products.forEach(function (p, i) {
  if (!p.lot) p.lot = p.id === "p6" ? "ASK" : "AUV-P0" + (i + 1);
});
window.AUVELL.coas = window.AUVELL.coas || window.AUVELL.products.filter(function (p) {
  return p.lot && p.lot !== "ASK";
}).map(function (p) {
  return { lot: p.lot, name: p.name, file: "", note: "Paperwork not uploaded yet." };
});
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
    return '<article class="card"><a class="shot" href="product.html?id=' + p.id + '"><img src="' + vialSrc() + '" alt="' + p.name + '" /></a>' +
      '<div class="meta"><div><strong>' + p.name + "</strong><em>" + p.sizeLabel + " · Lot " + (p.lot || "—") + "</em></div>" +
      '<button class="plus" type="button" onclick="addOne(\'' + p.id + '\',\'' + p.sizes[0] + '\')" aria-label="Add">+</button></div>' +
      '<div class="sizes">' + sizes + '</div>' +
      '<a class="paper-link" href="quality.html?lot=' + encodeURIComponent(p.lot || "") + '">Paperwork</a></article>';
  }).join("");
}
function renderCoas(query) {
  var box = document.getElementById("coa-list");
  if (!box) return;
  query = (query || "").toLowerCase().trim();
  var rows = window.AUVELL.coas.filter(function (c) {
    if (!query) return true;
    return (c.lot + " " + c.name).toLowerCase().indexOf(query) !== -1;
  });
  if (!rows.length) {
    box.innerHTML = '<p class="empty-coa">No lot matches that search. Send the code on WhatsApp and we will look it up.</p>';
    return;
  }
  box.innerHTML = rows.map(function (c) {
    var action = c.file
      ? '<a class="btn" href="' + c.file + '" target="_blank" rel="noopener">Open file</a>'
      : '<button class="btn" type="button" onclick="requestLot(\'' + c.lot + '\',\'' + c.name.replace(/'/g, "") + '\')">Request this file</button>';
    return '<article class="coa-row"><div><strong>' + c.name + '</strong><em>' + c.lot + '</em><p>' + c.note + "</p></div>" + action + "</article>";
  }).join("");
}
function requestLot(lot, name) {
  auvellWhatsApp("Hello Auvell,\nPlease send the paperwork for " + (name || "this compound") + " · lot " + lot + ".");
}
document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  var search = document.getElementById("coa-search");
  if (search) {
    var params = new URLSearchParams(window.location.search);
    if (params.get("lot")) search.value = params.get("lot");
    renderCoas(search.value);
    search.addEventListener("input", function () { renderCoas(search.value); });
  }
  var lotBtn = document.getElementById("send-lot");
  if (lotBtn) lotBtn.addEventListener("click", function () {
    var lot = (document.getElementById("lot-code") || {}).value || "";
    var extra = (document.getElementById("lot-note") || {}).value || "";
    var msg = "Hello Auvell,\nI cannot find paperwork for lot: " + (lot || "(not given)") + ".";
    if (extra) msg += "\n" + extra;
    auvellWhatsApp(msg);
  });
  var root = document.getElementById("product-page");
  if (root) {
    var id = new URLSearchParams(window.location.search).get("id");
    var p = findProduct(id);
    if (!p) root.innerHTML = "<p>That item is not on the list.</p>";
    else {
      var sizes = p.sizes.map(function (s) {
        return '<button class="chip" type="button" onclick="addOne(\'' + p.id + '\',\'' + s + '\')">' + s + "</button>";
      }).join("");
      root.innerHTML =
        '<div class="shot big"><img src="' + vialSrc() + '" alt="' + p.name + '" /></div>' +
        '<div><p class="eyebrow">Research material</p><h1>' + p.name + "</h1>" +
        "<p>Pack sizes: " + p.sizeLabel + "</p><p>Lot on the card: " + p.lot + "</p>" +
        "<p>Paperwork for this lot is not uploaded yet. Ask for the file on the Quality page or add the pack to your note.</p>" +
        '<div class="chips" style="margin:16px 0">' + sizes + "</div>" +
        '<a class="btn" href="quality.html?lot=' + encodeURIComponent(p.lot) + '">Look up paperwork</a></div>';
    }
  }
  var contactBtn = document.getElementById("send-contact");
  if (contactBtn) contactBtn.addEventListener("click", function () {
    var name = (document.getElementById("c-name") || {}).value || "";
    var topic = (document.getElementById("c-topic") || {}).value || "";
    var body = (document.getElementById("c-body") || {}).value || "";
    auvellWhatsApp("Hello Auvell,\nName: " + name + "\nTopic: " + topic + "\n\n" + body);
  });
});
