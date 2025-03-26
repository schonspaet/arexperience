

document.addEventListener("DOMContentLoaded", () => {
    const inspectionText = document.getElementById("inspection-text");
    const inspectionMode = document.getElementById("inspection-mode");
    const inspectionToggle = document.getElementById("toggle-inspection");
    const citiesContainer = document.getElementById("cities-container");
    const cityToggle = document.getElementById("toggle-city");
    const cityModel = document.getElementById("city-model");
    const scannerContainer = document.querySelector(".scanner-container");

    const infoButton = document.getElementById("info-button");
    const tradeOff = document.getElementById("nineButtons-container1");

    const columns = document.querySelectorAll("[class^='column']");
  const buttonWerte = {}; // Speichert aktuelle Werte pro Kategorie


    const body = document.body;



    const musicBtn = document.getElementById("music-toggle");

    const tryOnButton = document.getElementById("try-on-button");

    const titleElement = document.getElementById("title"); // Der Titel in der HTML
    let modelNames = {}; // Hier speichern wir die Namen der Modelle



    
    columns.forEach((column, index) => {
        const buttons = column.querySelectorAll("button");
      
        buttons.forEach(button => {
          button.addEventListener("click", () => {
            // Deselect alle Buttons in dieser Kategorie
            buttons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            Haptics.tapFeedback();
      
            // Wert aus data-wert lesen
            const wert = parseInt(button.getAttribute("data-wert"));
            const kategorie = `column${index + 1}`;
            buttonWerte[kategorie] = wert;
      
            // 🔁 Wenn erste Eingabe, verstecke den Start-Planet
            if (!firstInputDone && (targetIndex === "3" || targetIndex === 3)) {
              firstInputDone = true;
      
              const planetModel = document.getElementById("planet-model");
              if (planetModel) {
                planetModel.setAttribute("visible", "false");
                console.log("🌀 Erste Auswahl – 'normaler Planet' ausgeblendet.");
              }
            }
      
            // Score und Modell aktualisieren
            updateScore();
          });
        });
      });

    
    // JSON-Daten für Modellnamen laden
    document.getElementById("info-button").addEventListener("click", () => {
        // 🛠 Stelle sicher, dass der aktuellste `targetIndex` geladen wird
        let currentTargetIndex = targetIndex;
        console.log(`ℹ️ Info-Button geklickt – aktueller targetIndex: ${currentTargetIndex}`);
    
        fetch("arexperience/JSON/info.json")
            .then((response) => response.json())
            .then((data) => {
                let info = data[currentTargetIndex] || data["default"]; // Lädt die aktuellen Infos
                document.getElementById("info-title").textContent = info.title;
                document.getElementById("info-text").textContent = info.description;
                document.getElementById("info-overlay").classList.add("active"); // Zeigt das Info-Overlay
                console.log(`✅ Info geladen für Index ${currentTargetIndex}:`, info);
            })
            .catch((error) => {
                console.error("❌ Fehler beim Laden der Informationen:", error);
                document.getElementById("info-title").textContent = "Fehler";
                document.getElementById("info-text").textContent =
                    "Es ist ein Fehler aufgetreten. Informationen konnten nicht geladen werden.";
                document.getElementById("info-overlay").classList.add("active");
            });
    });
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
    let firstInputDone = false; // Steuert, ob der Startplanet schon ersetzt wurde


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







 // CITY PLANE

    //City Plan Anzeigen

    function showCityContainer() {
        console.log("📸 Target gefunden: Zeige City Plane!");

        setTimeout(() => {

            citiesContainer.classList.add("active");
            citiesContainer.style.display = "block";
            console.log("✅ City Plane sichtbar.");
        }, 500);
    }

    // ⏪ Inspection Mode ausblenden (wenn Target verloren)
    function hideCityContainer() {
        if (isInspecting) return; // Wenn der Inspection Mode aktiv ist, nicht ausblenden!
        console.log("🔍 Target verloren – Schlie0e City Plane");
        citiesContainer.classList.remove("active");

        setTimeout(() => {
            citiesContainer.style.display = "none";
        }, 500);
    }
 



 // INSPECTION MODE

 //Inspection Anzeigen
 function showInspectionMode() {
    console.log("📸 Target gefunden – Zeige Inspection Mode!");
    inspectionText.style.opacity = "0"; 
    musicBtn.style.display = "none";
    setTimeout(() => {
        inspectionText.style.display = "none";
        inspectionMode.classList.add("active");
        inspectionMode.style.display = "flex";
        console.log("✅ Inspection Mode sichtbar.");
    }, 500);
}

//Insepction Ausblenden
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
        currentModel.setAttribute("scale", "1 1 1"); // Setzt Skalierung zurück
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
    
            model.setAttribute("rotation", `${currentRotationX} ${currentRotationY} 0`); // Setze die neue Rotation des Modells (x,y,z)

            
    
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
            musicBtn.style.display = "none";
            scannerContainer.style.display = "none";

            infoButton.style.boxShadow = "inset 0 0 10px rgba(132, 0, 255, 0.3), 0 0 10px rgba(132, 0, 255, 0.4)";      
            infoButton.style.border = "1px solid rgba(155, 111, 255, 0.5  )";  

        
            // 🏷 Target Index vor der ersten Nutzung deklarieren & setzen
            targetIndex = entity.getAttribute("mindar-image-target").targetIndex;
        
        
            

             // 🎭 "Try On"-Button nur anzeigen, wenn targetIndex === 6
             if (targetIndex === 3) {
                tradeOff.style.display = "block"; // TRADE OFF EINBLENDEN
                console.log("TRADE OFF ANGEZEIGT");
            } else {

                tradeOff.style.display = "none";  // TRADE OFF AUSBLENDEN
            }  

            // 🎭 "Try On"-Button nur anzeigen, wenn targetIndex === 6
            if (targetIndex === 6) {
                tryOnButton.style.display = "block"; // Button sichtbar machen
                console.log("✅ 'Try On'-Button aktiviert für Index 6");
            } else {

                tryOnButton.style.display = "none"; // Button verstecken
            }  

            //CITY MODELLE
            if (targetIndex === 8 || targetIndex === 9) {
               showCityContainer();
            } else {
                hideCityContainer();
            }
            // 🖼️ HINTERGRUNDBILD für Index 10 ausblenden
            if (targetIndex === 10) {
            document.body.classList.add("hide-background");
            console.log("🕳️ Hintergrundbild für Index 10 ausgeblendet");
            } else {
            document.body.classList.remove("hide-background");
            }
        
            updateTitle(targetIndex);
            musicBtn.style.display = "none";
        });





        entity.addEventListener("targetLost", () => {
            Haptics.trackingLost();
            Haptics.abbruch2Feedback();
            document.body.classList.remove("hide-background");
            
            console.log("🛑 EventListener erkannt: Target verloren!");
            inspectionToggle.checked = false;
            isInspecting = false;
            hideCityContainer();
            hideInspectionMode();
            targetIndex = null;

            tradeOff.style.display = "none";
            tryOnButton.style.display = "none"; // Button verstecken
            scannerContainer.style.display = "flex";

            infoButton.style.boxShadow = "inset 0 0 20px rgba(255, 255, 255, 0.3), 0 0 10px rgba(70, 70, 70, 0.1)";      
            infoButton.style.border = "1px solid rgba(255, 255, 255, 0.5  )";  

         

       

// Lösche unnötige Texturen aus WebGL-Cache
if (currentModel?.object3D) {
    currentModel.object3D.traverse((child) => {
        if (child.material) {
            if (child.material.map) child.material.map.dispose();
            if (child.material.lightMap) child.material.lightMap.dispose();
            if (child.material.aoMap) child.material.aoMap.dispose();
            if (child.material.emissiveMap) child.material.emissiveMap.dispose();
            if (child.material.bumpMap) child.material.bumpMap.dispose();
            if (child.material.normalMap) child.material.normalMap.dispose();
            if (child.material.displacementMap) child.material.displacementMap.dispose();
            if (child.material.roughnessMap) child.material.roughnessMap.dispose();
            if (child.material.metalnessMap) child.material.metalnessMap.dispose();
            if (child.material.alphaMap) child.material.alphaMap.dispose();
            if (child.material.envMap) child.material.envMap.dispose();
            child.material.dispose();
        }
        if (child.geometry) {
            child.geometry.dispose();
        }
    });

}
            // 🔄 Standard-Titel zurücksetzen
            if (titleElement) {
                console.log("🔄 Tracker verloren. Setze Titel zurück.");
                titleElement.textContent = modelNames.default || "GATEWAY";
            }
            
        });
    });

    console.log("✅ DOM vollständig geladen!");




    




    //  Event-Listener für den CITY PLANE TOGGLE-Switch
   cityToggle.addEventListener("change", (event) => {
    if (event.target.checked) {
        Haptics.tapFeedback();
            //hier code
            switchCity("#solar"); 
        targetIndex = 9;
       
    } else {
        //hier code
        Haptics.closeFeedback();
        
            switchCity("#cyber");

targetIndex = 8;
    }
    console.log(`✅ targetIndex aktualisiert: ${targetIndex}`);
    updateTitle(targetIndex);
});

