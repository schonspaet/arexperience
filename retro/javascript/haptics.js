const Haptics = {
    playSound: (soundFile) => {
        const audio = new Audio(`./assets/sounds/${soundFile}`);
        audio.play().catch((error) => console.error("🔇 Fehler beim Abspielen des Sounds:", error));
    },

    tapFeedback: () => {
        Haptics.playSound("click.wav");
        console.log("Click");
    },
    closeFeedback:()=> {
        Haptics.playSound("close.wav");
        console.log("Close");
    },

    openFeedback:()=> {
        Haptics.playSound("open.wav");
        console.log("Open");
    },
    showFeedback:()=> {
        Haptics.playSound("show.wav");
        console.log("SHOW");
    },

    abbruch1Feedback:()=> {
        Haptics.playSound("abbruch1.wav");
        console.log("abbruch1");
    },
    abbruch2Feedback:()=> {
        Haptics.playSound("abbruch2.wav");
        console.log("abbruch2");
    },

    trackingSuccess: () => {
        Haptics.playSound("success.wav");
    },

    trackingLost: () => {
        Haptics.playSound("error.wav");
    },

    rotationFeedback: () => {
        Haptics.playSound("rotate.mp3");
    },

    zoomInFeedback: () => {
        Haptics.playSound("zoom.mp3");
    },

    zoomOutFeedback: () => {
        Haptics.playSound("zoom.mp3");
    },

    
    
};





function playSoundThenNavigate(targetURL) {
    const audio = new Audio("./assets/sound/click.wav");
    audio.play();
    
    setTimeout(() => {
        window.location.href = targetURL;
    }, 30000); // 300ms warten, damit der Sound hörbar ist
}

console.log("✅ Haptics.js (Sound aus assets/sound/) geladen!");