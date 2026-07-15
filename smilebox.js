// ==========================================================
// 🌸 MAGICAL SMILE BOX ENGINE (FLOATING CARDS & AUDIO)
// ==========================================================

// --- 1. State & Tracking ---
let sbVisits = 0;
try {
    const stored = localStorage.getItem('smileBoxVisits');
    sbVisits = stored ? parseInt(stored) : 0;
    if (isNaN(sbVisits)) sbVisits = 0;
} catch(e) {}

let currentSbTheme = 'neutral';

// --- Cinematic Audio Engine (MASTER OVERRIDE) ---
let currentTrack = null;

window.crossfade = function(newTrackId, targetVolume = 0.4) {
    const newTrack = document.getElementById(newTrackId);
    if (!newTrack) return;

    // 1. Find ANY audio currently playing and fade it out
    document.querySelectorAll('audio').forEach(audio => {
        if (audio !== newTrack && !audio.paused && audio.id !== 'sfx-rain') {
            
            // Stop cassette player animation if it's the dashboard music
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

    // 2. Fade IN the new track
    if (newTrack.paused) {
        newTrack.volume = 0;
        let playPromise = newTrack.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.log("Audio block:", error));
        }
    }
    
    let fadeIn = setInterval(() => {
        if (newTrack.volume < targetVolume) {
            newTrack.volume = Math.min(newTrack.volume + 0.02, targetVolume);
        } else {
            clearInterval(fadeIn);
        }
    }, 100);

    currentTrack = newTrack;
};

window.toggleRain = function(turnOn) {
    const rain = document.getElementById('sfx-rain');
    if(!rain) return;
    
    if(turnOn) {
        rain.volume = 0;
        rain.play().catch(e => console.log(e));
        let rainFadeIn = setInterval(() => {
            if(rain.volume < 0.15) rain.volume += 0.01;
            else clearInterval(rainFadeIn);
        }, 100);
    } else {
        let rainFadeOut = setInterval(() => {
            if(rain.volume > 0.01) rain.volume -= 0.01;
            else { rain.pause(); clearInterval(rainFadeOut); }
        }, 100);
    }
};

// --- Master Audio Stop (For the Cassette Player Pause) ---
window.stopAllMusic = function() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.volume = 0;
    });
    
    const playerUI = document.getElementById('cassette-player');
    if (playerUI) playerUI.classList.remove('playing');
    
    currentTrack = null;
    window.isPlaying = false;
};

const randomEndings = [
    "I'm really glad you came here today.",
    "If today still feels heavy after this... call me.",
    "You're my favorite notification.",
    "Don't disappear after this. I still want to hear about your day.",
    "If you haven't eaten yet, I'm about to become very annoying.",
    "Go look in the mirror for a second. Yep, still adorable.",
    "This website will always be here. More importantly, so will I.",
    "I hope you're smiling at least a little bit now.",
    "You've got this. And I've got you.",
    "I'm sending you a hug right now. A really long one."
];

