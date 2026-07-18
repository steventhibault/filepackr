(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var modal = document.getElementById("demoModal");
  var form = document.getElementById("demoRequestForm");
  if (!modal || !form) return;

  var closeButton = modal.querySelector(".demo-close");
  var sourceInput = document.getElementById("demoSource");
  var toggle = document.getElementById("detailsToggle");
  var optionalDetails = document.getElementById("optionalDetails");
  var status = document.getElementById("formStatus");

  function openModal(source) {
    sourceInput.value = source || document.title;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    status.textContent = "";
    status.className = "form-status";
    requestAnimationFrame(function () {
      var firstField = document.getElementById("firstName");
      if (firstField) firstField.focus();
    });
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll(".demo-trigger").forEach(function (button) {
    button.addEventListener("click", function () {
      openModal(button.dataset.source);
      if (window.trackFilepackREvent) {
        window.trackFilepackREvent("demo_form_open", { source: button.dataset.source || "seo_landing_page" });
      }
    });
  });

  document.querySelectorAll('a[href^="mailto:steve@stevethibault.com"]').forEach(function (link) {
    if (link.classList.contains("direct-email")) return;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openModal("Contact link");
    });
  });

  if (closeButton) closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !modal.hidden) closeModal(); });

  if (toggle && optionalDetails) {
    toggle.addEventListener("click", function () {
      var isOpen = !optionalDetails.hidden;
      optionalDetails.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.innerHTML = isOpen ? "<span>+</span> Add more details" : "<span>-</span> Hide additional details";
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = "";
    status.className = "form-status";

    var data = new FormData(form);
    var body = [
      "Source: " + (sourceInput.value || document.title),
      "Name: " + [data.get("First name"), data.get("Last name")].filter(Boolean).join(" "),
      "Email: " + (data.get("email") || ""),
      data.get("Phone number") ? "Phone: " + data.get("Phone number") : "",
      "Business or organization: " + (data.get("Business or organization") || ""),
      data.get("Business type") ? "Business type: " + data.get("Business type") : "",
      data.get("Approximate monthly paper stack volume") ? "Paper stacks per month: " + data.get("Approximate monthly paper stack volume") : "",
      data.get("Biggest challenge") ? "Biggest challenge: " + data.get("Biggest challenge") : "",
      "",
      "Workflow needs:",
      data.get("Description of needs") || ""
    ].filter(Boolean).join("\n");

    if (window.trackFilepackREvent) {
      window.trackFilepackREvent("demo_form_mailto_open", { source: sourceInput.value || "seo_landing_page" });
    }

    window.location.href = "mailto:steve@stevethibault.com?subject=" +
      encodeURIComponent("filepackR inquiry from filepackr.com") +
      "&body=" + encodeURIComponent(body);

    status.textContent = "Your email app should open with this request filled in.";
    status.className = "form-status success";
    form.reset();
    if (optionalDetails && toggle) {
      optionalDetails.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = "<span>+</span> Add more details";
    }
  });
}());
