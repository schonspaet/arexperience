const BackgroundMusic = (() => {
    let audioCtx;
    let gainNode;
    let audioBuffer;
    let isPlaying = false;
    let isBlocked = false;

    const init = async () => {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 1; // 🎵 Standard-Lautstärke

            // Lade den Sound über Fetch (besser als <audio>)
            const response = await fetch("./assets/sounds/background2.mp3");
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

            if (localStorage.getItem("bgMusicPlaying") === "true") {
                setTimeout(() => play(), 1000); // 🔄 Verzögerung für bessere Performance
            }
        } catch (error) {
            console.warn("🔇 Fehler beim Laden der Musik:", error);
            isBlocked = true;
        }
    };

    const createSource = () => {
        const audioSource = audioCtx.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.loop = true;
        audioSource.connect(gainNode).connect(audioCtx.destination);
        return audioSource;
    };

    let currentSource = null; // Speichert die aktuell laufende Audio-Quelle

    const play = () => {
        if (isBlocked || !audioCtx || isPlaying) return;
        
        audioCtx.resume().then(() => {
            if (currentSource) {
                currentSource.stop(); // Beendet vorherige Quelle (falls nötig)
            }
            currentSource = createSource(); // Erstellt eine neue Audio-Quelle
            currentSource.start(0);
            isPlaying = true;
            localStorage.setItem("bgMusicPlaying", "true");
            console.log("🎵 Hintergrundmusik gestartet.");
        }).catch((error) => console.warn("🔇 Autoplay blockiert!", error));
    };

    const pause = () => {
        if (!isPlaying || !currentSource) return;
        currentSource.stop(); // Stoppt die aktuelle Audio-Quelle
        currentSource = null;
        isPlaying = false;
        localStorage.setItem("bgMusicPlaying", "false");
        console.log("⏸ Hintergrundmusik pausiert.");
    };

    const toggle = () => {
        if (isPlaying) {
            pause();
            isPlaying = false; // 🔄 Setze isPlaying explizit auf false
            Haptics.closeFeedback();
        } else {
            Haptics.tapFeedback();
            play();
            isPlaying = true; // 🔄 Setze isPlaying explizit auf true
           
        }
    
        updateSpeakerIcon(); // 🔄 Icon aktualisieren
    };

    const updateSpeakerIcon = () => {
        const speakerIcon = document.getElementById("speaker-icon"); // Hier sicherstellen, dass das Element existiert
    
        if (!speakerIcon) {
            console.error("⚠️ Fehler: Element #speaker-icon wurde nicht gefunden!");
            return;
        }
    
        console.log(`🔄 Icon-Wechsel: ${isPlaying ? "ON" : "OFF"}`);
        speakerIcon.src = isPlaying ? "./assets/images/speaker_on.webp" : "./assets/images/speaker_off.webp";
    };

    return { init, play, pause, toggle };
})();

// 🎛 Event-Listener für den Button
document.addEventListener("DOMContentLoaded", () => {
    BackgroundMusic.init();

    const musicToggleBtn = document.getElementById("music-toggle");
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener("click", () => {
            BackgroundMusic.toggle();
        });
    }
});