// --- 2. The Magical CSS ---
const sbStyles = document.createElement('style');
sbStyles.innerHTML = `
    /* --- Tiamat Comet Easter Egg --- */
    .shooting-star {
        position: absolute; width: 3px; height: 3px;
        background: #fff; border-radius: 50%;
        box-shadow: 0 0 10px #fff, 0 0 20px #A8B8FF, 0 0 30px #A8B8FF;
        animation: shoot 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        z-index: 100; opacity: 0; pointer-events: none;
    }
    .shooting-star::after {
        content: ''; position: absolute; top: 50%; transform: translateY(-50%);
        width: 150px; height: 1px;
        background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
    }
    
    @keyframes shoot {
        0% { transform: translate(120vw, -20vh) rotate(-35deg); opacity: 1; }
        100% { transform: translate(-20vw, 80vh) rotate(-35deg); opacity: 0; }
    }

    /* --- The Dark Environment --- */
    #sb-overlay {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 10, 25, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        display: none; flex-direction: column; justify-content: center; align-items: center; z-index: 4000;
        opacity: 0; transition: opacity 1.5s ease, background 1.5s ease;
        overflow: hidden; cursor: pointer;
    }

    /* Environmental Themes */
    #sb-overlay.theme-happy { background: rgba(30, 20, 10, 0.6); } 
    #sb-overlay.theme-sad { background: rgba(15, 15, 35, 0.8); } 
    #sb-overlay.theme-night { background: rgba(5, 10, 25, 0.85); } 
    #sb-overlay.theme-comfort { background: rgba(25, 15, 20, 0.7); } 

    /* Particles Container */
    #sb-particles { position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

    /* The Heart Symbol (Now inside the cards) */
    .sb-flower { width: 50px; height: 50px; fill: none; stroke: #C8B6D9; stroke-width: 1.5; filter: drop-shadow(0 0 10px rgba(255,255,255,0.5)); margin: 0 auto 20px auto; display: block; transition: all 1s ease; }
    .theme-happy .sb-flower { stroke: #FFD700; filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6)); }
    .theme-sad .sb-flower { stroke: #A8B8FF; filter: drop-shadow(0 0 15px rgba(168, 184, 255, 0.6)); }
    .theme-night .sb-flower { stroke: #E6E6FA; filter: drop-shadow(0 0 20px rgba(230, 230, 250, 0.8)); }
    .theme-comfort .sb-flower { stroke: #FFB7B2; filter: drop-shadow(0 0 15px rgba(255, 183, 178, 0.6)); }

    /* --- Floating Journal Page (The Questions) --- */
    #sb-journal-zone { width: 90%; max-width: 450px; position: relative; min-height: 350px; display: flex; justify-content: center; align-items: flex-start; z-index: 5; cursor: default; }
    
    .journal-page {
        position: absolute; top: 0; width: 100%; background: #FFFDF9; border-radius: 15px;
        padding: 40px 30px; box-sizing: border-box;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 20px rgba(255,255,255,0.1);
        transform: translateY(30px); opacity: 0;
        transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        display: flex; flex-direction: column;
    }
    
    .journal-page.active { transform: translateY(0); opacity: 1; z-index: 5; }
    .journal-page.exiting { transform: translateX(-50px) scale(0.95); opacity: 0; z-index: 4; }

    .j-corner-tl { position: absolute; top: 15px; left: 15px; font-size: 1.2rem; opacity: 0.5; color: #8B6F97; }
    .j-corner-br { position: absolute; bottom: 15px; right: 15px; font-size: 1.2rem; opacity: 0.5; color: #8B6F97; }

    .j-greeting { font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: #5E4B7D; margin-bottom: 10px; }
    .j-text { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #4B4453; line-height: 1.8; font-weight: 500; margin-bottom: 30px; white-space: pre-wrap; }

    /* --- Magical Tags (Buttons) --- */
    .sb-options { display: flex; flex-direction: column; gap: 12px; }
    
    .magic-tag {
        display: flex; align-items: center; gap: 15px; background: linear-gradient(to right, #FCF8FF, #FFFDFB);
        border: 1px solid rgba(200, 180, 220, 0.3); border-radius: 20px; padding: 10px 20px;
        font-family: 'Nunito', sans-serif; font-size: 1.1rem; font-weight: 700; color: #5E4B7D;
        cursor: pointer; transition: all 0.4s ease; text-align: left;
        opacity: 0; transform: translateY(10px); 
    }
    
    .magic-tag .tag-icon {
        width: 35px; height: 35px; border-radius: 50%; display: flex; justify-content: center; align-items: center;
        background: linear-gradient(135deg, #FFEAF6, #FFFDFB); font-size: 1.1rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: all 0.3s ease;
    }

    .magic-tag:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(255,200,240,.4); border-color: rgba(255,200,240,.8); }
    .magic-tag:hover .tag-icon { transform: scale(1.1); }
    
    .magic-tag.selected { animation: selectPulse 0.5s ease forwards; background: linear-gradient(to right, #FFF0F8, #FFFDFB); }
    
    @keyframes selectPulse {
        0% { transform: scale(1); box-shadow: 0 0 0 rgba(255,200,240,0.8); }
        50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(255,200,240,0.8); }
        100% { transform: scale(1); box-shadow: 0 0 15px rgba(255,200,240,0.5); }
    }

    /* The 'Thinking' Text */
    #sb-thinking { font-family: 'Caveat', cursive; font-size: 2rem; color: #8B6F97; position: absolute; opacity: 0; transition: opacity 0.5s; pointer-events: none; }

    /* The Final Unfolding Letter */
    #sb-letter-view {
        position: absolute; width: 90%; max-width: 600px;
        background: #FFF8F0; padding: 50px; border-radius: 15px;
        box-shadow: 0 30px 60px rgba(0,0,0,0.2); z-index: 5000;
        transform: scaleY(0); transform-origin: top; opacity: 0;
        transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease;
        max-height: 80vh; overflow-y: auto; cursor: pointer;
    }
    #sb-letter-view.open { transform: scaleY(1); opacity: 1; }
    #sb-letter-view::-webkit-scrollbar { display: none; }

    /* Utility */
    .fade-in-seq { animation: slideFadeUp 0.6s ease forwards; }
    @keyframes slideFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(sbStyles);

// Reusable Heart SVG for inside the cards
const heartSVG = `
    <svg class="sb-flower" viewBox="0 0 100 100">
        <path d="M50 80 C 50 80, 20 60, 20 40 C 20 20, 40 20, 50 40 C 60 20, 80 20, 80 40 C 80 60, 50 80, 50 80 Z" />
        <path d="M50 80 C 50 80, 35 50, 35 30 C 35 15, 45 15, 50 25 C 55 15, 65 15, 65 30 C 65 50, 50 80, 50 80 Z" />
        <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.5"/>
    </svg>
