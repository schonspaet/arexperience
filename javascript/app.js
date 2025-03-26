document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM vollständig geladen!");

  // 🏷️ Elemente abrufen
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const scene = document.querySelector("a-scene");
  const reinitializeButton = document.getElementById("reinitialize");
  const audioOverlay = document.getElementById("audio-overlay");
  const closeOverlayBtn = document.getElementById("close-overlay");
  const overlay = document.getElementById("audio-overlay");
  const acceptButton = document.getElementById("accept-audio");
  const musicButton = document.getElementById("music-toggle");


  // 🛠 Fehler vermeiden: Prüfe, ob die Elemente existieren, bevor du auf ihre Eigenschaften zugreifst
  if (!scene) {
      console.warn("⚠ `a-scene` nicht gefunden!");
  }
  if (!header) {
      console.warn("⚠ `header` nicht gefunden!");
  }
  if (!footer) {
      console.warn("⚠ `footer` nicht gefunden!");
  }

  // 📌 Header-Interaktionen
  if (header && scene) {
      header.addEventListener("mouseover", () => {
          scene.style.pointerEvents = "none";
      });
      header.addEventListener("mouseout", () => {
          scene.style.pointerEvents = "auto";
      });
  }

  // 📌 Footer-Interaktionen
  if (footer && scene) {
      footer.addEventListener("mouseover", () => {
          scene.style.pointerEvents = "none";
      });
      footer.addEventListener("mouseout", () => {
          scene.style.pointerEvents = "auto";
      });
  }

  // 🔄 Re-Initialize Button mit Sound
  if (reinitializeButton) {
      reinitializeButton.addEventListener("click", () => {
        const audio = new Audio("./assets/sounds/click.mp3");
        Haptics.tapFeedback();
          console.log("🔄 Re-Initialize wird ausgeführt...");



          audio.play().then(() => {
              setTimeout(() => {
                  window.location.reload();
              }, 3000);
          }).catch(error => {
              console.warn("🔊 Sound konnte nicht abgespielt werden:", error);
              window.location.reload();
          });
      });
  } else {
      console.warn("⚠ `reinitialize` Button nicht gefunden!");
  }

  // 🎭 Audio-Overlay verwalten (einmalig)
if (overlay && acceptButton && closeOverlayBtn) {
    const overlaySeen = localStorage.getItem("audioOverlaySeen");
    Haptics.showFeedback();
    if (!overlaySeen) {
      overlay.style.display = "flex";
      overlay.classList.remove("hide");
      closeOverlayBtn.style.display = "block";
      acceptButton.style.display = "none";

      console.log("🔊 Zeige Audio-Overlay");
  
      // 🎧 Akzeptieren
      acceptButton.addEventListener("click", () => {
        overlay.classList.add("hide");
        overlay.style.display = "none";
        closeOverlayBtn.style.display = "none";
        audioOverlay.style.display = "none"
        localStorage.setItem("audioOverlaySeen", "true");
  
        if (!BackgroundMusic.isPlaying) BackgroundMusic.play();
  
        console.log("🎧 Audio aktiviert & Overlay dauerhaft deaktiviert");
      });
  
      // ❌ Schließen (ohne Musik)
      closeOverlayBtn.addEventListener("click", () => {
        Haptics.tapFeedback();
        overlay.classList.add("hide");
        overlay.style.display = "none";
        closeOverlayBtn.style.display = "none";
        localStorage.setItem("audioOverlaySeen", "true");
        console.log("🔇 Overlay manuell geschlossen & deaktiviert");
        BackgroundMusic.play();
      });
  
    
    } else {
      overlay.style.display = "none";
      overlay.classList.add("hide");
      closeOverlayBtn.style.display = "none";
      console.log("🔕 Overlay wurde bereits gesehen – wird nicht erneut angezeigt");
    }
  }
});





