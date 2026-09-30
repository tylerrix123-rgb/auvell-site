window.AUVELL = {
  logo: "logo.svg",
  whatsapp: "",
  products: [
    {
      id: "mt2",
      name: "Melanotan 2",
      sizeLabel: "10 mg",
      lot: "AUV-MT2",
      sizes: [{ label: "10 mg", typical: 49 }],
      study: "<p>In trials and scientific studies, Melanotan 2 has been examined as a melanocortin receptor agonist. Published work has reported rises in melanin activity and skin pigmentation, and further study of melanocortin pathways linked to appetite and sexual function.</p><p>Human data is limited. This is literature context, not a result promised by this listing.</p>"
    },
    {
      id: "ghkcu",
      name: "GHK-Cu",
      sizeLabel: "100 mg",
      lot: "AUV-GHK",
      sizes: [{ label: "100 mg", typical: 55 }],
      study: "<p>In laboratory and clinical skin research, GHK-Cu — a copper-binding tripeptide found in human plasma — has been studied for changes in collagen and extracellular-matrix markers, wound-repair signalling, and anti-inflammatory gene expression.</p><p>Most of that work is in cells, tissue models, and topical skin studies. This is literature context, not a result promised by this listing.</p>"
    },
    {
      id: "water",
      name: "Bacteriostatic water",
      sizeLabel: "10 mL",
      lot: "AUV-BW",
      sizes: [{ label: "10 mL", typical: 12 }],
      study: "<p>This is not a peptide. Bacteriostatic water is sterile water with a small amount of benzyl alcohol. In laboratory practice it is used so a multi-draw stock is less likely to spoil on first opening.</p><p>There are no ‘trial results’ for it as a research chemical in the same sense as the peptides on this list. It is listed on its own because it is a separate material.</p>"
    },
    {
      id: "blend",
      name: "KPV / BPC-157 / TB-500",
      sizeLabel: "30 mg total · 10 mg of each",
      lot: "AUV-BLD",
      sizes: [{ label: "30 mg mixed vial", typical: 65 }],
      study: "<p>This listing holds three research chemicals. In published studies:</p><p><strong>KPV</strong> is a short fragment of alpha-MSH. Laboratory work has reported anti-inflammatory signalling in gut and skin models.</p><p><strong>BPC-157</strong> is a gastric pentadecapeptide. Most published work is preclinical — animal and cell studies on tissue integrity and blood-vessel markers.</p><p><strong>TB-500</strong> (a thymosin beta-4 fragment) has been studied for actin regulation and cell migration in tissue-repair models, again largely preclinical.</p><p>None of that is a protocol, a stack, or a promised result from this listing.</p>"
    },
    {
      id: "reta",
      name: "Retatrutide",
      sizeLabel: "30 mg",
      lot: "AUV-R30",
      sizes: [{ label: "30 mg", typical: 165 }],
      study: "<p>In published clinical research, retatrutide has been studied as a triple agonist at GLP-1, GIP and glucagon receptors. Phase 2 trials have reported substantial reductions in body weight and changes in metabolic markers in adults with obesity.</p><p>That is licensed-drug research literature. This listing is a research material only. Auvell does not supply a medicine, and this page does not teach use.</p>"
    }
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
function currentRef() {
  try { return (sessionStorage.getItem("auvell-ref") || "").trim(); }
  catch (e) { return ""; }
}
function refLine() {
  var ref = currentRef();
  return ref ? ("Referral code " + ref + " used.") : "No referral code used.";
}
function paintRef() {
  var el = document.getElementById("ref-line");
  if (el) el.textContent = refLine();
  var inp = document.getElementById("note-ref");
  if (inp && !inp.dataset.bound) {
    inp.value = currentRef();
    inp.addEventListener("input", function () {
      try { sessionStorage.setItem("auvell-ref", inp.value.trim()); } catch (e) {}
      var line = document.getElementById("ref-line");
      if (line) line.textContent = refLine();
    });
    inp.dataset.bound = "1";
  }
}
function buildMessage() {
  var list = items();
  var q = ((document.getElementById("ask") || {}).value || "").trim();
  var lines = ["Hello Auvell,", "", "This is a research enquiry only. These materials are for laboratory research purposes. This is not an order for human or veterinary use.", "", "I am interested in the following. Typical listed ranges are context only — not a quote."];
  if (list.length) {
    list.forEach(function (i) { lines.push("- " + i.qty + " × " + i.name + " (" + i.size + "), typical listed about " + money(i.typical)); });
    if (refTotal()) lines.push("Combined typical listed figure: " + money(refTotal()) + " (reference only).");
  } else lines.push("- I have not added a research chemical yet.");
  lines.push("", refLine());
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
  box.innerHTML =
    "<p class='kicker'>Research material</p>" +
    "<h2>" + p.name + "</h2>" +
    "<p>" + p.sizeLabel + ". Lot mark " + p.lot + ".</p>" +
    "<p class='ref'>Typical listed " + money(first.typical) + " — not an Auvell price.</p>" +
    "<div class='study'><p class='kicker'>In published research</p>" + (p.study || "") +
    "<p class='hint'>Educational context from trials and laboratory studies. Not advice for human use. Auvell will not teach reconstitution, stacks or dosages.</p></div>" +
    "<div class='qty'><button type='button' onclick=\"setQty('" + p.id + "','" + first.label + "'," + (q-1) + ")\">−</button><b>" + q + "</b><button type='button' onclick=\"addOne('" + p.id + "','" + first.label + "')\">+</button></div>" +
    "<p><a class='text-link' href='quality.html?lot=" + encodeURIComponent(p.lot) + "'>Check the lot file</a></p>" +
    "<p><button class='btn solid' type='button' onclick=\"addOne('" + p.id + "','" + first.label + "')\">Add to note</button> <button class='btn' type='button' onclick='closeDetail()'>Close</button></p>";
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
  paintRef();
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
  paintRef();
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
