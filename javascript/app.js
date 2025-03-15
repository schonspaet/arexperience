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
          console.log("🔄 Re-Initialize wird ausgeführt...");
          Haptics.tapFeedback();
          const audio = new Audio("./assets/sounds/click.wav");

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

  // 🎭 Audio-Overlay verwalten
  if (overlay && acceptButton) {
      if (!localStorage.getItem("audioOverlaySeen")) {
          overlay.style.display = "flex";
      }

      acceptButton.addEventListener("click", () => {
          overlay.style.display = "none";
          localStorage.setItem("audioOverlaySeen", "true");

          if (!BackgroundMusic.isPlaying) {
              BackgroundMusic.play();
          }
      });

      setTimeout(() => {
          overlay.style.display = "none";
          localStorage.setItem("audioOverlaySeen", "true");
      }, 10000);
  } else {
      console.warn("⚠ Audio-Overlay oder Accept-Button nicht gefunden!");
  }

  // 🎛 Schließen des Overlays
  if (audioOverlay && closeOverlayBtn) {
      console.log("🎭 Overlay gefunden! Erzwinge Anzeige...");
      audioOverlay.classList.remove("hide");
      Haptics.showFeedback();

      closeOverlayBtn.addEventListener("click", () => {
          Haptics.tapFeedback();
          BackgroundMusic.play();
          console.log("🔇 Overlay wird geschlossen...");
          audioOverlay.classList.add("hide");

          setTimeout(() => {
              audioOverlay.style.display = "none";
              closeOverlayBtn.style.display = "none";
              console.log("✅ Overlay erfolgreich entfernt!");
          }, 300);
      });
  } else {
      console.error("❌ FEHLER: Audio-Overlay oder Schließen-Button wurde nicht gefunden!");
  }
});