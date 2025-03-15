document.addEventListener("DOMContentLoaded", () => {
    let currentModelIndex = null; // Speichert das aktuell getrackte Modell

    // 📡 MindAR: Tracking-Events abhören
    document.querySelectorAll("a-entity[mindar-image-target]").forEach((entity) => {
        entity.addEventListener("targetFound", () => {
            let targetIndex = entity.getAttribute("mindar-image-target").targetIndex;
            console.log(`📸 Tracking erkannt! Modell: ${targetIndex}`);
            currentModelIndex = targetIndex; // Speichert das aktuelle Modell
        });

        entity.addEventListener("targetLost", () => {
            console.log("🔍 Tracking verloren!");
            currentModelIndex = null; // Setzt das Modell zurück, wenn es verloren geht
        });
    });

    // 🖱 Info-Button: Daten aus `info.json` laden
    document.getElementById("info-button").addEventListener("click", () => {
        Haptics.tapFeedback();
        Haptics.showFeedback();
        fetch("./JSON/info.json")
            .then((response) => response.json())
            .then((data) => {
                let info = data[currentModelIndex] || data["default"]; // Fallback auf Standard-Text
                document.getElementById("info-title").textContent = info.title;
                document.getElementById("info-text").textContent = info.description;
                document.getElementById("info-overlay").classList.add("active"); // Zeigt das Info-Overlay
            })
            .catch((error) => {
                console.error("❌ Fehler beim Laden der Informationen:", error);
                document.getElementById("info-title").textContent = "Fehler";
                document.getElementById("info-text").textContent =
                    "Es ist ein Fehler aufgetreten. Informationen konnten nicht geladen werden.";
                document.getElementById("info-overlay").classList.add("active");
            });
    });

    // ❌ Schließen des Info-Overlays
    document.getElementById("close-info").addEventListener("click", () => {
        Haptics.closeFeedback();
        console.log("INFO OVERLAY GESCHLOSSEN");
        document.getElementById("info-overlay").classList.remove("active");
    });
});