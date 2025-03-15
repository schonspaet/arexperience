

document.addEventListener("DOMContentLoaded", () => {
    const inspectionText = document.getElementById("inspection-text");
    const inspectionMode = document.getElementById("inspection-mode");
    const inspectionToggle = document.getElementById("toggle-inspection");
    const musicBtn = document.getElementById("music-toggle");

    const titleElement = document.getElementById("title"); // Der Titel in der HTML
    let modelNames = {}; // Hier speichern wir die Namen der Modelle


    // JSON-Daten für Modellnamen laden
     fetch("./JSON/models.json")
        .then(response => response.json())
        .then(data => {
        modelNames = data;
        console.log("📦 Modell-Namen geladen:", modelNames);
    })
    .catch(error => console.error("⚠️ Fehler beim Laden der Modellnamen:", error));



    let typewriterActive = false;
    let currentModel = null; // Aktuelles Modell, das getrackt wird
    let isInspecting = false; // Toggle-Zustand (true = Modell gelöst)
    let isZooming = false;
    let zoomCooldown = false; // 🔥 Neue Variable für die Verzögerung
    let startDistance = 0;
    let currentScale = 1;
    let baseScale = { x: 1, y: 1, z: 1 };


    if (!inspectionText || !inspectionMode || !inspectionToggle) {
        console.warn("❌ Ein Inspection-Mode Element fehlt!");
        return;
    }

    console.log("✅ Inspection Mode Script geladen.");


    
    // ⌨️ Typewriter-Effekt mit Wiederholung
    function typeWriterEffect(element, text, speed, delay) {
        if (typewriterActive) return;
        typewriterActive = true;
        console.log("⌨️ Typewriter startet...");

        let i = 0;
        element.textContent = "";

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                setTimeout(() => {
                    console.log("🔁 Typewriter wiederholt sich...");
                    element.textContent = "";
                    i = 0;
                    type();
                }, delay);
            }
        }
        type();
    }

    // 🎭 Glasmorphism-Panel anzeigen (wenn Target gefunden)
    function showInspectionMode() {
        console.log("📸 Target gefunden – Zeige Inspection Mode!");
        inspectionText.style.opacity = "0"; 

        setTimeout(() => {
            inspectionText.style.display = "none";
            inspectionMode.classList.add("active");
            inspectionMode.style.display = "flex";
            console.log("✅ Inspection Mode sichtbar.");
        }, 500);
    }

    // ⏪ Inspection Mode ausblenden (wenn Target verloren)
    function hideInspectionMode() {
        if (isInspecting) return; // Wenn der Inspection Mode aktiv ist, nicht ausblenden!
        console.log("🔍 Target verloren – Zeige Typewriter erneut.");
        inspectionMode.classList.remove("active");

        setTimeout(() => {
            inspectionMode.style.display = "none";
            musicBtn.style.display = "flex"
            inspectionText.style.display = "inline-block";
            inspectionText.style.opacity = "1";
            typewriterActive = false;
            console.log("🔄 Typewriter zurückgesetzt.");
        }, 500);
    }

    // 🛠 Modell vom Tracking lösen (Inspection Mode aktiv)
    function detachModel() {
        if (!currentModel) return;

        console.log("🔓 Modell gelöst von Tracking!");
        isInspecting = true;
        inspectionMode.classList.add("locked");

        // Modell von der Tracking-Plane entfernen
        currentModel.removeAttribute("mindar-image-target");

        // Behalte die aktuelle Position und Rotation
        const pos = currentModel.getAttribute("position");
        const rot = currentModel.getAttribute("rotation");


        // Setze das Modell an eine feste Position
        currentModel.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
        currentModel.setAttribute("rotation", `${rot.x} ${rot.y} ${rot.z}`);


        enableSwipeRotation(currentModel);
        enablePinchZoom(currentModel); // 🔥 Zoom aktivieren
    }

    // ⏪ Modell zurücksetzen auf die Tracking-Plane
    function reattachModel() {
        if (!currentModel) return;
        
        console.log("🔒 Modell zurück auf Tracking!");
        isInspecting = false;
        inspectionMode.classList.remove("locked");
    
        // 🏷 Prüfen, ob das Modell eine gespeicherte Target-ID hat
        const targetIndex = currentModel.dataset.targetIndex;
        if (!targetIndex) {
            console.error("⚠️ Keine gespeicherte Target-ID gefunden! Tracking kann nicht wiederhergestellt werden.");
            return;
        }
    
        // 🔄 Tracking zurücksetzen
        currentModel.setAttribute("mindar-image-target", targetIndex);
    
        // ♻️ Position & Rotation zurücksetzen
        currentModel.setAttribute("position", "0 0 0");
        currentModel.setAttribute("rotation", "0 0 0");
        currentModel.setAttribute("scale", "0.1 0.1 0.1"); // Setzt Skalierung zurück
        currentModel.object3D.position.set(0, 0, 0);
        currentModel.object3D.rotation.set(0, 0, 0);

    
        console.log("✅ Modell wieder mit Tracking verbunden.");
        disablePinchZoom(); // ❌ Zoom deaktivieren


    
        document.removeEventListener("touchstart", onTouchStartRotate);
        document.removeEventListener("touchmove", onTouchMoveRotate);
        document.removeEventListener("touchend", onTouchEndRotate);
 
    }

    // 🎛️ Swipe-Gesten für Rotation aktivieren
    function enableSwipeRotation(model) {
        let startX = 0;
        let startY = 0;
        let currentRotationX = 0; // Aktuelle Rotation um die X-Achse
        let currentRotationY = 0; // Aktuelle Rotation um die Y-Achse
    
        function onTouchStartRotate(event) {
    if (event.touches.length > 1) return;
            startX = event.touches ? event.touches[0].clientX : event.clientX;
            startY = event.touches ? event.touches[0].clientY : event.clientY;
        }
    
        function onTouchMoveRotate(event) {
            if (!isInspecting || isZooming || zoomCooldown) return; // Falls gezoomt wird, keine Rotation
            
            let moveX = event.touches ? event.touches[0].clientX : event.clientX;
            let moveY = event.touches ? event.touches[0].clientY : event.clientY;
            
            let deltaX = ( moveX - startX) * 0.2; // Änderung der X-Koordinate
            let deltaY = (moveY - startY) * 0.2; // Änderung der Y-Koordinate
    
            currentRotationX += deltaY; // Inkrementiere die X-Rotation
            currentRotationY += deltaX; // Inkrementiere die Y-Rotation
    
            model.setAttribute("rotation", `${currentRotationX} ${currentRotationY} 0`); // Setze die neue Rotation des Modells

            
    
            startX = moveX;
            startY = moveY;


            //SOUND
            if (Math.abs(currentRotationX - lastRotationX) >= 5 || Math.abs(currentRotationY - lastRotationY) >= 5) {
                Haptics.rotationFeedback(); // Nur noch Sound, keine Vibration mehr
                lastRotationX = currentRotationX;
                lastRotationY = currentRotationY;
            }
        }

        function onTouchEndRotate(event) {
            if (event.touches.length === 0) {
                console.log("✅ Rotation wieder aktiviert.");
            }
        }
    
        document.addEventListener("touchstart", onTouchStartRotate);
        document.addEventListener("touchmove", onTouchMoveRotate);
        document.addEventListener("touchend", onTouchEndRotate);
    

    }

    // 📏 Pinch-Gesten für Zoom aktivieren

    // Funktion zur Distanzberechnung zwischen zwei Touchpunkten
function getDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// 🟢 Zoom-Handler-Funktionen
function onTouchStartZoom(event) {
    if (!isInspecting) return; // Zoom nur im Inspection Mode erlauben
    if (event.touches.length === 2) {
        startDistance = getDistance(event.touches[0], event.touches[1]);
        isZooming = true;
        console.log("👆 Zwei-Finger-Touch erkannt. Zoom beginnt.");
    }
}

function onTouchMoveZoom(event) {
    if (!isInspecting || event.touches.length !== 2) return;
    
    const moveDistance = getDistance(event.touches[0], event.touches[1]);
    let scaleFactor = moveDistance / startDistance;
    let scale = scaleFactor * baseScale.x;
    
    scale = Math.max(baseScale.x * 0.5, Math.min(baseScale.x * 3, scale));
    console.log("🔄 Neue Skalierung:", scale);
    
    currentModel.setAttribute("scale", `${scale} ${scale} ${scale}`);

//SOUND
    if (scale > currentScale) {
        Haptics.zoomInFeedback();
    } else if (scale < currentScale) {
        Haptics.zoomOutFeedback();
    }

currentScale = scale;

}

function onTouchEndZoom(event) {
    if (event.touches.length < 2) {
        isZooming = false;
        zoomCooldown = true;

        setTimeout(() =>{
            zoomCooldown = false;
            console.log("Rotation wieder fregegeben")

        }, 500 );

        console.log("✅ Zoom beendet.");
    }
}

