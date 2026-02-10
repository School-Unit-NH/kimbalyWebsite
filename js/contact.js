(function () {
    const form = document.getElementById("contact-form");
    if (!form) {
        return;
    }

    const statusEl = document.getElementById("contact-status");
    const submitBtn = form.querySelector("button[type=\"submit\"]");

    function setStatus(message, isError) {
        if (!statusEl) {
            return;
        }
        statusEl.textContent = message;
        statusEl.classList.remove("d-none", "text-success", "text-danger");
        statusEl.classList.add(isError ? "text-danger" : "text-success");
    }

    function encodeMessage(data) {
        const lines = [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Subject: ${data.subject}`,
            `Message: ${data.message}`
        ];
        return encodeURIComponent(lines.join("\n"));
    }

    function openWhatsApp(number, message) {
        const clean = (number || "").replace(/[^0-9]/g, "");
        if (!clean) {
            return false;
        }
        const url = `https://wa.me/${clean}?text=${message}`;
        window.open(url, "_blank", "noopener");
        return true;
    }

    function openMailto(email, data) {
        if (!email) {
            return false;
        }
        const subject = encodeURIComponent(data.subject || "Contact Form Message");
        const body = encodeURIComponent(
            `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        return true;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = {
            name: form.elements.name ? form.elements.name.value.trim() : "",
            email: form.elements.email ? form.elements.email.value.trim() : "",
            subject: form.elements.subject ? form.elements.subject.value.trim() : "",
            message: form.elements.message ? form.elements.message.value.trim() : ""
        };

        if (!data.name || !data.email || !data.subject || !data.message) {
            setStatus("Please fill in all fields before sending.", true);
            return;
        }

        const message = encodeMessage(data);
        const whatsapp = form.getAttribute("data-whatsapp");
        const email = form.getAttribute("data-email");

        console.log(whatsapp, email, message)

        if (submitBtn) {
            submitBtn.disabled = true;
        }

        const sent =
            // openWhatsApp(whatsapp, message) ||
            openMailto(email, data);

        if (sent) {
            setStatus("Message prepared. Complete the send in the opened app.", false);
            form.reset();
        } else {
            setStatus("No sending method is configured. Add WhatsApp or email.", true);
        }

        if (submitBtn) {
            submitBtn.disabled = false;
        }
    });
})();
