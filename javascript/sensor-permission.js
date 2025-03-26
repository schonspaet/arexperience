document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("motionPermission") === "granted") {
        console.log("🔄 Gyroskop bereits aktiviert!");
        startGyroListener();
    } else if (typeof DeviceMotionEvent.requestPermission === "function") {
        console.log("📌 iOS erkannt – Berechtigungsabfrage erforderlich.");
        askForSensorPermission();
    } else {
        console.log("✅ Standard-Browser – Gyroskop wird direkt gestartet.");
        startGyroListener();
    }
});

// Funktion zur Berechtigungsabfrage
function askForSensorPermission() {
    const permissionOverlay = document.createElement("div");
    permissionOverlay.id = "permission-overlay";
    permissionOverlay.innerHTML = `
        <div class="permission-box">
            <h2>SENSOR PERMISSION</h2>
            <p>This app requires access to motion sensors.</p>
            <button id="grant-permission">GRANT PERMISSION</button>
        </div>
    `;
    document.body.appendChild(permissionOverlay);

    document.getElementById("grant-permission").addEventListener("click", () => {
       Haptics.closeFeedback();
        DeviceMotionEvent.requestPermission()
            .then((response) => {
                if (response === "granted") {
                    console.log("✅ Gyroskop-Erlaubnis erteilt!");
                    localStorage.setItem("motionPermission", "granted");
                    startGyroListener();
                    permissionOverlay.style.display = "none";
                } else {
                    console.warn("❌ Zugriff verweigert!");
                }
            })
            .catch(console.error);
    });
}

// Funktion zum Starten des Gyroskop-Listeners
function startGyroListener() {
    console.log("🔄 Starte Gyroskop-Listener...");

    // Funktion zum Starten des Gyroskop-Listeners
window.addEventListener("deviceorientation", (event) => {
    // Holen der notwendigen Elemente
    const overlay = document.getElementById("glassy-overlay");
    const inspectButton = document.getElementById("inspection-mode");
    const infoButton = document.getElementById("info-button");
    const infoOverlay = document.getElementById("info-overlay");

    // Sicherstellen, dass alle Elemente existieren
    if (!overlay || !infoButton || !infoOverlay) return;

    // Berechne die Neigung des Geräts
    let x = event.gamma || 0; // Links/Rechts Neigung (-90 bis 90)
    let y = event.beta || 0;  // Vor/Zurück Neigung (-180 bis 180)

    // **Glasmorphism Panel**: Rotationseinstellungen für das Glasmorphism Panel
    let rotateY = Math.max(-7, Math.min(7, x * 0.5)); // Begrenzung auf ±10 Grad für das Glasmorphism Panel
    let rotateX = Math.max(-7, Math.min(7, -y * 0.5));  // Begrenzung auf ±10 Grad für das Glasmorphism Panel
    overlay.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // **Info-Button**: Rotationseinstellungen für den Info-Button
        let rotateInspectY = Math.max(-5, Math.min(5, x * 1)); // Größere Neigung für Info-Button
        let rotateInspectX = Math.max(-5, Math.min(5, -y * 1)); // Größere Neigung für Info-Button
        inspectButton.style.transform = `rotateX(${rotateInspectX}deg) rotateY(${rotateInspectY}deg)`;

    // **Info-Button**: Rotationseinstellungen für den Info-Button
    let rotateInfoY = Math.max(-7, Math.min(7, x * 2)); // Größere Neigung für Info-Button
    let rotateInfoX = Math.max(-7, Math.min(7, -y * 2)); // Größere Neigung für Info-Button
    infoButton.style.transform = `rotateX(${rotateInfoX}deg) rotateY(${rotateInfoY}deg)`;

    // **Info-Overlay**: Rotationseinstellungen für das Info-Overlay
    if (infoOverlay.classList.contains('active')) {
        let rotateOverlayY = Math.max(-7, Math.min(7, x * 2)); // Standard Neigung für Overlay
        let rotateOverlayX = Math.max(-7, Math.min(7, -y * 2));  // Standard Neigung für Overlay
        infoOverlay.style.transform = `rotateX(${rotateOverlayX}deg) rotateY(${rotateOverlayY}deg)`;
    }

    // Debug: Sensor-Daten empfangen
   // console.log("📡 Sensor-Daten empfangen:", { gamma: x, beta: y });
});
}