`;

// --- 3. The Interactive Data (The Conversation) ---
const sbStory = {
    'start': {
        greeting: "✨ The Smile Box",
        text: () => {
            let t = "Hey, pretty girl.\nI was hoping you'd stop by today.\n\nI don't know what kind of day you've had...\nMaybe it was amazing.\nMaybe it wasn't.\nEither way, I'm really glad you're here.";
            if (sbVisits === 20) t = "There you are.\nI was wondering when you'd visit again. 🤍\n\nI'm so glad you're here.";
            if (sbVisits >= 50) t = "You know...\nI think this little box likes seeing you.\n\nCome sit with me for a minute.";
            return t;
        },
        buttons: [{ icon: "✨", text: "Let's Talk", action: "q_feeling" }]
    },
    'q_feeling': {
        greeting: "Before we do anything...",
        text: "How are you really feeling?",
        buttons: [
            { icon: "🌸", text: "I'm actually happy.", action: "happy_start", theme: "happy" },
            { icon: "🌤", text: "I'm okay.", action: "okay_start", theme: "neutral" },
            { icon: "🌧", text: "I've had better days.", action: "bad_start", theme: "sad" },
            { icon: "🌙", text: "Everything feels like too much.", action: "heavy_start", theme: "night" },
            { icon: "🤍", text: "I don't even know.", action: "idk_start", theme: "comfort" }
        ]
    },

    // --- PATH: HAPPY ---
    'happy_start': {
        greeting: "Really?",
        text: "That makes me so happy.\nI wish I could've seen your smile just now.\n\nTell me...\nWhat happened?",
        buttons: [
            { icon: "✨", text: "Something really good happened.", action: "happy_good" },
            { icon: "🌼", text: "Nothing special, I just feel happy.", action: "happy_nothing" },
            { icon: "🤍", text: "I was thinking about you.", action: "happy_you" },
            { icon: "😂", text: "I honestly don't know.", action: "happy_idk" }
        ]
    },
    'happy_good': { greeting: "Aww...", text: "I love when life decides to be nice to you for once.\nYou deserve days like this.\n\nPromise me something?\nDon't downplay this moment.\nCelebrate it.\nSmile a little longer.\nTake a picture.\nSave the memory.\n\nBad days have a habit of making us forget that good ones exist.\nDon't let this one disappear.", endingLetter: "goodnews" },
    'happy_nothing': { greeting: "Hmm...", text: "Those are actually my favorite days.\nNothing extraordinary.\nJust peace.\n\nI hope life gives you more ordinary, quiet, beautiful days like this.", endingLetter: "happy" },
    'happy_you': { greeting: "Oh?", text: "So that's why you're smiling?\nHmm...\nI think I like the sound of that.\n\nYou know...\nIf you're smiling because of me...\nThen today has already been a pretty good day.", endingLetter: "smile" },
    'happy_idk': { greeting: "Honestly...", text: "That's kind of magical.\n\nSometimes happiness doesn't need a reason.\nIt just quietly visits.\n\nI hope it stays awhile.", endingLetter: "happy" },

    // --- PATH: OKAY ---
    'okay_start': {
        greeting: "Okay is good.", text: "Okay means we survived yesterday, and we have enough energy for today.\n\nBut just in case you need a little boost...\nWhat would make 'okay' turn into 'good'?",
        buttons: [
            { icon: "🌈", text: "A compliment.", endingLetter: "proud" },
            { icon: "🤍", text: "Just hearing from you.", endingLetter: "miss" }
        ]
    },

    // --- PATH: BETTER DAYS ---
    'bad_start': {
        greeting: "Hmm...", text: "I had a tiny feeling you might choose that.\n\nCome here.\nLet's figure this out together.\n\nWhich one sounds closest?",
        buttons: [
            { icon: "💔", text: "Someone hurt me.", action: "bad_hurt", theme: "sad" },
            { icon: "😞", text: "I'm disappointed.", action: "bad_disappointed", theme: "sad" },
            { icon: "😔", text: "I'm overwhelmed.", action: "heavy_start", theme: "night" },
            { icon: "🧸", text: "I miss you.", action: "bad_miss", theme: "comfort" },
            { icon: "😶", text: "I don't know.", action: "idk_start", theme: "comfort" }
        ]
    },
    'bad_hurt': {
        greeting: "First of all...", text: "Who?\nI just want to talk.\n...\nMostly.\n\nDo you want to tell me about it?",
        buttons: [
            { icon: "🗣", text: "Yes.", action: "hurt_yes" },
            { icon: "🤍", text: "Not really.", action: "hurt_no" }
        ]
    },
    'hurt_yes': {
        greeting: "I'm listening.", text: "Did they say something...\nOr did they do something?",
        buttons: [
            { icon: "💬", text: "They said something.", action: "hurt_ending" },
            { icon: "🚶", text: "They did something.", action: "hurt_ending" },
            { icon: "🌧", text: "Both.", action: "hurt_ending" }
        ]
    },
    'hurt_ending': { greeting: "I'm really sorry.", text: "I hate that someone made my favorite person feel this way.\n\nPlease don't let one person's words become your own.\nThey don't get to decide your worth.\n\nSeriously...\nLook at you.\nYou're kind.\nYou're beautiful.\nYou're thoughtful.\nYou're the type of person people feel lucky to know.\n\nDon't let someone who couldn't see that convince you otherwise.", endingLetter: "insecure" },
    'hurt_no': { greeting: "That's okay.", text: "You never have to explain yourself to me.\nSometimes just being here is enough.", endingLetter: "down" },
    
    'bad_disappointed': {
        greeting: "I see.", text: "Yourself...\nOr someone else?",
        buttons: [
            { icon: "🪞", text: "Myself.", action: "dis_self" },
            { icon: "👥", text: "Someone else.", action: "dis_other" },
            { icon: "🌎", text: "Life.", action: "dis_life" }
        ]
    },
    'dis_self': { greeting: "Hmm...", text: "Be honest.\n\nIf I came to you feeling exactly the same way...\nWould you speak to me the way you're speaking to yourself?\n...\nI don't think you would.\n\nSo why is it okay when you do it to yourself?\n\nPlease be kinder to yourself.\nYou're still becoming the person you're meant to be.", endingLetter: "proud" },
    'dis_other': { greeting: "I know.", text: "Expectations hurt.\nEspecially when they're attached to someone we care about.\n\nI'm sorry.", endingLetter: "angry" },
    'dis_life': { greeting: "Yeah...", text: "Sometimes life just has terrible timing.\nI wish I could skip those chapters for you.", endingLetter: "longday" },
    
    'bad_miss': {
        greeting: "Oh...", text: "Is that why you're here?\nHmm.\nYou're lucky you're cute.\n\nHow much?",
        buttons: [
            { icon: "🤏", text: "A little.", action: "miss_flirt" },
            { icon: "🥺", text: "A lot.", action: "miss_flirt" },
            { icon: "🫣", text: "An embarrassing amount.", action: "miss_flirt" }
        ]
    },
    'miss_flirt': { greeting: "Well...", text: "That's honestly kind of adorable.\n\nIf you're reading this because you miss me...\nYou know you could've just called me, right?\nI would've answered.\nOr if I was free, I'd probably already be on my way to see you.\n\nSo next time...\nDon't sit there missing me all alone.\nCome steal one of my hoodies.\nOr make me buy you food.\nOr just come sit with me while we do absolutely nothing.\n\nI like absolutely nothing...\nAs long as it's with you.", endingLetter: "miss" },

    // --- PATH: TOO MUCH ---
    'heavy_start': {
        greeting: "I'm so sorry.", text: "Can I carry a little of it with you?",
        buttons: [
            { icon: "🤍", text: "Please.", action: "heavy_please" },
            { icon: "🛑", text: "I don't want to burden anyone.", action: "heavy_burden" }
        ]
    },
    'heavy_please': {
        greeting: "Always.", text: "You never even have to ask.\n\nWhat's the heaviest part?",
        buttons: [
            { icon: "📚", text: "University", endingLetter: "stressed" },
            { icon: "🏠", text: "Family", endingLetter: "down" },
            { icon: "👥", text: "Friends", endingLetter: "insecure" },
            { icon: "🌎", text: "Everything", endingLetter: "longday" }
        ]
    },
    'heavy_burden': { greeting: "Hey. Look at me.", text: "Loving someone doesn't suddenly become inconvenient when they're having a hard day.\n\nIf you called me crying...\nMy first thought wouldn't be, 'Ugh.'\nIt would be, 'Where are you?'\n\nSo don't decide you're a burden for people before they've even had the chance to love you.", endingLetter: "reassurance" },

    // --- PATH: I DON'T KNOW ---
    'idk_start': {
        greeting: "You know what?", text: "I think 'I don't know' is one of the bravest answers.\nBecause sometimes there isn't a reason.\nSometimes your heart is just tired.\nAnd that's okay.\n\nWhat do you think you need most right now?",
        buttons: [
            { icon: "🫂", text: "A hug.", endingLetter: "hug" },
            { icon: "👂", text: "Someone to listen.", endingLetter: "crying" },
            { icon: "✨", text: "A distraction.", endingLetter: "smile" },
            { icon: "🤍", text: "Just stay with me.", endingLetter: "lonely" }
        ]
    }
};

// --- 4. The HTML Injection ---
window.injectSmileBox = function() {
    if(!document.getElementById('sb-overlay')) {
        const html = `
            <div id="sb-overlay">
                <div id="sb-particles"></div>
                
                <div id="sb-journal-zone">
                    <div id="sb-thinking">Hmm...</div>
                </div>
                
                <div id="sb-letter-view" onclick="window.closeSmileBox()">
                    ${heartSVG}
                    <div class="j-greeting" id="sb-l-greet" style="font-size: 2rem; color: #5D4E75;"></div>
                    <div class="j-text" id="sb-l-text"></div>
                    <div class="j-greeting" style="text-align:right; margin-top:40px;">Until next time,<br>Muzna 🤍</div>
                    <div style="text-align: center; margin-top: 50px; opacity: 0.4; font-family: 'Quicksand', sans-serif;">
                        ( Click anywhere to close )
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        // Click outside background to escape
        document.getElementById('sb-overlay').addEventListener('click', function(e) {
            if (e.target.id === 'sb-overlay' || e.target.id === 'sb-journal-zone') {
                window.closeSmileBox();
            }
        });
    }
};

