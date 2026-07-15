// ==========================================================
// 🌸 MAGICAL SMILE BOX ENGINE
// ==========================================================

let sbVisits = 0;
try {
    const stored = localStorage.getItem('smileBoxVisits');
    sbVisits = stored ? parseInt(stored) : 0;
    if (isNaN(sbVisits)) sbVisits = 0;
} catch(e) {}

let currentSbTheme = 'neutral';
let currentTrack = null;

// --- Cinematic Audio Engine ---
window.crossfade = function(newTrackId, targetVolume = 0.3) {
    const newTrack = document.getElementById(newTrackId);
    if (!newTrack) return;

    document.querySelectorAll('audio').forEach(audio => {
        if (audio !== newTrack && !audio.paused && audio.id !== 'sfx-rain') {
            if (audio.id === 'bg-dashboard') {
                const playerUI = document.getElementById('cassette-player');
                if (playerUI) playerUI.classList.remove('playing');
                if (typeof window.isPlaying !== 'undefined') window.isPlaying = false;
            }
            let fadeOut = setInterval(() => {
                if (audio.volume > 0.02) {
                    audio.volume = Math.max(audio.volume - 0.02, 0);
                } else {
                    audio.pause();
                    audio.volume = 0;
                    clearInterval(fadeOut);
                }
            }, 100);
        }
    });

    currentTrack = newTrack;

    if (newTrack.paused) {
        newTrack.volume = 0;
        newTrack.play().catch(e => console.log("Audio block:", e));
    }
    
    let fadeIn = setInterval(() => {
        if (newTrack.volume < targetVolume) {
            newTrack.volume = Math.min(newTrack.volume + 0.02, targetVolume);
        } else {
            clearInterval(fadeIn);
        }
    }, 100);
};

window.stopAllMusic = function() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.volume = 0;
    });
    const playerUI = document.getElementById('cassette-player');
    if (playerUI) playerUI.classList.remove('playing');
    window.isPlaying = false;
};

// --- Styles (Centered & Straight) ---
const sbStyles = document.createElement('style');
sbStyles.innerHTML = `
    #sb-overlay {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 10, 25, 0.7); backdrop-filter: blur(8px);
        display: none; flex-direction: column; justify-content: center; align-items: center; z-index: 4000;
        opacity: 0; transition: opacity 1.5s ease; overflow: hidden; cursor: pointer;
    }
    #sb-journal-zone { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 450px; z-index: 5; cursor: default; }
    .journal-page {
        position: absolute; top: 40%; left: 50%; width: 100%; background: #FFFDF9; border-radius: 15px;
        padding: 40px 30px; box-sizing: border-box; box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        transform: translate(-50%, -50%); opacity: 0; transition: all 0.8s ease; display: flex; flex-direction: column;
    }
    .journal-page.active { opacity: 1; }
    .j-greeting { font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: #5E4B7D; margin-bottom: 10px; text-align: center; }
    .j-text { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #4B4453; line-height: 1.8; margin-bottom: 30px; white-space: pre-wrap; }
    .magic-tag { display: flex; align-items: center; gap: 15px; background: linear-gradient(to right, #FCF8FF, #FFFDFB); border: 1px solid rgba(200, 180, 220, 0.3); border-radius: 20px; padding: 10px 20px; font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 700; color: #5E4B7D; cursor: pointer; margin-bottom: 10px; }
`;
document.head.appendChild(sbStyles);

// --- Story & Injection ---
const sbStory = {
    'start': { greeting: "✨ The Smile Box", text: "Hey, pretty girl. I was hoping you'd stop by today.", buttons: [{ icon: "✨", text: "Let's Talk", action: "q_feeling" }] },
    'q_feeling': { greeting: "How are you really feeling?", text: "I'm here to listen.", buttons: [ { icon: "🌸", text: "I'm happy.", action: "end" }, { icon: "🌤", text: "I'm okay.", action: "end" } ] },
    'end': { greeting: "🤍", text: "I'm so glad you're here.", buttons: [] }
};

window.injectSmileBox = function() {
    if(!document.getElementById('sb-overlay')) {
        const html = `<div id="sb-overlay"><div id="sb-journal-zone"></div></div>`;
        document.body.insertAdjacentHTML('beforeend', html);
    }
};
window.injectSmileBox();

window.startSmileBox = function() {
    const overlay = document.getElementById('sb-overlay');
    const dash = document.getElementById('main-dashboard');
    if(window.crossfade) window.crossfade('bg-smilebox', 0.15);
    if(dash) dash.style.filter = 'blur(8px) brightness(0.6)';
    overlay.style.display = 'flex';
    setTimeout(() => { overlay.style.opacity = '1'; }, 50);
    window.renderJournalPage('start');
};

window.renderJournalPage = function(nodeId) {
    const node = sbStory[nodeId];
    const zone = document.getElementById('sb-journal-zone');
    zone.innerHTML = '';
    const page = document.createElement('div');
    page.className = 'journal-page active';
    let html = `<div class="j-greeting">${node.greeting}</div><div class="j-text">${node.text}</div>`;
    if(node.buttons) {
        node.buttons.forEach(b => html += `<div class="magic-tag" onclick="window.closeSmileBox()">${b.text}</div>`);
    }
    page.innerHTML = html;
    zone.appendChild(page);
};

window.closeSmileBox = function() {
    const overlay = document.getElementById('sb-overlay');
    const dash = document.getElementById('main-dashboard');
    overlay.style.opacity = '0';
    if(dash) dash.style.filter = 'none';
    if(window.crossfade) window.crossfade('bg-dashboard', 0.15);
    setTimeout(() => { overlay.style.display = 'none'; }, 800);
};
