window.AUVELL = {
  whatsapp: "",
  logo: "logo.svg",
  products: [
    { id: "p1", name: "Peptide 01", note: "Confirm the name in chat", sizes: ["5 mg", "10 mg"] },
    { id: "p2", name: "Peptide 02", note: "Confirm the name in chat", sizes: ["2 mg", "5 mg"] },
    { id: "p3", name: "Peptide 03", note: "Confirm the name in chat", sizes: ["5 mg", "10 mg"] },
    { id: "p4", name: "Peptide 04", note: "Confirm the name in chat", sizes: ["10 mg"] },
    { id: "p5", name: "Peptide 05", note: "Confirm the name in chat", sizes: ["5 mg", "10 mg"] },
    { id: "p6", name: "Something else", note: "Ask if it is not listed", sizes: ["Enquire"] }
  ]
};
function auvellWhatsApp(text) {
  var n = (window.AUVELL.whatsapp || "").replace(/\D/g, "");
  if (!n) { alert("Send your WhatsApp number with country code (example 447700900123) and this button will open the chat."); return; }
  window.open("https://wa.me/" + n + "?text=" + encodeURIComponent(text), "_blank", "noopener");
}
function auvellEnquire(name, size) {
  auvellWhatsApp("Hello Auvell, I would like to enquire about " + name + (size ? " (" + size + ")" : "") + ".");
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-logo]").forEach(function (img) { img.src = window.AUVELL.logo; });
  var grid = document.getElementById("product-grid");
  if (grid) {
    grid.innerHTML = window.AUVELL.products.map(function (p) {
      var chips = p.sizes.map(function (s) {
        return '<button class="chip" type="button" onclick="auvellEnquire(\'' + p.name + '\',\'' + s + '\')">' + s + "</button>";
      }).join("");
      return '<article class="card product"><h3>' + p.name + '</h3><div class="rule"></div><p>' + p.note + '</p><div class="sizes">' + chips + '</div><button class="btn wa" type="button" onclick="auvellEnquire(\'' + p.name + '\',\'\')">Enquire on WhatsApp</button></article>';
    }).join("");
  }
  document.querySelectorAll("[data-wa]").forEach(function (btn) {
    btn.addEventListener("click", function () { auvellWhatsApp(btn.getAttribute("data-wa") || "Hello Auvell, I have a question."); });
  });
  var menu = document.querySelector(".menu-btn");
  var links = document.querySelector(".links");
  if (menu && links) menu.addEventListener("click", function () { links.classList.toggle("open"); });
});
