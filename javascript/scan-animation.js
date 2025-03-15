document.addEventListener("DOMContentLoaded", () => {
  const scannerContainer = document.querySelector(".scanner-container");
  const errorOverlay = document.getElementById("error-overlay");
  const simulateErrorButton = document.getElementById("simulate-error");

  // **Prüfen, ob die Elemente auf der Seite existieren**
  if (!scannerContainer) {
      console.warn("⚠ Scanner-Container nicht gefunden! Wird übersprungen.");
      return;
  }

  if (!errorOverlay) {
      console.warn("⚠ Error-Overlay nicht gefunden! Fehlerüberwachung wird übersprungen.");
  }

  /** 🔍 Überprüft den Status des Error-Overlays */
  function checkErrorOverlay() {
      if (errorOverlay && !errorOverlay.classList.contains("hidden")) {
          console.log("🚨 ERROR aktiv – Scanner-Animation ausblenden!");
          scannerContainer.style.display = "none";
      } else {
          console.log("✅ ERROR verschwunden – Scanner-Animation kann zurückkommen!");
          scannerContainer.style.display = "flex";
      }
  }

  // **Nur starten, wenn Error-Overlay existiert**
  if (errorOverlay) {
      new MutationObserver(checkErrorOverlay).observe(errorOverlay, { attributes: true, attributeFilter: ["class"] });
      checkErrorOverlay(); // Direkt beim Laden prüfen
  }

  /** 🛠 TEST: Fehler simulieren */
  if (simulateErrorButton) {
      simulateErrorButton.addEventListener("click", () => {
          if (errorOverlay.classList.contains("hidden")) {
              console.log("🔴 Simulierter Fehler: Overlay wird angezeigt!");
              errorOverlay.classList.remove("hidden");
          } else {
              console.log("🟢 Simulierter Fehler behoben!");
              errorOverlay.classList.add("hidden");
          }
      });
  }

  /** 📸 Tracking überwachen */
  document.querySelectorAll("a-entity[mindar-image-target]").forEach(entity => {
      entity.addEventListener("targetFound", () => {
        Haptics.trackingSuccess();
        Haptics.showFeedback();
          console.log("📸 Tracking erkannt!");
          scannerContainer.style.display = "none";
      });

      entity.addEventListener("targetLost", () => {
        Haptics.trackingLost();
        Haptics.abbruch2Feedback();
          console.log("🔍 Tracking verloren!");
          scannerContainer.style.display = "flex";

      });
  });

  /** 🌌 PORTAL-EFFEKTE (Punkte & Schweife) */
  const pointRing = document.getElementById("pointRing");
  const trailRing = document.getElementById("trailRing");

  if (pointRing && trailRing) {
      function createPoints(container, count, maxRadius) {
          for (let i = 0; i < count; i++) {
              let point = document.createElement("div");
              let angle = (i / count) * Math.PI * 2;
              let radius = maxRadius * (0.7 + Math.random() * 0.3);
              let size = 3 + Math.random() * 3;

              point.classList.add("point");
              point.style.width = `${size}px`;
              point.style.height = `${size}px`;
              point.style.setProperty('--pulse-duration', `${(Math.random() * 2 + 1).toFixed(1)}s`);
              point.style.setProperty('--oscillation-speed', `${(1.5 + Math.random() * 1.5).toFixed(1)}s`);

              point.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
              point.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;

              container.appendChild(point);
          }
      }

      function createTrailRing(container, count, maxRadius) {
          for (let i = 0; i < count * 2; i++) {
              let trailPoint = document.createElement("div");
              let trail = document.createElement("div");
              let angle = (i / (count * 2)) * Math.PI * 2;
              let radius = maxRadius * (0.60 + Math.random() * 0.30);
              let size = 2 + Math.random() * 1;
              let trailLength = size * 6;

              trailPoint.classList.add("trail-point");
              trailPoint.style.setProperty('--oscillation-speed-fast', `${(0.8 + Math.random() * 0.8).toFixed(1)}s`);
              trail.classList.add("trail");
              trail.style.width = `${trailLength}px`;
              trail.style.height = `${size}px`;
              trail.style.transform = `rotate(${angle * (180 / Math.PI)}deg) translateX(${size}px)`;

              trailPoint.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
              trailPoint.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;

              trailPoint.appendChild(trail);
              container.appendChild(trailPoint);
          }
      }

      createPoints(pointRing, 150, 130);
      createTrailRing(trailRing, 60, 165);
  }
});