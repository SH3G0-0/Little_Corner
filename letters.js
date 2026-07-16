// ==========================================================
// 💌 MAGICAL LETTERS ENGINE - "The Vintage Keepsake Edition"
// ==========================================================

/* 💡 TIP FOR CUSTOM PICTURES:
   If you want to use your own downloaded transparent pictures of dried flowers 
   instead of the default ones, just scroll down to the "themeGraphicsMap" variable (around line 200) 
   and replace the "https://images.unsplash.com/..." links with the name of your file 
   (for example: "dried-rose.png").
*/

try {
    // --- 1. Load All Storybook & Handwritten Fonts ---
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Serif+Display&family=Handlee&family=Marck+Script&family=Patrick+Hand&family=Quicksand:wght@400;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // --- 2. The Magical CSS ---
    const letterStyles = document.createElement('style');
    letterStyles.innerHTML = `
        /* --- The Drawer Environment --- */
        #drawer-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(245, 240, 235, 0.85); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
            display: none; flex-direction: column; align-items: center; z-index: 2000;
            opacity: 0; transition: opacity 1.2s ease; overflow-y: auto; padding-bottom: 100px;
            scroll-behavior: smooth;
        }

        .drawer-header { font-family: 'DM Serif Display', serif; color: #4A3B5C; text-align: center; margin: 80px 0 50px 0; font-size: 2.5rem; line-height: 1.4; }
        .drawer-subtitle { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #6D5E85; font-style: italic; opacity: 0.8; }
        
        #envelope-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 90px 40px; width: 90%; max-width: 1100px; margin-top: 20px; }

        .envelope-container { width: 280px; height: 180px; position: relative; cursor: pointer; perspective: 1500px; margin: 0 auto; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), filter 0.6s ease; }
        
        /* THE FIXED TOOLTIP: Attached directly to the envelope */
        .envelope-container::after {
            content: attr(data-preview); position: absolute; bottom: -55px; left: 50%; transform: translateX(-50%) translateY(10px);
            background: linear-gradient(90deg, #FFDCEB, #F2ECFF, #DDEEFF, #FFF6CC);
            color: #5A4A78; padding: 12px 24px; border-radius: 25px;
            font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1rem; white-space: nowrap;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid white; z-index: 20; opacity: 0; pointer-events: none; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .envelope-container:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }

        .envelope-body {
            position: absolute; bottom: 0; width: 100%; height: 100%; border-radius: 12px;
            box-shadow: 0 15px 35px rgba(90, 74, 120, 0.15), inset 0 0 20px rgba(255,255,255,0.5);
            display: flex; justify-content: center; align-items: flex-end; padding-bottom: 25px; box-sizing: border-box;
            text-align: center; border: 1px solid rgba(255,255,255,0.4); z-index: 3; transition: all 0.5s ease;
        }
        
        .envelope-label { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: #4A3B5C; padding: 0 15px; line-height: 1.2; z-index: 4; font-weight: 600; }

        /* FIXED FLAP */
        .envelope-flap {
            position: absolute; top: 0; left: 0; width: 0; height: 0;
            border-left: 140px solid transparent; border-right: 140px solid transparent;
            border-top-width: 110px; border-top-style: solid; /* Color injected inline */
            z-index: 5; transform-origin: top; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
            filter: drop-shadow(0 5px 5px rgba(0,0,0,0.08));
        }

        .envelope-paper-preview {
            position: absolute; top: 10px; left: 15px; width: 250px; height: 150px;
            background: linear-gradient(180deg, #dcb388, #d4a97b);
            border-radius: 8px; z-index: 2; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); border: 1px solid rgba(60,20,0,0.2);
        }

        .wax-seal {
            position: absolute; top: 80px; left: 120px; width: 40px; height: 40px; border-radius: 50%; z-index: 6;
            display: flex; justify-content: center; align-items: center; color: white;
            box-shadow: 0 5px 10px rgba(0,0,0,0.15), inset 0 -3px 5px rgba(0,0,0,0.2); font-size: 1.2rem; transition: all 0.5s ease;
        }
        @keyframes seal-crack { 0% { transform: scale(1); opacity:1; } 50% { transform: scale(1.3) rotate(15deg); filter: blur(2px); opacity:0.8;} 100% { transform: scale(0); opacity:0; } }

        /* Hover Animations */
        .envelope-container:hover { transform: translateY(-12px); filter: drop-shadow(0 20px 30px rgba(90, 74, 120, 0.2)); }
        .envelope-container:hover .envelope-flap { transform: rotateX(170deg); z-index: 1; }
        .envelope-container:hover .wax-seal { opacity: 0; transform: scale(0.5); }
        .envelope-container:hover .envelope-paper-preview { transform: translateY(-40px); } 

        /* Opening Animation Ritual */
        .envelope-opening { pointer-events: none; }
        .envelope-opening .envelope-flap { transform: rotateX(180deg); z-index: 1; }
        .envelope-opening .wax-seal { animation: seal-crack 0.6s forwards; }
        .envelope-opening .envelope-paper-preview { transform: translateY(-150px) scale(1.5) rotate(5deg); opacity: 0; transition: all 1.2s ease; }
        .envelope-opening .envelope-body { filter: brightness(1.2); transform: scale(1.05); opacity: 0; transition: all 1.5s ease; }

        /* --- DYNAMIC Hover Toast for Previews (Fixed Position Issue) --- */
        #drawer-toast {
            position: fixed; transform: translateX(-50%) translateY(10px); 
            padding: 15px 30px; border-radius: 30px;
            background: linear-gradient(90deg, #FFDCEB, #F2ECFF, #DDEEFF, #FFF6CC);
            color: #5D4E75; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1.1rem;
            z-index: 9999; opacity: 0; pointer-events: none;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 2px solid white; white-space: nowrap;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        #drawer-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* --- The Reading Room --- */
        #letter-room {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: none; justify-content: center; align-items: center; z-index: 3000;
            opacity: 0; transition: opacity 1.5s ease; cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><text y='20' font-size='20'>🪶</text></svg>") 12 12, auto;
        }

        .bg-sad { background: linear-gradient(135deg, #1f2229, #353a47); }
        .bg-happy { background: linear-gradient(135deg, #FFF0B3, #FFDCEB); }
        .bg-night { background: linear-gradient(135deg, #0b0b17, #131b2e); }
        .bg-sick { background: linear-gradient(135deg, #D4E6D2, #E8F2E6); }
        .bg-warm { background: linear-gradient(135deg, #FAD0C4, #FFD1FF); }
        .bg-motivation { background: linear-gradient(135deg, #FFE4B5, #FFDAB9); }

        /* --- 1. DIFFERENT PAPER FOR EVERY EMOTION --- */
        .paper-happy { background-color: #fffaf0; color: #4B4453; }
        .paper-sad { background-color: #e6f0f5; color: #3a4454; }
        .paper-night { background-color: #1a2235; color: #dce4f0; }
        .paper-warm { background-color: #f2e3d5; color: #4a3b32; }
        .paper-sick { background-color: #eef7f2; color: #3b4a41; }
        .paper-angry { background-color: #e6e4e5; color: #2b2b2b; }
        .paper-motivation { background-color: #fcf6e5; color: #4a3b22; }

        .letter-paper-full {
            width: 90%; max-width: 750px; height: 85vh; padding: 0; 
            border-radius: 2px 5px 3px 6px; /* Deckled torn edge */
            box-shadow: inset 0 0 100px rgba(60, 20, 0, 0.4), 0 20px 50px rgba(60, 20, 0, 0.3); /* Warm Vignette */
            transform: translateY(120px) scale(0.6) rotate(-5deg); opacity: 0; transition: all 1.8s cubic-bezier(0.25, 1, 0.5, 1);
            overflow-y: auto; overflow-x: hidden; position: relative; scroll-behavior: smooth;
        }
        
        /* 6. GENTLE SWAY ANIMATION */
        @keyframes sway { 0% { transform: rotate(1deg) translateY(0); } 50% { transform: rotate(0.6deg) translateY(-2px); } 100% { transform: rotate(1deg) translateY(0); } }
        .paper-ready { transform: rotate(0deg) translateY(0) scale(1); opacity: 1; animation: sway 12s ease-in-out infinite; }
        
        .letter-paper-full::-webkit-scrollbar { display: none; }
        
        /* The inner wrapper that actually holds the content and flashlight */
        .paper-content-wrapper { 
            position: relative; z-index: 5; padding: 140px 60px 80px 60px; min-height: 100%; box-sizing: border-box;
            background-image: 
                url("https://www.transparenttextures.com/patterns/aged-paper.png"),
                linear-gradient(to bottom, transparent 33%, rgba(0,0,0,0.04) 33%, rgba(255,255,255,0.04) 34%, transparent 34%),
                linear-gradient(to bottom, transparent 66%, rgba(0,0,0,0.04) 66%, rgba(255,255,255,0.04) 67%, transparent 67%);
            background-color: #d8b898;
            background-blend-mode: multiply;
        }
        
        /* 18. LIGHT FOLLOWS MOUSE (FIXED BOUNDS) */
        .paper-content-wrapper::after {
            content: ''; position: absolute; top:0; left:0; right:0; bottom:0;
            background: radial-gradient(circle 450px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.18), transparent);
            pointer-events: none; z-index: 10;
        }
        
        /* 4. PAPER SMELLS (Vintage Dried Flowers) */
        .real-pressed-flower {
            position: absolute; z-index: 4; pointer-events: none; background-size: cover; background-position: center;
            mix-blend-mode: multiply; filter: sepia(0.8) contrast(1.2) opacity(0.35); /* Faded look */
            mask-image: radial-gradient(circle, black 40%, transparent 70%); -webkit-mask-image: radial-gradient(circle, black 40%, transparent 70%);
        }

        /* 2. FLOATING DECORATIONS */
        @keyframes drift { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } }
        .floating-decor { position: absolute; font-size: 2rem; opacity: 0.6; z-index: 10; animation: drift 6s ease-in-out infinite; pointer-events:none; }
        .floating-decor.d-tl { top: 40px; left: 40px; }
        .floating-decor.d-br { bottom: 80px; right: 40px; animation-delay: 2s; } /* Sits right next to signature */

        /* 12. COFFEE STAIN */
        .coffee-stain { position:absolute; top:15%; right:10%; width:180px; height:180px; background:url('https://www.transparenttextures.com/patterns/stucco.png'); border-radius:50%; border: 6px solid rgba(80,40,10,0.12); opacity:0.7; mix-blend-mode:multiply; pointer-events:none; z-index:0; }

        /* 13. MARGIN NOTES */
        .margin-note { position: absolute; font-family: 'Caveat', cursive; font-size: 1.2rem; color: inherit; opacity: 0.4; transform: rotate(-10deg); z-index: 5; pointer-events:none; }

        /* Sweet Notes (Top corner) */
        .sweet-note-top { position: absolute; top: 40px; left: 40px; font-family: 'Caveat', cursive; font-size: 1.4rem; color: inherit; opacity: 0.5; font-style: italic; z-index: 5; font-weight: 700;}

        /* --- 5. DIFFERENT HANDWRITING FOR EMOTIONS --- */
        .font-happy { font-family: 'Caveat', cursive; font-size: 26px; }
        .font-sad { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 24px; }
        .font-night { font-family: 'Marck Script', cursive; font-size: 28px; }
        .font-motivation { font-family: 'Handlee', cursive; font-size: 24px; }
        .font-sick { font-family: 'Patrick Hand', cursive; font-size: 24px; }
        .font-warm { font-family: 'Caveat', cursive; font-size: 26px; }
        .font-angry { font-family: 'Patrick Hand', cursive; font-size: 24px; }
        
        /* 3. TINY INK IMPERFECTIONS */
        .ink-text { text-shadow: 0 0 1px rgba(0,0,0,.08), 0 1px 0 rgba(0,0,0,.05); line-height: 2.1; white-space: pre-wrap; font-weight: 500; position: relative; z-index: 6;}
        .paper-night .ink-text { text-shadow: 0 0 2px rgba(255,255,255,0.15); } /* Glow for dark paper */

        .paper-header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 15px; font-weight: 700; font-size: 1.3em;}
        .paper-greeting { margin-bottom: 30px; font-weight: 700; font-size: 1.2em;}
        
        .paper-divider { border-bottom: 2px dashed rgba(0,0,0,0.1); width: 40%; margin: 40px auto; }
        .ps-box { text-align: left; margin-top: 40px; opacity: 0.9; transform: scale(0.95); transform-origin: left; }
        .signature-text { text-align: right; line-height: 1.2; font-weight: 700; margin-top: 60px; margin-right: 80px; font-size: 1.4em;} /* Shifted slightly left to accommodate the icon */
        .you-exist { display: block; margin: 30px 0; text-align: center; opacity: 0.6; font-weight: 700; font-style: italic;}

        /* BUTTONS (Moved Inside the Letter Wrapper) */
        .letter-controls { display: flex; justify-content: center; gap: 20px; margin-top: 60px; opacity: 0; transition: opacity 1s ease; position: relative; z-index: 20; }
        .letter-btn { background: rgba(255,255,255,0.85); border: 1px solid rgba(200, 180, 220, 0.5); color: #5D4E75; padding: 12px 25px; border-radius: 30px; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: all 0.3s; backdrop-filter: blur(5px); }
        .letter-btn:hover { background: #FFFDF9; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        /* Ambient Particles */
        #room-particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; overflow: hidden; }
        .ambient-p { position: absolute; transition: all linear; opacity: 0; }
    `;
    document.head.appendChild(letterStyles);

    // --- Dynamic Data Generators ---
    const sigs = ["♡ Always.", "Take care of yourself.\nPromise?", "Until next time.", "Yours, truly.", "Thinking of you."];
    const marginNotes = ["♡", "Don't skip lunch!!", "You look cute today :)", "Drink water.", "You got this."];
    const topNotes = [
        "Just thinking about you...", "You look really beautiful today.", "I love you.", 
        "I'm so lucky to know you.", "You mean the world to me.", "I hope this makes you smile.", 
        "You are so deeply loved.", "I'm always in your corner.", "You're doing great.",
        "Take a deep breath.", "I wish I was sitting next to you right now."
    ];
    const doodles = ["🌸", "☁️", "♡", "⭐", "🐇"];

    // --- Dynamic Theme Graphics Engine ---
    const themeGraphicsMap = {
        'warm': [
            { url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=300&q=80', css: 'bottom: 5%; right: -10px; width: 220px; height: 220px; transform: rotate(-15deg);' },
            { url: 'https://images.unsplash.com/photo-1596785236251-71fa49ac5760?auto=format&fit=crop&w=300&q=80', css: 'top: 15%; left: -20px; width: 180px; height: 180px; transform: rotate(25deg);' }
        ],
        'happy': [
            { url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=300&q=80', css: 'bottom: 10%; right: -20px; width: 240px; height: 240px; transform: rotate(10deg); filter: sepia(0.5) contrast(1) opacity(0.3);' },
            { url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=300&q=80', css: 'top: 10%; left: -10px; width: 150px; height: 150px; transform: rotate(15deg);' }
        ],
        'sad': [
            { url: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&w=300&q=80', css: 'bottom: 0; left: -10px; width: 250px; height: 250px; filter: grayscale(1) opacity(0.15); transform: rotate(5deg);' },
            { url: 'https://images.unsplash.com/photo-1518063319808-1f8cb1250cbc?auto=format&fit=crop&w=300&q=80', css: 'top: 20%; right: -20px; width: 200px; height: 200px; filter: grayscale(1) opacity(0.15);' }
        ],
        'night': [
            { url: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=300&q=80', css: 'top: 10%; right: -10px; width: 180px; height: 180px; filter: grayscale(1) opacity(0.25);' },
            { url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=300&q=80', css: 'bottom: 10%; left: -20px; width: 220px; height: 220px; filter: grayscale(1) opacity(0.2); transform: rotate(45deg);' }
        ],
        'sick': [
            { url: 'https://images.unsplash.com/photo-1576092762791-dd9e222064af?auto=format&fit=crop&w=300&q=80', css: 'bottom: 10%; right: -10px; width: 200px; height: 200px; transform: rotate(-20deg);' },
            { url: 'https://images.unsplash.com/photo-1596435035541-114400a9ec6f?auto=format&fit=crop&w=300&q=80', css: 'top: 15%; left: -10px; width: 160px; height: 160px; transform: rotate(15deg);' }
        ],
        'motivation': [
            { url: 'https://images.unsplash.com/photo-1529144415895-6aaf8be872fb?auto=format&fit=crop&w=300&q=80', css: 'bottom: 5%; right: -15px; width: 200px; height: 200px; transform: rotate(-10deg); filter: sepia(1) contrast(1.2) opacity(0.3);' },
            { url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=300&q=80', css: 'top: 10%; left: -10px; width: 170px; height: 170px; transform: rotate(20deg); filter: sepia(1) contrast(1.2) opacity(0.3);' }
        ]
    };

    // --- 3. The Letter Data (ALL 20 LETTERS RESTORED) ---
    window.lettersData = [
        { 
            id: "insecure", title: "When You're Feeling Insecure", theme: "warm", font: "font-warm", paper: "paper-warm",
            envColor: "#F2E3D5", flapColor: "#E8D5C4", sealColor: "#A67B5B", sealIcon: "✨", 
            preview: "Borrow my eyes for a minute.", greeting: "Hey, pretty girl.", 
            ps: "If your brain keeps saying mean things about you, send it to me. I'd like to have a word with it.", 
            content: `I need to ask you something.\nWho exactly convinced you that you weren't enough?\nBecause I'd like to have a very serious conversation with them.\n\nI know what it looks like when you get quiet. You start replaying every tiny mistake. You zoom in on every flaw. You convince yourself that everyone else has it figured out and you're the only one falling behind.\n\nI wish you could borrow my eyes for just one minute.\nIf you could see the way your face lights up when you talk about things you love...\nIf you could see how easily you make people feel safe...\nIf you could see how ridiculously beautiful you are even when you're just existing in a room...\nYou would never doubt yourself again.\n\nI'd probably steal your blanket right now and force you to listen to me list all the reasons you're amazing.\nYou'd roll your eyes, but I wouldn't stop.\n\nYou don't have to be perfect to be loved.\nYou just have to be you. The world doesn't need a flawless version of you.\nIt just needs *you*.\n\nSo please, be a little kinder to yourself today.\nTalk to yourself the way you talk to people you love.\n\nI'll keep reminding you until you believe it.` 
        },
        { 
            id: "reassurance", title: "When You Need Reassurance", theme: "warm", font: "font-warm", paper: "paper-warm",
            envColor: "#FFF5F5", flapColor: "#FCE8E8", sealColor: "#FFFFFF", sealIcon: "🤍",
            preview: "You don't have to carry this alone.", greeting: "Hey, love.", 
            ps: "You don't have to ask if I'm free. Just call. We'll figure the rest out later. ❤️", 
            content: `Can I be selfish for a second?\nI need you to promise me something.\nPromise me that when you're struggling...\nYou won't immediately decide to deal with everything on your own.\nI know that's what you usually do.\nYou tell yourself you'll figure it out.\nYou convince yourself you don't want to bother anyone.\nBut if there's one person I never want you to hesitate to bother...\nIt's me.\nSeriously.\nIf you're sad...\nCall me.\nIf you're angry...\nCall me.\nIf you're crying...\nCall me.\nIf you just had the best day ever and you're excited...\nPlease call me.\nI want to hear all of it.\nThe good days.\nThe bad days.\n<span class="imperfection-2">The completely random "guess what happened today" stories.</span>\nI don't just want to be around for your best moments.\nI want to be there for all of them.\nSo don't ever think you're too much.\nYou could never be too much for me.` 
        },
        { 
            id: "nosleep", title: "When You Can't Sleep", theme: "night", font: "font-night", paper: "paper-night",
            envColor: "#1A2235", flapColor: "#111826", sealColor: "#C0C0D0", sealIcon: "🌙",
            preview: "It's very late, isn't it?", greeting: "Hey, sleepyhead.", 
            ps: "Sleep. That's an order. (A very loving one.)", 
            content: `You're awake again, aren't you?\nI knew it.\nInstead of sleeping like a normal person, you're reading letters on a website.\nHonestly... that's kind of cute.\n\nI know why you're awake.\nThe house gets quiet, the distractions stop, and suddenly your brain decides it's the perfect time to review everything that happened since 2014.\nEvery awkward moment.\nEvery unresolved worry.\nEvery thing you have to do tomorrow.\n\nIf I was sitting beside you right now, I'd probably pull the phone out of your hands.\nI'd hand you a warm mug of tea and pretend I wasn't worried about you.\nWe'd talk until your eyes couldn't stay open anymore.\n\nBut since I can't do that...\nI need you to do it for yourself.\nTake a slow breath.\nRelease the tension in your jaw.\nDrop your shoulders.\n\nYou don't have to solve tomorrow tonight.\nTomorrow's problems belong to tomorrow's version of you.\nTonight's version of you only has one job: to rest.\n\nClose your eyes.\nI'll meet you in tomorrow.` 
        },
        { 
            id: "smile", title: "When You Need A Smile", theme: "happy", font: "font-happy", paper: "paper-happy",
            envColor: "#FFFAF0", flapColor: "#F5EEDC", sealColor: "#FFD166", sealIcon: "😊",
            preview: "Smile inspection.", greeting: "Well... look who showed up.", 
            ps: "If you're still refusing to smile, I'm going to assume you're just being stubborn.", 
            content: `Excuse me.\nYes, you.\nSmile inspection. I'm waiting.\n...\nWas that a smile?\nNo?\nLooks like I'm going to have to work a little harder.\n\nCan I tell you something?\nOne of my favorite things about you is how easily you make other people smile.\nWhich is honestly a little unfair. Because now I have to compete with that.\n\nSo here's my attempt.\nYou're ridiculously cute.\nYou have the most contagious laugh.\nYou somehow make even the most ordinary conversations memorable.\nAnd you look really pretty when you're smiling.\n\nYes. That was absolutely me trying to convince you to smile.\nDid it work?\nI hope so. Because I'd hate to lose this very important competition.\n\nNow...\nSmile for me.\nJust a little.\n...\nThere it is.\nI knew I'd win eventually.` 
        },
        { 
            id: "down", title: "When You're Feeling Down", theme: "sad", font: "font-sad", paper: "paper-sad",
            envColor: "#EEF5F8", flapColor: "#DCE6EA", sealColor: "#9BAEBC", sealIcon: "🌧",
            preview: "I know today probably wasn't your favorite.", greeting: "Hi, sunshine.", 
            ps: "Today's allowed to be a bad day. Just don't let it convince you that you're having a bad life.", 
            content: `I don't know what happened today.\nMaybe something huge happened.\nMaybe nothing actually happened at all.\nMaybe it was just one of those strange days where everything felt heavier than it should have.\n\nYou woke up already tired.\nSmall things felt bigger.\nPeople were a little colder.\nAnd somehow by the time you got here... you just didn't have much left in you.\n\nYou know something funny?\nI think everyone has days like that. The difference is that nobody really talks about them. We all walk around pretending we're completely okay while secretly hoping someone notices we're carrying a little too much.\n\nI wish I could knock on your door right now.\nI wouldn't ask you a hundred questions.\nI wouldn't tell you to "cheer up."\nI'd probably just sit next to you.\nMaybe we'd make tea. Maybe we'd watch something stupid. Maybe we'd just sit in silence. Because sometimes people don't need solutions. Sometimes they just need company.\n\nTake a breath.\n...\nAgain.\nI'm serious.\n\nIf today feels impossible... don't try to fix your entire life tonight.\nDrink some water. Eat something warm. Get under your blanket.\nThose tiny things are still victories.\n\nAnd if tomorrow isn't any better... come back.\nThis letter isn't going anywhere. Neither am I.` 
        },
        { 
            id: "miss", title: "When You Miss Me", theme: "warm", font: "font-warm", paper: "paper-warm",
            envColor: "#F5ECE1", flapColor: "#E8DAC6", sealColor: "#C9A680", sealIcon: "🧸",
            preview: "Hmm... someone misses me.", greeting: "Oh! It's you again.", 
            ps: "Stop reading this and come find me already. I think I've waited long enough.", 
            content: `So...\nYou clicked on this one.\nInteresting.\nMissing me already?\nYou're such a weirdo.\n...\nI mean, I get it.\nI'm pretty cool.\nI'm kidding.\n(Kind of.)\nI wish I knew what made you open this letter. Maybe today was just one of those days where you wanted someone familiar around. If that's the case, I hope this is enough until we can actually hang out.\nI like knowing that even when we're doing our own thing, we still somehow end up thinking about each other.\nThat's nice.\nLife gets busy, people get caught up in things, and sometimes days pass faster than we'd like.\nBut none of that changes the fact that I'm always happy to hear from you.\nSo don't overthink it.\nSend the text.\nCall me.\nSend me a meme.\nTell me something random.\nOr just say "hi."\nI promise I won't mind.\nNow stop sitting there smiling at your screen.\n<span class="you-exist">"It's making you look suspicious."</span>` 
        },
        { 
            id: "exam", title: "Before An Exam", theme: "happy", font: "font-happy", paper: "paper-happy",
            envColor: "#EDF2E6", flapColor: "#DCE6D2", sealColor: "#A3B899", sealIcon: "✏️",
            preview: "Breathe first.", greeting: "Hello, trouble.", 
            ps: "If you finish the exam and immediately start overthinking every answer, I'm legally obligated to tell you to stop. You can't change the answers anymore, so go celebrate surviving instead.", 
            content: `Alright.\nDeep breath.\nNo, seriously.\nTake one.\nDone?\nGood.\nI know you're probably sitting there thinking about everything you don't know instead of everything you've already studied.\nThat's just your brain being dramatic again.\nYou've worked hard.\nYou've put the time in.\nAnd now the only thing left to do is trust yourself.\nDon't let one question throw you off.\nIf you don't know the answer, move on.\nCome back later.\nOne difficult question doesn't decide the whole exam.\nAnd one exam definitely doesn't decide your future.\nJust do your best.\nThat's all anyone—including me—could ever ask of you.\nI'm already proud of you.\nNow go show that exam who's actually in charge.` 
        },
        { 
            id: "overthinking", title: "When You're Overthinking", theme: "night", font: "font-night", paper: "paper-night",
            envColor: "#25243B", flapColor: "#1A1A2E", sealColor: "#79728A", sealIcon: "🌌",
            preview: "Your brain is doing it again.", greeting: "Hey. Yeah, you.", 
            ps: "Your brain is grounded for the rest of the day. It has officially lost overthinking privileges.", 
            content: `Let me guess.\nYou've replayed the same conversation at least twelve times already.\nYou've imagined seventeen different outcomes.\nYou've somehow convinced yourself that the worst possible scenario is definitely going to happen.\nSound about right?\nYour brain deserves an award.\nNot for being correct.\nJust for having an incredible imagination.\nTake a breath.\nNot every awkward moment is remembered forever.\nNot every unanswered message means something's wrong.\nNot every silence needs filling.\nSometimes things are just...\nNormal.\nGive yourself a break.\nYou don't have to solve tomorrow tonight.\nAnd you definitely don't have to fight battles that only exist in your imagination.\nYour brain means well.\nIt's just being a little dramatic today.` 
        },
        { 
            id: "longday", title: "After A Long Day", theme: "warm", font: "font-warm", paper: "paper-warm",
            envColor: "#F4EAE1", flapColor: "#EBDAC8", sealColor: "#BA8C63", sealIcon: "🍂",
            preview: "Welcome home.", greeting: "There you are. I've been waiting for you.", 
            ps: "Your only assignment tonight is to rest. Yes, this assignment is graded. Yes, I'll know if you don't do it.", 
            content: `Welcome back.\nYou made it.\nI don't know whether today was amazing, terrible, or just painfully average.\nBut it's over now.\nAnd honestly?\nI'm glad.\nBecause now you can finally stop carrying everything around.\n<span class="imperfection-2">You don't have to answer every message tonight.</span>\nYou don't have to finish every task tonight.\nYou don't have to feel guilty for resting.\nBeing tired doesn't mean you're lazy.\nIt means you're human.\nSo put your phone down for a bit.\nGet comfortable.\nFind a blanket.\nWatch something that makes you laugh.\nOr do absolutely nothing.\nYou'd be surprised how healing "doing nothing" can be.\nToday's finished.\nLet it stay there.` 
        },
        { 
            id: "lonely", title: "When You're Feeling Lonely", theme: "sad", font: "font-sad", paper: "paper-sad",
            envColor: "#DFE5E8", flapColor: "#C5D0D6", sealColor: "#8FA3AD", sealIcon: "☂",
            preview: "You're not as alone as you think.", greeting: "Hi, my favorite person.", 
            ps: "Just because we're not in the same place doesn't mean you're by yourself.", 
            content: `I know loneliness has this annoying habit of making the world feel a lot quieter than it actually is.\nIt makes you think nobody understands.\nNobody notices.\nNobody's around.\nBut feelings aren't always facts.\nSometimes loneliness lies.\nIt tells you you're by yourself when you're really not.\nI hope you remember that there are people who care about you more than you probably realize.\nI'm one of them.\nWhether we're talking every hour, every day, or we've both just been busy with life...\nThat doesn't change.\nYou're still important to me.\nYou're still someone I care about.\nAnd you're never a burden for needing someone.\nSo if today feels a little lonely...\nRemember this letter.\nAnd remember me.` 
        },
        { 
            id: "stressed", title: "When You're Stressed", theme: "sick", font: "font-sick", paper: "paper-sick",
            envColor: "#EBF2EB", flapColor: "#DCE6DB", sealColor: "#93B391", sealIcon: "🍵",
            preview: "Pause for a second.", greeting: "Okay, let's take a timeout.", 
            ps: "Go unclench your jaw. I know you're doing it.", 
            content: `Pause.\nSeriously.\nBefore you keep reading...\nRelax your shoulders.\nUnclench your jaw.\nTake one deep breath.\nThere.\nAlready doing better.\nStress has this funny way of convincing us that everything is urgent.\nSpoiler alert...\nIt isn't.\nOne thing at a time.\nYou don't have to solve your entire life before dinner.\nYou just have to solve the next thing.\nThen the next.\nThen the next.\n<span class="you-exist">"You're stronger than you think."</span>\nAnd even if today feels messy...\nMessy days don't last forever.` 
        },
        { 
            id: "motivation", title: "When You Need Motivation", theme: "motivation", font: "font-motivation", paper: "paper-motivation",
            envColor: "#FCF6E5", flapColor: "#EAE2CC", sealColor: "#FFA366", sealIcon: "🌅",
            preview: "One step is enough.", greeting: "Hey, you.", 
            ps: "One step is still progress. Don't underestimate how far tiny steps can take you.", 
            content: `I know starting is sometimes the hardest part.\nYou keep waiting until you feel motivated enough. Confident enough. Ready enough.\n\nCan I tell you a secret?\nAlmost nobody feels completely ready.\nThey just start anyway.\n\nYou look at the whole mountain and it feels terrifying. But you don't have to climb the whole mountain right now.\nYou just have to take the next step.\n\nRemember when you thought you couldn't pass that last hurdle, but you did?\nI remember.\nI watched you do it.\n\nSo don't worry about taking huge steps today.\nTake one small one. Then another.\nTiny progress is still progress.\n\nYou've got this.\nEven if today's version of "got this" looks different from yesterday's.` 
        },
        { 
            id: "angry", title: "When You're Angry", theme: "sad", font: "font-angry", paper: "paper-angry",
            envColor: "#E6E4E5", flapColor: "#D6D3D5", sealColor: "#7A6894", sealIcon: "🌩",
            preview: "Okay... who annoyed you?", greeting: "Well... someone's grumpy.", 
            ps: "Before you start plotting someone's downfall... maybe have a snack first.", 
            content: `Okay, who do I need to fight?\nI'm kidding.\n...\nMostly.\n\nI can tell you're frustrated. Someone or something completely tested your patience today, and you have every right to be mad about it.\n\nI'm not going to tell you to calm down. That has literally never worked in the history of humanity.\n\nIf I was there, you'd probably be pacing the room ranting, and I'd be sitting there nodding aggressively, saying, "Wow, they actually did that? Unbelievable."\n\nBut since I can't be there... take a deep breath.\nDrink some cold water.\n\nDon't let someone else's nonsense ruin your entire day.\nYour energy is way too precious to waste on things that won't matter next week.\n\nPunch a pillow if you have to.\nThen go do something that makes you happy.\nThey don't get to steal your peace.` 
        },
        { 
            id: "happy", title: "When You're Happy", theme: "happy", font: "font-happy", paper: "paper-happy",
            envColor: "#FFFDF0", flapColor: "#FFF6D6", sealColor: "#FFC233", sealIcon: "☀",
            preview: "I had a feeling today was kinder to you.", greeting: "Heyyy!!", 
            ps: "I hope today keeps surprising you in the best ways. And if something even better happens... I expect to hear about it. ❤️", 
            content: `Look at you!!\nYou're happy!!\nFinally, the universe decided to do its job for once.\nI love that.\nHonestly, I think the world is a much better place when it's being kind to you.\nYou deserve days that make you smile for absolutely no reason.\nYou deserve moments where you're laughing so hard your stomach hurts.\nYou deserve days that end with you thinking,\n"Today was actually really nice."\nIf something wonderful happened today...\nI hope you celebrated it.\nEven if it's something tiny.\nMaybe you finished something you've been working on.\nMaybe someone complimented you.\nMaybe you got good news.\nMaybe today just felt... lighter.\nWhatever it was...\nI'm so happy it happened to you.\nSometimes we're so busy waiting for the next big thing that we forget to enjoy the little victories.\nSo don't do that today.\nBe proud of yourself.\nSmile a little longer.\nReplay the happy moment in your head as many times as you want.\nThose moments deserve to stay with you.\nAnd selfishly...\nI wish I was there to see you smiling.\nBecause I think your smile is one of my favorite things in the world.\nSo keep it around for a while, okay?\nYou look really, really pretty wearing it.\nNow go enjoy your day.\nYou've earned it.\nNow stop reading this.\nGo enjoy your happy moment.\nThe letter will still be here tomorrow, but today won't.\nGo make another memory.\nAnd don't forget to tell me all about it later. ❤️` 
        },
        { 
            id: "goodnews", title: "After Good News", theme: "happy", font: "font-happy", paper: "paper-happy",
            envColor: "#FEF7E6", flapColor: "#FDEBCC", sealColor: "#FCA832", sealIcon: "🎉",
            preview: "WAIT... you have news?", greeting: "WAIT.", 
            ps: "I reserve the right to celebrate your wins even more than you do.", 
            content: `YOU HAVE GOOD NEWS??\nAnd you're reading this before telling me??\nExcuse me??\nI should've been the first person to know.\nI'm offended.\n...\nOkay, not really.\nI'm just really happy for you.\nWhatever happened...\nI'm proud of you.\n<span class="you-exist">"I'm definitely making my happy face right now."</span>\nYou work so hard for the things you care about, and I love seeing life reward you every once in a while.\nCelebrate it.\nPlease.\nDon't immediately move on to the next goal.\nDon't say,\n"It's not that big of a deal."\nIt is.\nIf it made you happy...\nThen it's worth celebrating.\nSo smile.\nTake pictures.\nTreat yourself.\nBrag a little.\nYou've earned it.\nAnd then...\nCome tell me everything.\nEvery tiny detail.\nI want the full story.\nNot the short version.\nThe entire thing.` 
        },
        { 
            id: "proud", title: "When You're Proud of Yourself", theme: "warm", font: "font-warm", paper: "paper-warm",
            envColor: "#FCF5F5", flapColor: "#F7E6E6", sealColor: "#E09C9C", sealIcon: "✨",
            preview: "I'm proud of you too.", greeting: "Hey, pretty girl.", 
            ps: "Please don't follow this achievement with, 'It wasn't that hard.' We both know that's not true.", 
            content: `Can I just say something?\nI'm really glad you're proud of yourself.\nYou should be.\nI know how hard you are on yourself sometimes.\nYou're always thinking about what you could've done better instead of looking at everything you've already accomplished.\nSo if today is one of those rare moments where you're looking at yourself and thinking,\n"I actually did pretty well."\nHold onto that feeling.\nDon't let your brain take it away five minutes later.\nBe proud.\nYou've earned that.\nAnd if you ever forget...\nI'll gladly remind you.\nBecause trust me...\nI've been proud of you for a long time.` 
        },
        { 
            id: "hug", title: "When You Need A Hug", theme: "warm", font: "font-warm", paper: "paper-warm",
            envColor: "#FCEFF2", flapColor: "#F7DBE1", sealColor: "#D18698", sealIcon: "🫂",
            preview: "Come here for a second.", greeting: "Come here for a second.", 
            ps: "Don't forget to drink water. Yes, I'm reminding you again. And no, this reminder isn't optional. 😌💜", 
            content: `No, seriously.\nCome here.\nImagine I'm giving you the biggest hug ever.\nThe kind where you don't have to explain anything.\nNo pretending you're okay.\nNo fake smiles.\nNo "I'm fine."\nJust a hug.\nStay there for a few seconds.\n...\nThere.\nThat already feels a little better, doesn't it?\nI know hugs can't magically fix everything, but I really wish I could give you one whenever you needed it.\nAnd honestly...\nYou know you never have to go through things alone, right?\nYou can literally call me.\nAt any time.\nI don't care if it's early in the morning, late at night, or you've had the worst day ever.\nIf you need me, call me.\nI'll come over, give you the biggest hug imaginable, sit with you for as long as you need, listen to everything you want to say—or nothing at all if you don't feel like talking.\nWe'll order food, watch something, go for a drive, make tea, sit in complete silence, or do absolutely nothing together.\nWhatever helps.\nYou never have to earn my time.\nYou never have to apologize for needing someone.\nEspecially not me.\nSo the next time life feels a little too heavy...\nDon't just read this letter.\nCall me.\nI'd much rather be hugging you for real than have this letter do all the work.\nNow come over here.\nI still owe you one ridiculously long hug.\n🤍` 
        },
        { 
            id: "sick", title: "When You're Sick", theme: "sick", font: "font-sick", paper: "paper-sick",
            envColor: "#EEF7F2", flapColor: "#DCEADD", sealColor: "#7AA387", sealIcon: "🤒",
            preview: "How's my sick baby doing?", greeting: "Excuse me.", 
            ps: "Your mission is simple: drink your water, take your medicine, eat something, and get better.", 
            content: `What is this?\nWho gave you permission to get sick?\nBecause I certainly didn't.\n\nI leave you unsupervised and now you're ill? Unbelievable.\n\nI know you're probably sitting there saying, "I'm fine."\nNo. You're sick. You're officially banned from saying you're fine until I say otherwise.\n\nHave you been drinking enough water? Taken your medicine? Actually rested?\nYeah... that's what I thought.\n\nIf I could, I'd come over with soup, snacks, medicine, and enough blankets to turn you into a burrito.\nI'd make sure you took your medicine, keep reminding you to drink water, and probably ask you every ten minutes if you're feeling better.\nYou'd probably roll your eyes because I'd keep asking if you'd eaten.\n\nYour only job right now is to get better.\nThe world will survive without you being productive for a day or two. I promise.\n\nNow be good. Rest. Sleep as much as you need.` 
        },
        { 
            id: "crying", title: "When You Feel Like Crying", theme: "sad", font: "font-sad", paper: "paper-sad",
            envColor: "#F0F4F8", flapColor: "#DFE8EE", sealColor: "#93A8B8", sealIcon: "💧",
            interactive: "crying", preview: "You don't have to pretend.", greeting: "Hey, love.", 
            ps: "I hope one day you see yourself through my eyes. I think you'd finally understand why you're so easy to love. 🤍" 
        },
        { 
            id: "hungry", title: "When You're Hungry", theme: "warm", font: "font-warm", paper: "paper-warm",
            envColor: "#FFF6ED", flapColor: "#FFEAD4", sealColor: "#D19B71", sealIcon: "🍜",
            interactive: "hungry", preview: "Have you eaten?", greeting: "Ahem.", 
            ps: "This letter is now judging you until you've eaten. 🍜❤️" 
        }
    ];

    const cryingText = `I'm guessing today has been one of those days where you need a little reminder.\nSo let me remind you.\nYou are loved.\nNot because of what you achieve.\nNot because you're always cheerful.\nNot because you're doing everything perfectly.\nYou're loved because you're you.\n\nI wish you could see yourself the way I see you.\nYou'd notice the little things you never give yourself credit for.\nThe way you always remember the tiny details about people.\nThe way your smile somehow makes everything around it feel a little lighter.\nThe way your laugh is so contagious that I can't help but smile too.\n\nYou're so busy worrying about whether you're enough that you forget something important.\nYou've been enough all along.\nYou don't have to earn love. You don't have to compete for it.\nYou already are.\n\nAnd I hope you never think you have to become someone else just to deserve being loved.\nBecause if I'm being honest... I wouldn't change a thing about you.\n\nSo whenever life convinces you that you're difficult to love... read this again.\nBecause I'll keep disagreeing with that thought every single time.\n\nBefore you close this letter... put your hand over your heart for just a second.\nFeel that?\nThat's proof that you've made it through every hard day you've ever had.\nAnd somewhere out there... there's someone who's incredibly grateful that heart belongs to you.`;

    const hungryText = `I have one very important question.\nHave. You. Eaten?\n\nNo, "I'll eat later" is not an acceptable answer.\nNeither is "I forgot."\nAnd absolutely not "I just had coffee." That is not food.\n\nI know you.\nYou'll keep saying, "I'll eat in five minutes." And somehow five minutes turns into three hours.\nWe're not doing that today.\n\nSo here's the deal.\nPause whatever you're doing.\nGo find something to eat.\nI genuinely don't care if it's a full meal, leftovers from yesterday, instant noodles, a sandwich, or breakfast at 4 p.m.\nJust eat something.\n\nYour body has been working hard for you all day. The least you can do is give it some fuel.\nAnd before you say, "I'm not that hungry." You probably are. You've just ignored it long enough that your stomach gave up trying to convince you.\n\nIf you're sitting there thinking, "I don't really have anything to eat." Tell me.\nSeriously. I'll order you food.\nNo arguments. No "it's okay." No "you don't have to."\nI know exactly what you're about to say, and the answer is still no. Let me.\n\nNow... close this letter.\nGo eat.\nThen you can come back and tell me what you had.\nAnd if your answer is, "Nothing." I'm going to pretend to be very disappointed in you. (Okay... not pretend. I actually will be.)\n\nSo go. Shoo.\nYour food is waiting.`;

    // --- 4. The HTML Injection Function ---
    window.injectLettersEngine = function() {
        if (!document.getElementById('drawer-overlay')) {
            const engineHTML = `
                <div id="drawer-overlay">
                    <div class="drawer-header">
                        A Drawer Full Of Days<br>I Couldn't Be There
                        <div class="drawer-subtitle">Pick whichever one your heart needs today.</div>
                    </div>
                    <div id="envelope-grid"></div>
                    <button class="letter-btn" onclick="window.closeDrawer()" style="margin-top: 60px;">🏡 Close Drawer</button>
                    
                    <div id="drawer-toast"></div>
                </div>

                <div id="letter-room">
                    <div id="room-particles"></div>
                    <div class="letter-paper-full" id="active-paper">
                        
                        <div class="paper-content-wrapper" id="paper-wrapper">
                            
                            <div id="dynamic-graphics"></div>

                            <div id="paper-coffee" class="coffee-stain"></div>
                            
                            <div id="paper-margin-note" class="margin-note" style="top: 20px; right: 40px;"></div>

                            <div id="paper-top-note" class="sweet-note-top"></div>

                            <div id="d-tl" class="floating-decor d-tl">🌸</div>
                            <div id="d-br" class="floating-decor d-br">❀</div>
                            
                            <div class="paper-header ink-text" id="paper-title"></div>
                            <div class="paper-greeting ink-text" id="paper-greeting"></div>
                            <div class="paper-body ink-text" id="paper-body"></div>
                            <div id="interactive-zone" style="margin-top: 20px; position:relative; z-index:10;"></div>
                            
                            <div class="paper-footer" id="paper-footer" style="display:none; opacity:0; transition: opacity 1s;">
                                <div class="paper-divider"></div>
                                <div class="ps-box" id="paper-ps-box">
                                    <span class="ps-title ink-text">P.S.</span><br>
                                    <span class="ps-content ink-text" id="paper-ps-content"></span>
                                </div>
                                <div class="signature-text ink-text" id="paper-signature"></div>
                            </div>
                            
                            <div class="letter-controls" id="letter-controls">
                                <button class="letter-btn" onclick="window.backToDrawer()">📖 Read Another</button>
                                <button class="letter-btn" onclick="window.foldLetter()">📩 Fold Letter</button>
                            </div>

                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', engineHTML);

            // 18. LIGHT FOLLOWS MOUSE (FIXED TO FULL SCROLL HEIGHT)
            const paper = document.getElementById('active-paper');
            const wrapper = document.getElementById('paper-wrapper');
            paper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                wrapper.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
                wrapper.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
            });
        }
    };

    window.injectLettersEngine();

    // --- 5. Logic & Animation ---
    let activeLetter = null;
    window.isTyping = false;

    window.openLetters = function() {
        const dash = document.getElementById('main-dashboard');
        const overlay = document.getElementById('drawer-overlay');
        const grid = document.getElementById('envelope-grid');
        
        if(dash) {
            dash.style.transition = 'filter 0.8s ease';
            dash.style.filter = 'blur(12px) brightness(0.7)';
        }
        
        grid.innerHTML = '';
        window.lettersData.forEach(letter => {
            grid.innerHTML += `
                <div class="envelope-container" data-preview="${letter.preview || 'Open letter'}"
                     onmouseenter="window.showPreview(this)" 
                     onmouseleave="window.hidePreview()"
                     onclick="window.openEnvelope('${letter.id}', this)">
                    <div class="envelope-flap" style="border-top-color: ${letter.flapColor};"></div>
                    <div class="envelope-paper-preview"></div>
                    <div class="envelope-body" style="background: ${letter.envColor};">
                        <div class="envelope-label">${letter.title}</div>
                    </div>
                    <div class="wax-seal" style="background: ${letter.sealColor};">${letter.sealIcon}</div>
                </div>
            `;
        });

        overlay.style.display = 'flex';
        setTimeout(() => { overlay.style.opacity = '1'; }, 10);
    };

    window.closeDrawer = function() {
        const dash = document.getElementById('main-dashboard');
        const overlay = document.getElementById('drawer-overlay');
        if(overlay) overlay.style.opacity = '0';
        if(dash) dash.style.filter = 'none';
        setTimeout(() => { if(overlay) overlay.style.display = 'none'; }, 1000);
    };

    // --- FIXED HOVER PREVIEW (Attaches to Envelope) ---
    window.showPreview = function(el) {
        const toast = document.getElementById('drawer-toast');
        if(toast) {
            const rect = el.getBoundingClientRect();
            toast.innerText = el.getAttribute('data-preview');
            toast.style.left = (rect.left + rect.width / 2) + 'px';
            toast.style.top = (rect.bottom + 20) + 'px';
            toast.classList.add('show');
        }
    };
    window.hidePreview = function() {
        const toast = document.getElementById('drawer-toast');
        if(toast) toast.classList.remove('show');
    };

    window.playPaperSound = function() {};

    // Envelope Opening Sequence
    window.openEnvelope = function(id, element) {
        activeLetter = window.lettersData.find(l => l.id === id);
        window.hidePreview();
        element.classList.add('envelope-opening');
        window.playPaperSound();
        
        // --- WHISPER MUSIC FOR LETTERS ---
        let track = window.currentTrack || document.getElementById('bg-dashboard');
        if (track && !track.paused) {
            track.dataset.oldVol = track.volume;
            let fadeDown = setInterval(() => {
                if (track.volume > 0.04) track.volume = Math.max(track.volume - 0.01, 0.04);
                else clearInterval(fadeDown);
            }, 100);
        }
        
        // --- RAIN SOUND EFFECT (Reliable Play) ---
        const rainMusic = document.getElementById('sfx-rain');
        if (rainMusic) {
            rainMusic.volume = 0;
            let playPromise = rainMusic.play();
            if (playPromise !== undefined) playPromise.catch(e => console.log("Rain playback prevented:", e));
            let rainFadeIn = setInterval(() => {
                if (rainMusic.volume < 0.1) rainMusic.volume = Math.min(rainMusic.volume + 0.01, 0.1);
                else clearInterval(rainFadeIn);
            }, 100);
        }

        setTimeout(() => {
            const room = document.getElementById('letter-room');
            const paper = document.getElementById('active-paper');
            const body = document.getElementById('paper-body');
            const footer = document.getElementById('paper-footer');
            const controls = document.getElementById('letter-controls');
            const graphicsContainer = document.getElementById('dynamic-graphics');
            
            document.getElementById('drawer-overlay').style.display = 'none';
            room.className = `bg-${activeLetter.theme}`;
            
            // Theme application
            paper.className = `letter-paper-full ${activeLetter.paper} ${activeLetter.font}`;
            
            // --- INJECT THEMATIC BACKGROUND GRAPHICS ---
            graphicsContainer.innerHTML = ''; 
            const graphics = themeGraphicsMap[activeLetter.theme] || themeGraphicsMap['warm'];
            graphics.forEach(g => {
                const div = document.createElement('div');
                div.className = 'real-pressed-flower';
                div.style.backgroundImage = `url('${g.url}')`;
                div.style.cssText += g.css;
                graphicsContainer.appendChild(div);
            });
            
            // Random Dynamics
            document.getElementById('d-tl').innerText = doodles[Math.floor(Math.random()*doodles.length)];
            document.getElementById('d-br').innerText = doodles[Math.floor(Math.random()*doodles.length)];
            document.getElementById('paper-coffee').style.display = (Math.random() < 0.05) ? 'block' : 'none';
            document.getElementById('paper-margin-note').innerText = (Math.random() < 0.3) ? marginNotes[Math.floor(Math.random()*marginNotes.length)] : '';
            
            // Sweet Note Top 
            let randomTopNote = topNotes[Math.floor(Math.random()*topNotes.length)];
            // Don't repeat the signature in the top note
            while (randomTopNote.includes("always")) {
               randomTopNote = topNotes[Math.floor(Math.random()*topNotes.length)];
            }
            document.getElementById('paper-top-note').innerText = randomTopNote;

            // Setup text
            document.getElementById('paper-title').innerText = activeLetter.title;
            document.getElementById('paper-greeting').innerText = activeLetter.greeting || "";
            document.getElementById('paper-signature').innerHTML = sigs[Math.floor(Math.random()*sigs.length)] + "<br>Muzna";
            
            if(activeLetter.ps) {
                document.getElementById('paper-ps-box').style.display = 'block';
                document.getElementById('paper-ps-content').innerText = activeLetter.ps;
            } else {
                document.getElementById('paper-ps-box').style.display = 'none';
            }

            // Prepare Interactive Zones
            const interactive = document.getElementById('interactive-zone');
            interactive.innerHTML = '';
            body.innerHTML = '';
            footer.style.opacity = '0';
            footer.style.display = 'none';
            controls.style.opacity = '0'; // Hide buttons initially

            room.style.display = 'flex';
            window.startAmbientParticles(activeLetter.theme);
            
            setTimeout(() => { room.style.opacity = '1'; }, 50);
            
            setTimeout(() => { 
                paper.classList.add('paper-ready'); 
                
                // 7. TYPEWRITER REVEAL (SLOWER PACE)
                if (activeLetter.interactive === "crying" || activeLetter.interactive === "hungry") {
                    window.setupInteractive(activeLetter.interactive);
                } else {
                    window.typewriterEffect(body, activeLetter.content, footer);
                }
            }, 1200); 

        }, 1200); 
    };

    window.setupInteractive = function(type) {
        const body = document.getElementById('paper-body');
        const interactive = document.getElementById('interactive-zone');
        if (type === "crying") {
            interactive.innerHTML = `
                <div style="text-align:center; font-family:'Caveat', cursive; font-size: 32px; font-weight:bold; color:inherit; margin:30px 0;">Do you want to talk about it?</div>
                <div style="display:flex; flex-direction:column; gap:15px; align-items:center;">
                    <button class="letter-btn" onclick="window.revealInteractive('crying', 'yes')">Yes.</button>
                    <button class="letter-btn" onclick="window.revealInteractive('crying', 'later')">Not yet.</button>
                    <button class="letter-btn" onclick="window.revealInteractive('crying', 'unknown')">I don't even know why I'm crying.</button>
                </div>
            `;
            window.typewriterEffect(body, "You've been crying, haven't you?\nI can tell.", null);
        } else if (type === "hungry") {
            interactive.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:15px; align-items:center; margin-top:30px;">
                    <button class="letter-btn" onclick="window.revealInteractive('hungry', 'ate')">🍜 I Ate Something</button>
                    <button class="letter-btn" onclick="window.revealInteractive('hungry', 'starving')">😒 I'm Still Not Eating</button>
                </div>
            `;
            window.typewriterEffect(body, hungryText, null);
        }
    };

    // 7. Typewriter Function (SLOWER)
    window.typewriterEffect = async function(container, text, footerElement) {
        window.isTyping = true;
        const lines = text.split('\n');
        const controls = document.getElementById('letter-controls');
        
        for(let i=0; i<lines.length; i++) {
            if(!window.isTyping) break;
            
            if(lines[i].trim() === '') {
                container.appendChild(document.createElement('br'));
                continue;
            }
            
            const span = document.createElement('span');
            if (lines[i].includes('<span')) {
                span.innerHTML = lines[i];
                container.appendChild(span);
                container.appendChild(document.createElement('br'));
                await new Promise(r => setTimeout(r, 600));
                continue;
            }

            container.appendChild(span);
            let lineStr = lines[i];
            
            if (lineStr.trim() === '...') {
                span.innerHTML = '...';
                await new Promise(r => setTimeout(r, 1200)); // Pause on ellipses
            } else {
                for(let j=0; j<lineStr.length; j++) {
                    if(!window.isTyping) { span.innerHTML = lineStr; break; }
                    span.innerHTML += lineStr[j];
                    await new Promise(r => setTimeout(r, 40)); // 40ms per char (slower, deliberate)
                }
            }
            container.appendChild(document.createElement('br'));
            await new Promise(r => setTimeout(r, 450)); // Pause between lines
        }
        
        if (window.isTyping) {
            if(footerElement) {
                footerElement.style.display = 'block';
                setTimeout(() => { footerElement.style.opacity = '1'; }, 100);
            }
            // Fade in buttons naturally after text finishes
            setTimeout(() => { controls.style.opacity = '1'; }, 500);
        }
        window.isTyping = false;
    };

    window.revealInteractive = function(type, response) {
        const body = document.getElementById('paper-body');
        const interactive = document.getElementById('interactive-zone');
        const footer = document.getElementById('paper-footer');
        
        if (type === 'crying') {
            let prefix = "";
            if(response === 'yes') prefix = "I'm listening. Take your time. Whatever is on your mind, I'm here. 💜\n\n";
            if(response === 'later') prefix = "That's okay. You don't have to talk until you're ready. I'll just be here. 🌸\n\n";
            if(response === 'unknown') prefix = "That happens sometimes. Your heart just needs to let it out. You're doing just fine. ☁️\n\n";
            interactive.innerHTML = '';
            body.innerHTML = '';
            window.typewriterEffect(body, prefix + cryingText, footer);
            
        } else if (type === 'hungry') {
            if (response === 'ate') {
                interactive.innerHTML = `<div style="font-family:'Caveat', cursive; font-weight:700; color:inherit; font-size:36px; text-align:center; margin-top:30px; opacity:0; animation: fadeIn 1s forwards;">Good. I'm proud of you. See? That wasn't so hard. 🤍</div>`;
                footer.style.display = 'block';
                setTimeout(() => { footer.style.opacity = '1'; document.getElementById('letter-controls').style.opacity = '1'; }, 100);
            } else {
                interactive.innerHTML = `<div style="font-family:'Caveat', cursive; font-weight:700; color:#FF8BA7; font-size:30px; border: 2px dashed #FF8BA7; padding: 20px; border-radius: 15px; text-align:center; margin-top:30px; opacity:0; animation: fadeIn 1s forwards;">Access denied. Reason: Hungry gremlin detected. Go eat first. 😡</div>`;
            }
        }
    };

    // Ambient Particles based on Theme
    let particleInterval;
    window.startAmbientParticles = function(theme) {
        clearInterval(particleInterval);
        const container = document.getElementById('room-particles');
        container.innerHTML = '';
        
        let type = '✨';
        if(theme === 'sad' || theme === 'sick') type = '💧';
        if(theme === 'happy') type = '🌸';
        if(theme === 'night') type = '⭐';
        if(theme === 'warm') type = '🍂';

        particleInterval = setInterval(() => {
            if(container.childElementCount > 15) return;
            const p = document.createElement('div');
            p.className = 'ambient-p';
            p.innerText = type;
            p.style.left = Math.random() * 100 + 'vw';
            
            if (type === '💧' || type === '🌸' || type === '🍂') {
                p.style.top = '-5vh';
                container.appendChild(p);
                setTimeout(() => p.style.opacity = '0.4', 100);
                setTimeout(() => {
                    p.style.top = '105vh';
                    p.style.transform = `rotate(${Math.random() * 360}deg)`;
                }, 200);
            } else {
                p.style.top = '105vh';
                container.appendChild(p);
                setTimeout(() => p.style.opacity = '0.6', 100);
                setTimeout(() => {
                    p.style.top = '-5vh';
                    p.style.transform = `translateX(${(Math.random() - 0.5) * 100}px)`;
                }, 200);
            }
            setTimeout(() => p.remove(), 15000); 
        }, 2000); 
    };

    // Closing Functions
    window.foldLetter = function() {
        window.isTyping = false; 
        clearInterval(particleInterval);
        const room = document.getElementById('letter-room');
        const paper = document.getElementById('active-paper');
        
        if(paper) paper.classList.remove('paper-ready');
        document.getElementById('letter-controls').style.opacity = '0';
        room.style.opacity = '0';
        window.playPaperSound();
        
        // --- RESTORE MUSIC & STOP RAIN ---
        const rainMusic = document.getElementById('sfx-rain');
        if(rainMusic) {
            let rainFadeOut = setInterval(() => {
                if(rainMusic.volume > 0.02) rainMusic.volume = Math.max(rainMusic.volume - 0.02, 0);
                else { rainMusic.pause(); rainMusic.volume = 0; clearInterval(rainFadeOut); }
            }, 100);
        }

        let track = window.currentTrack || document.getElementById('bg-dashboard');
        if (track && track.dataset.oldVol) {
            let fadeUp = setInterval(() => {
                if (track.volume < parseFloat(track.dataset.oldVol)) track.volume += 0.01;
                else clearInterval(fadeUp);
            }, 100);
        }

        setTimeout(() => { 
            room.style.display = 'none'; 
            window.closeDrawer(); 
        }, 1500);
    };

    window.backToDrawer = function() {
        window.isTyping = false;
        clearInterval(particleInterval);
        const room = document.getElementById('letter-room');
        const paper = document.getElementById('active-paper');
        const overlay = document.getElementById('drawer-overlay');
        
        if(paper) paper.classList.remove('paper-ready');
        document.getElementById('letter-controls').style.opacity = '0';
        room.style.opacity = '0';
        window.playPaperSound();
        
        // --- RESTORE MUSIC & STOP RAIN ---
        const rainMusic = document.getElementById('sfx-rain');
        if(rainMusic) {
            let rainFadeOut = setInterval(() => {
                if(rainMusic.volume > 0.02) rainMusic.volume = Math.max(rainMusic.volume - 0.02, 0);
                else { rainMusic.pause(); rainMusic.volume = 0; clearInterval(rainFadeOut); }
            }, 100);
        }

        let track = window.currentTrack || document.getElementById('bg-dashboard');
        if (track && track.dataset.oldVol) {
            let fadeUp = setInterval(() => {
                if (track.volume < parseFloat(track.dataset.oldVol)) track.volume += 0.01;
                else clearInterval(fadeUp);
            }, 100);
        }

        setTimeout(() => { 
            room.style.display = 'none'; 
            overlay.style.display = 'flex';
            document.querySelectorAll('.envelope-container').forEach(e => e.classList.remove('envelope-opening'));
        }, 1500);
    };

} catch (globalError) {
    alert("CRITICAL ERROR loading letters.js: " + globalError.message);
}