window.injectSmileBox();

// --- 5. Logic & Pacing ---

window.spawnParticles = function() {
    const container = document.getElementById('sb-particles');
    const types = ['✨', '🌸', '⭐', '🦋'];
    
    setInterval(() => {
        if(document.getElementById('sb-overlay').style.display !== 'flex') return;
        if(container.childElementCount > 4) return;
        
        const p = document.createElement('div');
        p.innerText = types[Math.floor(Math.random() * types.length)];
        p.style.position = 'absolute';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = '100vh';
        p.style.fontSize = (Math.random() * 15 + 10) + 'px';
        p.style.opacity = '0.6';
        p.style.transition = 'all 8s linear';
        p.style.filter = 'drop-shadow(0 0 10px rgba(255,255,255,0.8))';
        container.appendChild(p);
        
        setTimeout(() => {
            p.style.top = '-10vh';
            p.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
            p.style.opacity = '0';
        }, 50);
        
        setTimeout(() => p.remove(), 8000);
    }, 1500);
};

window.startSmileBox = function() {
    try {
        sbVisits++;
        localStorage.setItem('smileBoxVisits', sbVisits);
    } catch(e) {}
    
    const overlay = document.getElementById('sb-overlay');
    const dash = document.getElementById('main-dashboard');
    
    if(window.crossfade) window.crossfade('bg-smilebox', 0.3);

    if(dash) {
        dash.style.transition = 'filter 1s ease';
        dash.style.filter = 'blur(8px) brightness(0.6)';
    }

    overlay.className = 'theme-neutral';
    overlay.style.display = 'flex';
    document.getElementById('sb-letter-view').classList.remove('open');
    document.getElementById('sb-journal-zone').innerHTML = '<div id="sb-thinking">Hmm...</div>';
    
    setTimeout(() => { overlay.style.opacity = '1'; }, 50);
    
    window.spawnParticles();
    
    setTimeout(() => {
        window.renderJournalPage('start');
    }, 1200);
};

