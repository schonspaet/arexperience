
document.addEventListener("DOMContentLoaded", () => {
  const reinitAnimation = document.getElementById("reinit-animation");

  if (reinitAnimation) {
    reinitAnimation.addEventListener("click", () => {
      Haptics.tapFeedback();
      console.log("🔄 Re-Initialize Button gedrückt! Seite wird neu geladen...");
      location.reload(); // 🔄 Seite neu laden
    });
  } else {
    console.warn("⚠ Re-Initialize Animation nicht gefunden!");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const reinitContainer = document.getElementById("reinit-animation");

  if (!reinitContainer) {
    console.warn("⚠ Re-Initialize Animation nicht gefunden!");
    return;
  }

  function createMiniScan(container, count, innerRadius, outerRadius) {
    for (let i = 0; i < count; i++) {
      let point = document.createElement("div");
      let angle = (i / count) * Math.PI * 2;
      let radius = innerRadius + Math.random() * (outerRadius - innerRadius); 
      let size = 1 + Math.random() * 1; // Kleinere Punkte

      point.classList.add("mini-point");
      point.style.width = `${size}px`;
      point.style.height = `${size}px`;

      let x = Math.cos(angle) * radius;
      let y = Math.sin(angle) * radius;

      point.style.left = `calc(50% + ${x}px)`;
      point.style.top = `calc(50% + ${y}px)`;

      container.appendChild(point);
    }
  }

  createMiniScan(reinitContainer, 40, 15, 18); // Innenradius 15px, Außenradius 20px (schmaler Ring)
});