// 🔄 Pinch-Zoom aktivieren (nur im Inspection Mode)
function enablePinchZoom(model) {
    let initialScale = model.getAttribute("scale"); 
    baseScale = { 
        x: parseFloat(initialScale.x), 
        y: parseFloat(initialScale.y), 
        z: parseFloat(initialScale.z) 
    };
    console.log("🔍 Pinch-Zoom aktiviert. Startskalierung:", baseScale);

    document.addEventListener("touchstart", onTouchStartZoom);
    document.addEventListener("touchmove", onTouchMoveZoom);
    document.addEventListener("touchend", onTouchEndZoom);
}
// ❌ Pinch-Zoom-Events entfernen (bei Beenden des Inspection Mode)
function disablePinchZoom() {
    document.removeEventListener("touchstart", onTouchStartZoom);
    document.removeEventListener("touchmove", onTouchMoveZoom);
    document.removeEventListener("touchend", onTouchEndZoom);
    console.log("❌ Pinch-Zoom deaktiviert.");
}






    // 🎛️ Event-Listener für den Toggle-Switch
    inspectionToggle.addEventListener("change", (event) => {
        if (event.target.checked) {
            Haptics.tapFeedback();
            detachModel();
        } else {
            reattachModel();
            Haptics.closeFeedback();
        }
    });

    // 🔍 Tracking-Events für A-Frame Modelle
    document.querySelectorAll("a-entity[mindar-image-target]").forEach(entity => {
        entity.addEventListener("targetFound", () => {
            Haptics.trackingSuccess();
            Haptics.showFeedback();
             console.log("🛑 EventListener erkannt: Target gefunden!");


            

            currentModel = entity.firstElementChild; // Speichert das erste Modell innerhalb der Tracking-Plane
            showInspectionMode();
            musicBtn.style.display = "none"
            //TITEL WIRD GEÄNDERT
             // 🔄 Titel aktualisieren, falls Modell erkannt wurde
    const targetIndex = entity.getAttribute("mindar-image-target").targetIndex;

    if (targetIndex !== null && targetIndex !== undefined) {
        const newTitle = modelNames[targetIndex] || "🔍 Unbekanntes Modell";
        console.log(`📢 Modell erkannt: Index ${targetIndex} → ${newTitle}`);
        if (titleElement) titleElement.textContent = newTitle;
    }

        });

        entity.addEventListener("targetLost", () => {
            Haptics.trackingLost();
            Haptics.abbruch2Feedback();
            console.log("🛑 EventListener erkannt: Target verloren!");
            hideInspectionMode();

            
       

            // 🔄 Standard-Titel zurücksetzen
            if (titleElement) {
                console.log("🔄 Tracker verloren. Setze Titel zurück.");
                titleElement.textContent = modelNames.default || "GATEWAY";
            }
        });
    });

    console.log("✅ DOM vollständig geladen!");
});