window.renderJournalPage = function(nodeId) {
    const node = sbStory[nodeId];
    if(!node) return;
    
    if(node.theme) {
        document.getElementById('sb-overlay').className = `theme-${node.theme}`;
    }

    const zone = document.getElementById('sb-journal-zone');
    
    const page = document.createElement('div');
    page.className = 'journal-page';
    
    let text = typeof node.text === 'function' ? node.text() : node.text;
    
    // Heart SVG embedded directly at top of card, perfectly aligned
    let html = `
        <div class="j-corner-tl">❀</div>
        <div class="j-corner-br">🌸</div>
        ${heartSVG} 
        <div class="j-greeting">${node.greeting || "Hmm..."}</div>
        <div class="j-text">${text}</div>
    `;

    if(node.buttons) {
        html += `<div class="sb-options">`;
        node.buttons.forEach((btn, idx) => {
            html += `
                <div class="magic-tag" style="animation-delay: ${idx * 0.15}s;" onclick="window.selectSbOption(this, '${btn.action}', '${btn.endingLetter}', '${btn.theme}')">
                    <div class="tag-icon">${btn.icon}</div>
                    <div>${btn.text}</div>
                </div>
            `;
        });
        html += `</div>`;
    } else {
        // --- Click to Continue for Ending Cards ---
        html += `
            <div style="text-align:center; opacity:0.4; font-size:0.95rem; margin-top:30px; font-family:'Quicksand', sans-serif;">
                ( Click anywhere to continue )
            </div>
        `;
        page.style.cursor = 'pointer';
        page.onclick = function() {
            if(page.classList.contains('locked')) return;
            page.classList.add('locked');

            page.classList.remove('active');
            page.classList.add('exiting');
            
            const thinking = document.getElementById('sb-thinking');
            thinking.innerText = "Hmm...";
            thinking.style.opacity = '1';
            
            setTimeout(() => {
                page.remove();
                thinking.style.opacity = '0';
                setTimeout(() => {
                    if(node.endingLetter) {
                        window.showSbLetter(node.endingLetter);
                    } else {
                        window.closeSmileBox();
                    }
                }, 300);
            }, 800);
        };
    }

    page.innerHTML = html;
    zone.appendChild(page);
    
    setTimeout(() => {
        page.classList.add('active');
        const btns = page.querySelectorAll('.magic-tag');
        btns.forEach(b => b.classList.add('fade-in-seq'));
    }, 50);
};