let currentModelIndex = "8"; // Standardmäßig "Cyberpunk City"

function switchCity(cityId) {
    console.log(`🔄 Wechsle zu ${cityId}`);

    cityModel.setAttribute("gltf-model", cityId);

    // 🟢 `targetIndex` automatisch aus der Modell-ID setzen
    currentModelIndex = (cityId === "#solar") ? "9" : "8";
    console.log(`✅ currentModelIndex aktualisiert: ${currentModelIndex}`);
}


function updateTitle(targetIndex) {
    if (targetIndex !== null && targetIndex !== undefined) {
        // 🔄 Prüfen, ob `models.json` geladen wurde
        if (!modelNames || Object.keys(modelNames).length === 0) {
            console.warn(`⚠️ Modellnamen sind noch nicht geladen! Warte auf JSON-Daten.`);
            return; // Verhindert das Setzen eines falschen Titels
        }

        // 🔄 Prüfen, ob `targetIndex` existiert
        if (!modelNames[targetIndex]) {
            console.warn(`⚠️ Kein Titel für Index ${targetIndex} gefunden! Verwende Standard.`);
        }

        const newTitle = modelNames[targetIndex] || "🔍 Unbekanntes Modell";
        console.log(`📢 Titel aktualisiert: Index ${targetIndex} → ${newTitle}`);

        if (titleElement) {
            titleElement.textContent = newTitle;
        }
    }
}



//BERECHNUNG FÜR PLANET
function updateScore() {
    const werte = Object.values(buttonWerte);
    const score = werte.reduce((sum, val) => sum + val, 0);
  
    let modelId = "#krank"; // Default fallback
    if (score >= 4) {
      modelId = "#gesund";
    } else if (score >= -2) {
      modelId = "#krank";
    } else {
      modelId = "#zerstoert";
    }
  
    // Nur wenn Target 3 aktiv ist
    if (targetIndex === "3" || targetIndex === 3) {
      const planetModel = document.getElementById("planet-model");
      if (planetModel) {
        planetModel.setAttribute("gltf-model", modelId);
        planetModel.setAttribute("visible", "true");
        console.log("🌍 Modell aktualisiert auf:", modelId);
      }
    }
  }

});


   