const BackgroundMusic = {
    audio: new Audio("./assets/sounds/background2.wav"),
    isPlaying: false,

    init: function () {
        this.audio.loop = true;
        this.audio.volume = 1; // Lautstärke anpassen (optional)

        // 🔄 Prüfen, ob Musik an war (beim Seitenwechsel)
        const wasPlaying = localStorage.getItem("bgMusicPlaying");
        if (wasPlaying === "true") {
            this.play();
        }
    },

    play: function () {
        this.audio.play().then(() => {
            this.isPlaying = true;
            localStorage.setItem("bgMusicPlaying", "true");
            console.log("🎵 Hintergrundmusik gestartet.");

        }).catch((error) => {
            console.warn("🔇 Autoplay blockiert!", error);
        });
    },

    pause: function () {
        this.audio.pause();
        this.isPlaying = false;
        localStorage.setItem("bgMusicPlaying", "false");
        console.log("⏸ Hintergrundmusik pausiert.");
    },

    toggle: function () {
        if (this.isPlaying) {
            this.pause();
            Haptics.closeFeedback();
        } else {
            this.play();
            Haptics.tapFeedback();
        }
    }
};

// Starte die Musikprüfung beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
    BackgroundMusic.init();
});