window.selectSbOption = function(element, nextAction, endingLetter, themeOverride) {
    if(element.parentElement.classList.contains('locked')) return;
    element.parentElement.classList.add('locked');
    
    element.classList.add('selected');
    
    if(themeOverride) {
        document.getElementById('sb-overlay').className = `theme-${themeOverride}`;
    }

    if(window.crossfade) {
        if (nextAction === "bad_miss" || endingLetter === "miss") {
            window.crossfade('bg-katawaredoki', 0.5);
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'shooting-star';
                document.getElementById('sb-overlay').appendChild(star);
                setTimeout(() => star.remove(), 4000);
            }, 1500);
        }
        if (nextAction === "heavy_start") {
            window.crossfade('bg-sad', 0.2);
            window.toggleRain(true);
        }
        if (nextAction === "happy_start") {
            window.crossfade('bg-happy', 0.3);
        }
    }

    setTimeout(() => {
        const currentPage = element.closest('.journal-page');
        currentPage.classList.remove('active');
        currentPage.classList.add('exiting');
        
        const thinking = document.getElementById('sb-thinking');
        const thoughts = ["Hmm...", "I see...", "That makes sense...", "Thinking..."];
        thinking.innerText = thoughts[Math.floor(Math.random() * thoughts.length)];
        thinking.style.opacity = '1';
        
        setTimeout(() => {
            currentPage.remove();
            thinking.style.opacity = '0';
            
            setTimeout(() => {
                if(endingLetter && endingLetter !== 'undefined') {
                    window.showSbLetter(endingLetter);
                } else if(nextAction && nextAction !== 'undefined') {
                    window.renderJournalPage(nextAction);
                } else {
                    window.closeSmileBox();
                }
            }, 300);
        }, 800);
    }, 500);
};

