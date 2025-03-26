document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {

        const maske1Button = document.getElementById("maske1-button");
        const maske2Button = document.getElementById("maske2-button");
        const faceModel = document.getElementById("face-model");
        const titleElement = document.getElementById("title"); // Der Titel in der HTML// Der Titel in der HTML

        const infoButton = document.getElementById("info-button");
        const endButton = document.getElementById("end-try-on-button");



        console.log("🔍 DOM vollständig geladen!");

        if (!faceModel || !maske1Button || !maske2Button || !titleElement) {
            console.error("❌ Fehler: Ein oder mehrere Elemente wurden nicht gefunden!");
            return;
        }

        console.log("✅ Alle benötigten Elemente gefunden!");

       
        




        // 🛠 Individuelle Einstellungen für jede Maske (Position, Skalierung, Rotation, Titel)
        const maskSettings = {
            "#maske1": { position: "0 -0.1 -0.6", scale: "5.5 5.5 5.5", rotation: "0 0 0", name: "> UTOPIAN" },
            "#maske2": { position: "0 -0.1.2 -0.6", scale: "5.5 5.5 5.5", rotation: "0 0 0", name: "> DYSTOPIAN" }
        };

        function cleanupOldModel(model) {
            if (!model || !model.object3D) return;
        
            model.object3D.traverse((child) => {
                if (child.material) {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
                if (child.geometry) {
                    child.geometry.dispose();
                }
            });
        
            console.log("🧹 Modellressourcen freigegeben");
        }


        function switchMask(maskId) {
            cleanupOldModel(faceModel);

            console.log(`🔄 Wechsle zu ${maskSettings[maskId].name}`);

            faceModel.setAttribute("gltf-model", maskId);
            faceModel.setAttribute("position", maskSettings[maskId].position);
            faceModel.setAttribute("scale", maskSettings[maskId].scale);
            faceModel.setAttribute("rotation", maskSettings[maskId].rotation);

            // 🔥 Titel ändern
            titleElement.textContent = maskSettings[maskId].name;

            console.log(`✅ ${maskSettings[maskId].name} aktiviert!`);
        }

        // Standardmäßig Maske 1 setzen
        switchMask("#maske1");
        infoButton.style.boxShadow = "inset 0 0 10px rgba(132, 0, 255, 0.3), 0 0 10px rgba(132, 0, 255, 0.4)";      
        infoButton.style.border = "1px solid rgba(155, 111, 255, 0.5  )";  



        // Event-Listener für Maske 1
        maske1Button.addEventListener("click", () => {
            switchMask("#maske1");
            infoButton.style.boxShadow = "inset 0 0 10px rgba(132, 0, 255, 0.3), 0 0 10px rgba(132, 0, 255, 0.4)";      
            infoButton.style.border = "1px solid rgba(155, 111, 255, 0.5  )";  
            Haptics.tapFeedback();

        });

        // Event-Listener für Maske 2
        maske2Button.addEventListener("click", () => {
            switchMask("#maske2");
            infoButton.style.boxShadow = "inset 0 0 10px rgba(132, 0, 255, 0.3), 0 0 10px rgba(132, 0, 255, 0.4)";      
            infoButton.style.border = "1px solid rgba(155, 111, 255, 0.5  )";  
            Haptics.tapFeedback();

        });
        

        console.log("✅ Try-On-Script erfolgreich geladen!");
    }, 500);
});

    
document.addEventListener("DOMContentLoaded", () => {
    let currentMaskIndex = "6"; // Standardmäßig Maske 1 (Index 6)

    // 🖱 Info-Button: Daten aus `info.json` laden und anzeigen
    document.getElementById("info-button").addEventListener("click", () => {
        fetch("./JSON/info.json")
            .then((response) => response.json())
            .then((data) => {
                let info = data[currentMaskIndex] || data["default"]; // Fallback auf Standard-Text
                document.getElementById("info-title").textContent = info.title;
                document.getElementById("info-text").textContent = info.description;
                document.getElementById("info-overlay").classList.add("active"); // Zeigt das Info-Overlay
                console.log(`ℹ️ Info geladen für Maske ${currentMaskIndex}:`, info);
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
        console.log("INFO OVERLAY GESCHLOSSEN");
        document.getElementById("info-overlay").classList.remove("active");
        infoButton.style.boxShadow = "inset 0 0 20px rgba(255, 255, 255, 0.3), 0 0 10px rgba(70, 70, 70, 0.1)";      
        infoButton.style.border = "1px solid rgba(255, 255, 255, 0.5  )";  

    });

    // 🏷️ Aktualisiert `currentMaskIndex`, wenn die Maske gewechselt wird
    document.getElementById("maske1-button").addEventListener("click", () => {
        currentMaskIndex = "6"; // Index für Maske 1
        console.log("🎭 Maske 1 ausgewählt → Info-Index 6");
    });

    document.getElementById("maske2-button").addEventListener("click", () => {
        currentMaskIndex = "7"; // Index für Maske 2
        console.log("🎭 Maske 2 ausgewählt → Info-Index 7");
    });
});



//TYPEWRITER
document.addEventListener("DOMContentLoaded", () => {
    const inspectionText = document.getElementById("inspection-text");

    if (inspectionText) {
        console.log("⌨️ Typewriter-Effekt wird gestartet für 'inspection-text'");

        function typeWriterEffect(element, text, speed, delay) {
            let i = 0;
            element.textContent = ""; // Startet mit leerem Text

            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    setTimeout(() => {
                        element.textContent = "";
                        i = 0;
                        type();
                    }, delay); // Wiederholt sich nach Verzögerung
                }
            }
            type();
        }

        // Starte den Typewriter-Effekt mit gewünschtem Text
        typeWriterEffect(inspectionText, "virtual try on", 100, 1000);
    } else {
        console.warn("❌ 'inspection-text' nicht gefunden! Typewriter kann nicht gestartet werden.");
    }
});