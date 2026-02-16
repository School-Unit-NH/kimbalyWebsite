(function () {
    const form = document.getElementById("admission-form");
    if (!form) {
        return;
    }

    const statusEl = document.getElementById("admission-status");
    const submitBtn = form.querySelector("button[type=\"submit\"]");

    function setStatus(message, isError) {
        if (!statusEl) {
            return;
        }
        statusEl.textContent = message;
        statusEl.classList.remove("d-none", "text-success", "text-danger");
        statusEl.classList.add(isError ? "text-danger" : "text-success");
    }

    function openWhatsApp(number, encodedMessage) {
        const clean = (number || "").replace(/[^0-9]/g, "");
        if (!clean) {
            return false;
        }
        window.open(`https://wa.me/${clean}?text=${encodedMessage}`, "_blank", "noopener");
        return true;
    }

    function openMailto(email, subject, body) {
        if (!email) {
            return false;
        }
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return true;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const guardianName = form.elements.guardian_name ? form.elements.guardian_name.value.trim() : "";
        const phone = form.elements.phone ? form.elements.phone.value.trim() : "";
        const childClass = form.elements.child_class ? form.elements.child_class.value : "";

        if (!guardianName || !phone || !childClass) {
            setStatus("Please complete all admissions fields before sending.", true);
            return;
        }

        const prettyClass = childClass.toUpperCase() === "KG"
            ? "Kindergarten"
            : childClass.toUpperCase().replace("P", "Year ");

        const body = [
            "Hello Kimberly Castle School Admissions Team,",
            "",
            "I would like to request admissions information.",
            `Parent/Guardian Name: ${guardianName}`,
            `Phone Number: ${phone}`,
            `Preferred Class: ${prettyClass}`,
            "",
            "Please share requirements, fees, and available resumption dates."
        ].join("\n");

        const encoded = encodeURIComponent(body);
        const subject = `Admission Inquiry - ${prettyClass}`;
        const whatsapp = form.getAttribute("data-whatsapp");
        const email = form.getAttribute("data-email");

        if (submitBtn) {
            submitBtn.disabled = true;
        }

        const sent = openWhatsApp(whatsapp, encoded) || openMailto(email, subject, body);

        if (sent) {
            setStatus("Admissions message prepared. Complete send in the opened app.", false);
            form.reset();
        } else {
            setStatus("No admissions sending method configured.", true);
        }

        if (submitBtn) {
            submitBtn.disabled = false;
        }
    });
})();