window.showSbLetter = function(letterId) {
    const thinking = document.getElementById('sb-thinking');
    
    document.querySelectorAll('.journal-page').forEach(p => p.remove());
    
    thinking.innerText = "One moment...\nI'm looking for something that might help. ✨";
    thinking.style.opacity = '1';
    thinking.style.fontSize = "1.5rem";
    thinking.style.textAlign = "center";
    
    setTimeout(() => {
        thinking.style.opacity = '0';
        
        setTimeout(() => {
            let lData = { title: "For You", content: "I'm always here for you. 🤍" };
            if(window.lettersData) {
                const found = window.lettersData.find(l => l.id === letterId);
                if(found) lData = found;
            }

            const randEnd = randomEndings[Math.floor(Math.random() * randomEndings.length)];

            document.getElementById('sb-l-greet').innerText = `💌 ${lData.title}`;
            document.getElementById('sb-l-text').innerHTML = lData.content.replace(/\n/g, '<br>') + `<br><br><span style="font-family:'Caveat'; color:#8B6F97;">One last thing...</span><br><span style="font-weight:bold;">${randEnd}</span>`;
            
            document.getElementById('sb-letter-view').classList.add('open');
            
        }, 500);
    }, 2500);
};

window.closeSmileBox = function() {
    const overlay = document.getElementById('sb-overlay');
    const dash = document.getElementById('main-dashboard');
    
    document.getElementById('sb-letter-view').classList.remove('open');
    document.querySelectorAll('.journal-page').forEach(p => p.remove());
    
    overlay.style.opacity = '0';
    
    if(dash) {
        dash.style.filter = 'none';
    }
    
    if(window.crossfade) window.crossfade('bg-dashboard', 0.3);
    if(window.toggleRain) window.toggleRain(false);
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1500);
};