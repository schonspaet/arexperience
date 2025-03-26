const Haptics = {
    sounds: {},
    volume: 0.6, // Globale Lautstärke

    soundFiles: {
        tap: "click.mp3",
        close: "close.mp3",
        open: "open.mp3",
        show: "show.mp3",
        abbruch1: "abbruch1.mp3",
        abbruch2: "abbruch2.mp3",
        success: "success.mp3",
        error: "error.mp3",
    },

    init: function () {
        // 🏗️ Lade und speichere Sounds (Sound-Pool)
        for (const key in this.soundFiles) {
            this.sounds[key] = new Audio(`./assets/sounds/${this.soundFiles[key]}`);
            this.sounds[key].volume = this.volume;
        }
        console.log("✅ Haptics Sound-Pool geladen!");
    },

    playSound: function (key) {
        if (this.sounds[key]) {
            this.sounds[key].currentTime = 0; // Zurücksetzen für sofortiges Abspielen
            this.sounds[key].play().catch((error) => console.error(`🔇 Fehler beim Abspielen (${key}):`, error));
        } else {
            console.warn(`⚠️ Sound '${key}' nicht gefunden!`);
        }
    },

    tapFeedback: () => Haptics.playSound("tap"),
    closeFeedback: () => Haptics.playSound("close"),
    openFeedback: () => Haptics.playSound("open"),
    showFeedback: () => Haptics.playSound("show"),
    abbruch1Feedback: () => Haptics.playSound("abbruch1"),
    abbruch2Feedback: () => Haptics.playSound("abbruch2"),
    trackingSuccess: () => Haptics.playSound("success"),
    trackingLost: () => Haptics.playSound("error"),
    rotationFeedback: () => Haptics.playSound("rotate"),
    zoomInFeedback: () => Haptics.playSound("zoom"),
    zoomOutFeedback: () => Haptics.playSound("zoom")
};

// 🎵 Play Sound and Navigate
function playSoundThenNavigate(targetURL) {
    Haptics.tapFeedback();
    setTimeout(() => {
        window.location.href = targetURL;
    }, 100); // 100ms warten für hörbare Ausgabe
}

// 🚀 Initialisieren, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    Haptics.init();
});