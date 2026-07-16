// ==========================================================
// 💌 MAGICAL LETTERS ENGINE - "The Vintage Keepsake Edition"
// ==========================================================

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
        
        #envelope-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 80px 40px; width: 90%; max-width: 1100px; }

        .envelope-container { width: 280px; height: 180px; position: relative; cursor: pointer; perspective: 1500px; margin: 0 auto; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), filter 0.6s ease; }
        
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

        /* --- Dashboard-style Hover Toast --- */
        #drawer-toast {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px); 
            padding: 15px 30px; border-radius: 30px;
            background: linear-gradient(90deg, #FFDCEB, #F2ECFF, #DDEEFF, #FFF6CC);
            color: #5D4E75; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1.1rem;
            z-index: 9999; opacity: 0; pointer-events: none;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 2px solid white; white-space: nowrap;
            transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
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
            width: 90%; max-width: 750px; height: 85vh; padding: 80px 60px 180px 60px; 
            border-radius: 2px 5px 3px 6px; /* Deckled torn edge */
            box-shadow: inset 0 0 100px rgba(60, 20, 0, 0.4), 0 20px 50px rgba(60, 20, 0, 0.3); /* Warm Vignette */
            transform: translateY(120px) scale(0.6) rotate(-5deg); opacity: 0; transition: all 1.8s cubic-bezier(0.25, 1, 0.5, 1);
            overflow-y: auto; overflow-x: hidden; position: relative; scroll-behavior: smooth;
        }
        
        /* 6. GENTLE SWAY ANIMATION */
        @keyframes sway { 0% { transform: rotate(1deg) translateY(0); } 50% { transform: rotate(0.6deg) translateY(-2px); } 100% { transform: rotate(1deg) translateY(0); } }
        .paper-ready { transform: rotate(0deg) translateY(0) scale(1); opacity: 1; animation: sway 12s ease-in-out infinite; }
        
        /* 18. LIGHT FOLLOWS MOUSE & 19. REAL PAGE TEXTURE & 11. FOLD MARKS */
        .letter-paper-full::before {
            content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: 
                url("https://www.transparenttextures.com/patterns/aged-paper.png"),
                linear-gradient(to bottom, transparent 33%, rgba(0,0,0,0.04) 33%, rgba(255,255,255,0.04) 34%, transparent 34%),
                linear-gradient(to bottom, transparent 66%, rgba(0,0,0,0.04) 66%, rgba(255,255,255,0.04) 67%, transparent 67%);
            opacity: 0.8; pointer-events: none; z-index: 0; mix-blend-mode: multiply;
        }
        .letter-paper-full::after {
            content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
            background: radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15), transparent);
            pointer-events: none; z-index: 10;
        }

        .letter-paper-full::-webkit-scrollbar { display: none; }
        .paper-content-wrapper { position: relative; z-index: 5; }
        
        /* 4. PAPER SMELLS (Vintage Dried Flowers) */
        .real-pressed-flower {
            position: absolute; z-index: 0; pointer-events: none; background-size: cover; background-position: center;
            mix-blend-mode: multiply; filter: sepia(0.8) contrast(1.2) opacity(0.35); /* Faded look */
            mask-image: radial-gradient(circle, black 40%, transparent 70%); -webkit-mask-image: radial-gradient(circle, black 40%, transparent 70%);
        }

        /* 2. FLOATING DECORATIONS */
        @keyframes drift { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } }
        .floating-decor { position: absolute; font-size: 2rem; opacity: 0.6; z-index: 1; animation: drift 6s ease-in-out infinite; pointer-events:none; }
        .floating-decor.d-tl { top: -20px; left: -20px; }
        .floating-decor.d-br { bottom: -20px; right: -20px; animation-delay: 2s; }

        /* 12. COFFEE STAIN */
        .coffee-stain { position:absolute; top:15%; right:10%; width:180px; height:180px; background:url('https://www.transparenttextures.com/patterns/stucco.png'); border-radius:50%; border: 6px solid rgba(80,40,10,0.12); opacity:0.7; mix-blend-mode:multiply; pointer-events:none; z-index:0; }

        /* 13. MARGIN NOTES */
        .margin-note { position: absolute; font-family: 'Caveat', cursive; font-size: 1.2rem; color: inherit; opacity: 0.4; transform: rotate(-10deg); z-index: 5; pointer-events:none; }

        /* 16. TIMESTAMPS */
        .timestamp { font-family: 'Cormorant Garamond', serif; font-size: 1rem; opacity: 0.5; text-align: left; margin-bottom: 30px; font-style: italic; }

        /* --- 5. DIFFERENT HANDWRITING FOR EMOTIONS --- */
        .font-happy { font-family: 'Caveat', cursive; font-size: 26px; }
        .font-sad { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 24px; }
        .font-night { font-family: 'Marck Script', cursive; font-size: 28px; }
        .font-motivation { font-family: 'Handlee', cursive; font-size: 24px; }
        .font-sick { font-family: 'Patrick Hand', cursive; font-size: 24px; }
        .font-warm { font-family: 'Caveat', cursive; font-size: 26px; }
        
        /* 3. TINY INK IMPERFECTIONS */
        .ink-text { text-shadow: 0 0 1px rgba(0,0,0,.08), 0 1px 0 rgba(0,0,0,.05); line-height: 2.1; white-space: pre-wrap; font-weight: 500;}
        .paper-night .ink-text { text-shadow: 0 0 2px rgba(255,255,255,0.15); } /* Glow for dark paper */

        .paper-header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 15px; font-weight: 700; font-size: 1.3em;}
        .paper-greeting { margin-bottom: 30px; font-weight: 700; font-size: 1.2em;}
        
        .paper-divider { border-bottom: 2px dashed rgba(0,0,0,0.1); width: 40%; margin: 40px auto; }
        .ps-box { text-align: left; margin-top: 40px; opacity: 0.9; transform: scale(0.95); transform-origin: left; }
        .signature-text { text-align: right; line-height: 1.2; font-weight: 700; margin-top: 60px; margin-right: 40px; font-size: 1.4em;}
        .you-exist { display: block; margin: 30px 0; text-align: center; opacity: 0.6; font-weight: 700; font-style: italic;}

        .letter-controls { position: fixed; bottom: 30px; display: flex; gap: 20px; z-index: 3100; opacity: 0; transition: opacity 1s ease; }
        .letter-btn { background: rgba(255,255,255,0.85); border: 1px solid rgba(200, 180, 220, 0.5); color: #5D4E75; padding: 12px 25px; border-radius: 30px; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: all 0.3s; backdrop-filter: blur(5px); }
        .letter-btn:hover { background: #FFFDF9; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        #room-particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; overflow: hidden; }
        .ambient-p { position: absolute; transition: all linear; opacity: 0; }
    `;
    document.head.appendChild(letterStyles);

    // --- Dynamic Data Generators ---
    const sigs = ["♡ Always.", "Take care of yourself.\nPromise?", "Until next time.", "Yours, truly.", "Thinking of you."];
    const notes = ["♡", "Don't skip lunch!!", "You look cute today :)", "Drink water.", "You got this."];
    const doodles = ["🌸", "☁️", "♡", "⭐", "🐇"];

    // --- 3. The Letter Data (Deeply Expanded Content) ---
    window.lettersData = [
        { 
            id: "insecure", title: "When You're Feeling Insecure", theme: "warm", font: "font-warm", paper: "paper-warm",
            envColor: "#F2E3D5", flapColor: "#E8D5C4", sealColor: "#A67B5B", sealIcon: "✨", 
            preview: "Borrow my eyes for a minute.",
            greeting: "Hey, pretty girl.", 
            ps: "If your brain keeps saying mean things about you, send it to me. I'd like to have a word with it.", 
            content: `I need to ask you something.\nWho exactly convinced you that you weren't enough?\nBecause I'd like to have a very serious conversation with them.\n\nI know what it looks like when you get quiet. You start replaying every tiny mistake. You zoom in on every flaw. You convince yourself that everyone else has it figured out and you're the only one falling behind.\n\nI wish you could borrow my eyes for just one minute.\nIf you could see the way your face lights up when you talk about things you love...\nIf you could see how easily you make people feel safe...\nIf you could see how ridiculously beautiful you are even when you're just existing in a room...\nYou would never doubt yourself again.\n\nI'd probably steal your blanket right now and force you to listen to me list all the reasons you're amazing.\nYou'd roll your eyes, but I wouldn't stop.\n\nYou don't have to be perfect to be loved.\nYou just have to be you. The world doesn't need a flawless version of you.\nIt just needs *you*.\n\nSo please, be a little kinder to yourself today.\nTalk to yourself the way you talk to people you love.\n\nI'll keep reminding you until you believe it.` 
        },
        { 
            id: "nosleep", title: "When You Can't Sleep", theme: "night", font: "font-night", paper: "paper-night",
            envColor: "#1A2235", flapColor: "#111826", sealColor: "#C0C0D0", sealIcon: "🌙",
            preview: "It's very late, isn't it?",
            greeting: "Hey, sleepyhead.", 
            ps: "Sleep. That's an order. (A very loving one.)", 
            content: `You're awake again, aren't you?\nI knew it.\nInstead of sleeping like a normal person, you're reading letters on a website.\nHonestly... that's kind of cute.\n\nI know why you're awake.\nThe house gets quiet, the distractions stop, and suddenly your brain decides it's the perfect time to review everything that happened since 2014.\nEvery awkward moment.\nEvery unresolved worry.\nEvery thing you have to do tomorrow.\n\nIf I was sitting beside you right now, I'd probably pull the phone out of your hands.\nI'd hand you a warm mug of tea and pretend I wasn't worried about you.\nWe'd talk until your eyes couldn't stay open anymore.\n\nBut since I can't do that...\nI need you to do it for yourself.\nTake a slow breath.\nRelease the tension in your jaw.\nDrop your shoulders.\n\nYou don't have to solve tomorrow tonight.\nTomorrow's problems belong to tomorrow's version of you.\nTonight's version of you only has one job: to rest.\n\nClose your eyes.\nI'll meet you in tomorrow.` 
        },
        { 
            id: "smile", title: "When You Need A Smile", theme: "happy", font: "font-happy", paper: "paper-happy",
            envColor: "#FFFAF0", flapColor: "#F5EEDC", sealColor: "#FFD166", sealIcon: "😊",
            preview: "Smile inspection.",
            greeting: "Well... look who showed up.", 
            ps: "If you're still refusing to smile, I'm going to assume you're just being stubborn.", 
            content: `Excuse me.\nYes, you.\nSmile inspection. I'm waiting.\n...\nWas that a smile?\nNo?\nLooks like I'm going to have to work a little harder.\n\nCan I tell you something?\nOne of my favorite things about you is how easily you make other people smile.\nWhich is honestly a little unfair. Because now I have to compete with that.\n\nSo here's my attempt.\nYou're ridiculously cute.\nYou have the most contagious laugh.\nYou somehow make even the most ordinary conversations memorable.\nAnd you look really pretty when you're smiling.\n\nYes. That was absolutely me trying to convince you to smile.\nDid it work?\nI hope so. Because I'd hate to lose this very important competition.\n\nNow...\nSmile for me.\nJust a little.\n...\nThere it is.\nI knew I'd win eventually.` 
        },
        { 
            id: "down", title: "When You're Feeling Down", theme: "sad", font: "font-sad", paper: "paper-sad",
            envColor: "#EEF5F8", flapColor: "#DCE6EA", sealColor: "#9BAEBC", sealIcon: "🌧",
            preview: "I know today probably wasn't your favorite.",
            greeting: "Hi, sunshine.", 
            ps: "Today's allowed to be a bad day. Just don't let it convince you that you're having a bad life.", 
            content: `I don't know what happened today.\nMaybe something huge happened.\nMaybe nothing actually happened at all.\nMaybe it was just one of those strange days where everything felt heavier than it should have.\n\nYou woke up already tired.\nSmall things felt bigger.\nPeople were a little colder.\nAnd somehow by the time you got here... you just didn't have much left in you.\n\nYou know something funny?\nI think everyone has days like that. The difference is that nobody really talks about them. We all walk around pretending we're completely okay while secretly hoping someone notices we're carrying a little too much.\n\nI wish I could knock on your door right now.\nI wouldn't ask you a hundred questions.\nI wouldn't tell you to "cheer up."\nI'd probably just sit next to you.\nMaybe we'd make tea. Maybe we'd watch something stupid. Maybe we'd just sit in silence. Because sometimes people don't need solutions. Sometimes they just need company.\n\nTake a breath.\n...\nAgain.\nI'm serious.\n\nIf today feels impossible... don't try to fix your entire life tonight.\nDrink some water. Eat something warm. Get under your blanket.\nThose tiny things are still victories.\n\nAnd if tomorrow isn't any better... come back.\nThis letter isn't going anywhere. Neither am I.` 
        },
        { 
            id: "angry", title: "When You're Angry", theme: "sad", font: "font-angry", paper: "paper-angry",
            envColor: "#E6E4E5", flapColor: "#D6D3D5", sealColor: "#7A6894", sealIcon: "🌩",
            preview: "Okay... who annoyed you?",
            greeting: "Well... someone's grumpy.", 
            ps: "Before you start plotting someone's downfall... maybe have a snack first.", 
            content: `Okay, who do I need to fight?\nI'm kidding.\n...\nMostly.\n\nI can tell you're frustrated. Someone or something completely tested your patience today, and you have every right to be mad about it.\n\nI'm not going to tell you to calm down. That has literally never worked in the history of humanity.\n\nIf I was there, you'd probably be pacing the room ranting, and I'd be sitting there nodding aggressively, saying, "Wow, they actually did that? Unbelievable."\n\nBut since I can't be there... take a deep breath.\nDrink some cold water.\n\nDon't let someone else's nonsense ruin your entire day.\nYour energy is way too precious to waste on things that won't matter next week.\n\nPunch a pillow if you have to.\nThen go do something that makes you happy.\nThey don't get to steal your peace.` 
        },
        { 
            id: "motivation", title: "When You Need Motivation", theme: "happy", font: "font-motivation", paper: "paper-motivation",
            envColor: "#FCF6E5", flapColor: "#EAE2CC", sealColor: "#FFA366", sealIcon: "🌅",
            preview: "One step is enough.",
            greeting: "Hey, you.", 
            ps: "One step is still progress. Don't underestimate how far tiny steps can take you.", 
            content: `I know starting is sometimes the hardest part.\nYou keep waiting until you feel motivated enough. Confident enough. Ready enough.\n\nCan I tell you a secret?\nAlmost nobody feels completely ready.\nThey just start anyway.\n\nYou look at the whole mountain and it feels terrifying. But you don't have to climb the whole mountain right now.\nYou just have to take the next step.\n\nRemember when you thought you couldn't pass that last hurdle, but you did?\nI remember.\nI watched you do it.\n\nSo don't worry about taking huge steps today.\nTake one small one. Then another.\nTiny progress is still progress.\n\nYou've got this.\nEven if today's version of "got this" looks different from yesterday's.` 
        },
        { 
            id: "sick", title: "When You're Sick", theme: "sick", font: "font-sick", paper: "paper-sick",
            envColor: "#EEF7F2", flapColor: "#DCEADD", sealColor: "#7AA387", sealIcon: "🤒",
            preview: "How's my sick baby doing?",
            greeting: "Excuse me.", 
            ps: "Your mission is simple: drink your water, take your medicine, eat something, and get better.", 
            content: `What is this?\nWho gave you permission to get sick?\nBecause I certainly didn't.\n\nI leave you unsupervised and now you're ill? Unbelievable.\n\nI know you're probably sitting there saying, "I'm fine."\nNo. You're sick. You're officially banned from saying you're fine until I say otherwise.\n\nHave you been drinking enough water? Taken your medicine? Actually rested?\nYeah... that's what I thought.\n\nIf I could, I'd come over with soup, snacks, medicine, and enough blankets to turn you into a burrito.\nI'd make sure you took your medicine, keep reminding you to drink water, and probably ask you every ten minutes if you're feeling better.\nYou'd probably roll your eyes because I'd keep asking if you'd eaten.\n\nYour only job right now is to get better.\nThe world will survive without you being productive for a day or two. I promise.\n\nNow be good. Rest. Sleep as much as you need.` 
        }
    ];

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
                        
                        <!-- 4. VISUAL SMELLS: FADED DRIED FLOWERS -->
                        <div class="real-pressed-flower" style="background-image: url('https://images.unsplash.com/photo-1611078713009-3c72b22033bc?auto=format&fit=crop&w=300&q=80'); top: -10px; left: -10px; width: 180px; height: 180px; transform: rotate(15deg);"></div>
                        <div class="real-pressed-flower" style="background-image: url('https://images.unsplash.com/photo-1596785236251-71fa49ac5760?auto=format&fit=crop&w=300&q=80'); bottom: 20%; right: -20px; width: 150px; height: 150px; transform: rotate(-35deg);"></div>
                        <div class="real-pressed-flower" style="background-image: url('https://images.unsplash.com/photo-1605721216062-972179612984?auto=format&fit=crop&w=300&q=80'); top: 35%; left: -20px; width: 140px; height: 140px; transform: rotate(45deg);"></div>

                        <div class="paper-content-wrapper">
                            
                            <!-- 12. COFFEE STAIN -->
                            <div id="paper-coffee" class="coffee-stain"></div>
                            
                            <!-- 13. MARGIN NOTE -->
                            <div id="paper-margin-note" class="margin-note" style="top: 20px; right: 40px;"></div>

                            <!-- 2. FLOATING DECORATIONS -->
                            <div id="d-tl" class="floating-decor d-tl">🌸</div>
                            <div id="d-br" class="floating-decor d-br">❀</div>
                            
                            <!-- 16. TIMESTAMPS -->
                            <div id="paper-timestamp" class="timestamp"></div>
                            
                            <div class="paper-header ink-text" id="paper-title"></div>
                            <div class="paper-greeting ink-text" id="paper-greeting"></div>
                            <div class="paper-body ink-text" id="paper-body"></div>
                            
                            <div class="paper-footer" id="paper-footer" style="display:none; opacity:0; transition: opacity 1s;">
                                <div class="paper-divider"></div>
                                <div class="ps-box" id="paper-ps-box">
                                    <span class="ps-title ink-text">P.S.</span><br>
                                    <span class="ps-content ink-text" id="paper-ps-content"></span>
                                </div>
                                <div class="signature-text ink-text" id="paper-signature"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="letter-controls" id="letter-controls">
                        <button class="letter-btn" onclick="window.backToDrawer()">📖 Read Another</button>
                        <button class="letter-btn" onclick="window.foldLetter()">📩 Fold Letter</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', engineHTML);

            // 18. LIGHT FOLLOWS MOUSE
            const paper = document.getElementById('active-paper');
            paper.addEventListener('mousemove', (e) => {
                const rect = paper.getBoundingClientRect();
                paper.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
                paper.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
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

    window.showPreview = function(el) {
        const toast = document.getElementById('drawer-toast');
        if(toast) {
            toast.innerText = el.getAttribute('data-preview');
            toast.classList.add('show');
        }
    };
    window.hidePreview = function() {
        const toast = document.getElementById('drawer-toast');
        if(toast) toast.classList.remove('show');
    };

    // 8. PAGE TURNING SOUND HOOK
    window.playPaperSound = function() {
        // You can drop a tiny paper-rustle base64 audio here if needed, 
        // or just rely on the visual animation.
    };

    // Envelope Opening Sequence (15. Paper Lifts)
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
        
        // --- RAIN SOUND EFFECT ---
        const rainMusic = document.getElementById('sfx-rain');
        if (rainMusic) {
            rainMusic.volume = 0;
            let playPromise = rainMusic.play();
            if (playPromise !== undefined) playPromise.catch(e => console.log(e));
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
            
            document.getElementById('drawer-overlay').style.display = 'none';
            room.className = `bg-${activeLetter.theme}`;
            
            // 1. Theme application
            paper.className = `letter-paper-full ${activeLetter.paper} ${activeLetter.font}`;
            
            // Generate Random Dynamics
            document.getElementById('d-tl').innerText = doodles[Math.floor(Math.random()*doodles.length)];
            document.getElementById('d-br').innerText = doodles[Math.floor(Math.random()*doodles.length)];
            document.getElementById('paper-coffee').style.display = (Math.random() < 0.05) ? 'block' : 'none';
            document.getElementById('paper-margin-note').innerText = (Math.random() < 0.3) ? notes[Math.floor(Math.random()*notes.length)] : '';
            
            // 16. Timestamps
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            document.getElementById('paper-timestamp').innerText = `Written for you at ${time}\non a quiet ${days[new Date().getDay()]}.`;

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

            body.innerHTML = '';
            footer.style.opacity = '0';
            footer.style.display = 'none';

            room.style.display = 'flex';
            window.startAmbientParticles(activeLetter.theme);
            
            setTimeout(() => { room.style.opacity = '1'; }, 50);
            
            setTimeout(() => { 
                paper.classList.add('paper-ready'); 
                document.getElementById('letter-controls').style.opacity = '1';
                
                // 7. TYPEWRITER REVEAL
                window.typewriterEffect(body, activeLetter.content, footer);
            }, 1200); 

        }, 1200); 
    };

    // 7. Typewriter Function
    window.typewriterEffect = async function(container, text, footerElement) {
        window.isTyping = true;
        const lines = text.split('\n');
        
        for(let i=0; i<lines.length; i++) {
            if(!window.isTyping) break;
            
            if(lines[i].trim() === '') {
                container.appendChild(document.createElement('br'));
                continue;
            }
            
            const span = document.createElement('span');
            // Check for HTML injection (for the "you-exist" voice notes)
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
                await new Promise(r => setTimeout(r, 1000));
            } else {
                for(let j=0; j<lineStr.length; j++) {
                    if(!window.isTyping) { span.innerHTML = lineStr; break; }
                    span.innerHTML += lineStr[j];
                    await new Promise(r => setTimeout(r, 20)); // 20ms per char
                }
            }
            container.appendChild(document.createElement('br'));
            await new Promise(r => setTimeout(r, 300));
        }
        
        if (window.isTyping) {
            footerElement.style.display = 'block';
            setTimeout(() => { footerElement.style.opacity = '1'; }, 100);
        }
        window.isTyping = false;
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
                setTimeout(() => p.style.opacity = '0.3', 100);
                setTimeout(() => {
                    p.style.top = '105vh';
                    p.style.transform = `rotate(${Math.random() * 360}deg)`;
                }, 200);
            } else {
                p.style.top = '105vh';
                container.appendChild(p);
                setTimeout(() => p.style.opacity = '0.4', 100);
                setTimeout(() => {
                    p.style.top = '-5vh';
                    p.style.transform = `translateX(${(Math.random() - 0.5) * 100}px)`;
                }, 200);
            }
            setTimeout(() => p.remove(), 15000); 
        }, 2000); 
    };

    // 20. ENDING RITUAL (Closing Sequence)
    window.foldLetter = function() {
        window.isTyping = false; // Stop typewriter
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
