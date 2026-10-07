window.AUVELL = {
  logo: "logo.png",
  whatsapp: "",
  products: [
    {
      id: "mt2",
      name: "Melanotan 2",
      image: "vials/mt2.png",
      sizeLabel: "10 mg",
      lot: "AUV-MT2",
      sizes: [{ label: "10 mg", typical: 49 }],
      stage: "Early human studies. No approved medicine.",
      study: "<p>Melanotan 2 is a synthetic cyclic heptapeptide that acts on melanocortin receptors (mainly MC1R, also MC3R and MC4R).</p><p><strong>Stage of research.</strong> Human work began in the 1990s and 2000s. Small clinical studies looked at pigmentation and, separately, sexual function. It did not complete a full Phase 3 programme as a tanning medicine. A later related compound, bremelanotide (PT-141), did go on to approval for a different indication. Melanotan 2 itself is not an approved medicine.</p><p><strong>What published studies reported.</strong> Increased melanin activity and darker skin pigmentation in study settings. Nausea and flushing were commonly noted. Some papers also explored melanocortin effects on appetite and sexual function. Sample sizes were small by modern trial standards.</p><p>That is literature. It is not a result this listing will produce.</p>"
    },
    {
      id: "ghkcu",
      name: "GHK-Cu",
      image: "vials/ghkcu.png",
      sizeLabel: "100 mg",
      lot: "AUV-GHK",
      sizes: [{ label: "100 mg", typical: 55 }],
      stage: "Mostly laboratory and topical skin studies.",
      study: "<p>GHK-Cu is a copper-binding tripeptide that occurs in human plasma. Levels fall with age, which is why it is so often studied in skin and repair models.</p><p><strong>Stage of research.</strong> A large body of in-vitro and tissue work, plus smaller topical skin studies. There is no large Phase 3 drug programme for this research listing. Most human data is cosmetic or dermatology-scale, not a licensed injectable medicine trial.</p><p><strong>What published studies reported.</strong> Changes in collagen and extracellular-matrix markers. Shifts in wound-repair and anti-inflammatory gene expression in cell models. Some topical studies reported improvements in skin appearance scores. That work does not establish a clinical protocol for this listing.</p>"
    },
    {
      id: "water",
      name: "Bacteriostatic water",
      image: "vials/water.png",
      sizeLabel: "10 mL",
      lot: "AUV-BW",
      sizes: [{ label: "10 mL", typical: 12 }],
      stage: "Laboratory solvent. Not a trial compound.",
      study: "<p>This is not a peptide and it has no clinical-trial programme of its own in the sense the others do.</p><p><strong>What it is.</strong> Sterile water with a small amount of benzyl alcohol. In laboratory practice that helps a multi-draw stock stay usable after first opening.</p><p>It is listed separately because it is a separate material. Auvell will not teach how it is combined with anything else.</p>"
    },
    {
      id: "blend",
      name: "KPV / BPC-157 / TB-500",
      image: "vials/blend.png",
      sizeLabel: "30 mg total · 10 mg of each",
      lot: "AUV-BLD",
      sizes: [{ label: "30 mg mixed vial", typical: 65 }],
      stage: "Mostly preclinical. Limited formal human trials.",
      study: "<p>Three research chemicals in one listing. Their literatures are not the same.</p><p><strong>KPV.</strong> A short C-terminal fragment of alpha-MSH. Stage: laboratory and animal models, with some early translational interest in gut and skin inflammation. Published work has reported anti-inflammatory signalling. Formal late-stage human trials are thin.</p><p><strong>BPC-157.</strong> A gastric pentadecapeptide. Stage: almost entirely preclinical — rodent and cell studies on tissue integrity and blood-vessel markers. Reliable randomised human trials are scarce. It is not an approved medicine.</p><p><strong>TB-500.</strong> A fragment related to thymosin beta-4. Full-length thymosin beta-4 has seen some clinical exploration in wound and eye research. The fragment used in research listings is less well covered by formal Phase 2/3 programmes. Published models focus on actin, cell migration and repair markers.</p><p>This page does not treat the three as a stack or a protocol.</p>"
    },
    {
      id: "reta",
      name: "Retatrutide",
      image: "vials/reta.png",
      sizeLabel: "30 mg",
      lot: "AUV-R30",
      sizes: [{ label: "30 mg", typical: 165 }],
      stage: "Published Phase 2. Phase 3 programmes running.",
      study: "<p>Retatrutide (LY3437943) is a triple agonist at GLP-1, GIP and glucagon receptors. It has a proper modern trial trail, which is why its literature is easier to describe.</p><p><strong>Stage of research.</strong> Phase 2 obesity trials have been published. A Phase 3 programme (often referred to as TRIUMPH) is underway for licensed-drug development. That programme is not this listing.</p><p><strong>What published Phase 2 work reported.</strong> In adults with obesity, higher-dose arms were associated with large mean reductions in body weight over 24 and 48 weeks, alongside changes in metabolic markers. Gastrointestinal effects typical of this receptor class were also reported. Exact figures belong to the papers, not to a shop card.</p><p>Auvell lists a research material. It does not supply a licensed medicine and will not teach use, reconstitution or dosing.</p>"
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
function ensureDetail() {
  var box = document.getElementById("detail");
  if (box) return box;
  box = document.createElement("div");
  box.id = "detail";
  box.className = "modal";
  box.addEventListener("click", function (e) { if (e.target === box) closeDetail(); });
  document.body.appendChild(box);
  return box;
}
function openDetail(id) {
  var p = findProduct(id);
  if (!p) return;
  var box = ensureDetail();
  var first = p.sizes[0];
  var q = qtyOf(p.id, first.label) || 1;
  box.innerHTML =
    "<div class='modal-card' role='dialog' aria-modal='true'>" +
      "<button class='modal-x' type='button' onclick='closeDetail()'>Close</button>" +
      "<div class='modal-scroll'>" +
        "<div class='modal-visual'><img src='" + (p.image || "vials/mt2.png") + "' alt='Example presentation of " + p.name + "' /><p class='hint'>Example of how this research material is typically presented. Not a photograph of this lot.</p></div>" +
        "<p class='kicker'>Research material</p>" +
        "<h2>" + p.name + "</h2>" +
        "<p>" + p.sizeLabel + ". Lot mark " + p.lot + ".</p>" +
        "<p class='stage'>" + (p.stage || "") + "</p>" +
        "<p class='ref'>Typical listed " + money(first.typical) + " — not an Auvell price.</p>" +
        "<div class='study'><p class='kicker'>In published research</p>" + (p.study || "") +
        "<p class='hint'>Educational context only. Not a result promised by this listing. Auvell will not teach reconstitution, stacks or dosages.</p></div>" +
        "<div class='qty'><button type='button' onclick=\"setQty('" + p.id + "','" + first.label + "'," + (q-1) + ")\">−</button><b>" + q + "</b><button type='button' onclick=\"addOne('" + p.id + "','" + first.label + "')\">+</button></div>" +
        "<p><a class='text-link' href='quality.html?lot=" + encodeURIComponent(p.lot) + "'>Check the lot file</a></p>" +
        "<p><button class='btn solid' type='button' onclick=\"addOne('" + p.id + "','" + first.label + "')\">Add to note</button> <button class='btn' type='button' onclick='closeDetail()'>Close</button></p>" +
      "</div>" +
    "</div>";
  document.body.classList.add("detail-open");
}
function closeDetail() { document.body.classList.remove("detail-open"); }
window.openDetail = openDetail;
window.closeDetail = closeDetail;
window.addOne = addOne;
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
