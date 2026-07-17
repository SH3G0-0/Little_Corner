// ==========================================================
// 💌 MAGICAL LETTERS ENGINE - BULLETPROOF VERSION
// ==========================================================

try {
    // --- 1. Load Storybook & Handwritten Fonts ---
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Serif+Display&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // --- 2. The Magical CSS ---
    const letterStyles = document.createElement('style');
    letterStyles.innerHTML = `
        #drawer-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(242, 236, 255, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            display: none; flex-direction: column; align-items: center; z-index: 2000;
            opacity: 0; transition: opacity 0.8s ease; overflow-y: auto; padding-bottom: 50px;
        }

        .drawer-header {
            font-family: 'DM Serif Display', serif; color: #5D4E75; text-align: center;
            margin: 60px 0 40px 0; font-size: 2.2rem;
        }

        #envelope-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 40px; width: 90%; max-width: 900px;
        }

        .envelope-container {
            width: 240px; height: 160px; position: relative; cursor: pointer;
            perspective: 1000px; margin: 0 auto;
            transition: transform 0.4s ease, filter 0.4s ease;
        }
        
        .envelope-body {
            position: absolute; bottom: 0; width: 100%; height: 100%;
            background: #FFF7F2; border-radius: 12px;
            box-shadow: 0 10px 25px rgba(90, 74, 120, 0.1);
            display: flex; justify-content: center; 
            align-items: flex-end; /* Anchors the text to the bottom */
            padding-bottom: 20px; /* Keeps it from hitting the very edge */
            box-sizing: border-box;
            text-align: center;
            border: 2px solid white; z-index: 3;
        }
        
        .envelope-label {
            font-family: 'Caveat', cursive; font-size: 1.4rem; color: #5D4E75;
            padding: 0 15px; line-height: 1.1; z-index: 4; font-weight: 600;
        }

        .envelope-flap {
            position: absolute; top: 0; left: 0; width: 0; height: 0;
            border-left: 120px solid transparent; border-right: 120px solid transparent;
            border-top: 85px solid #F8DDE8; z-index: 5;
            transform-origin: top; transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            filter: drop-shadow(0 5px 5px rgba(0,0,0,0.05));
        }

        .envelope-paper-preview {
            position: absolute; top: 10px; left: 15px; width: 210px; height: 140px;
            background: #FFF8F0; border-radius: 8px; z-index: 2;
            transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            display: flex; justify-content: center; font-size: 2rem; opacity: 0;
        }

        .wax-seal {
            position: absolute; top: 70px; left: 100px; width: 40px; height: 40px;
            background: #FF8BA7; border-radius: 50%; z-index: 6;
            display: flex; justify-content: center; align-items: center; color: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-size: 1rem;
            transition: opacity 0.3s;
        }

        .envelope-container:hover { transform: translateY(-10px); filter: drop-shadow(0 15px 25px rgba(90, 74, 120, 0.15)); }
        .envelope-container:hover .envelope-flap { transform: rotateX(180deg); z-index: 1; }
        .envelope-container:hover .wax-seal { opacity: 0; }
        .envelope-container:hover .envelope-paper-preview { transform: translateY(-30px); opacity: 1; }

        .envelope-opening .envelope-flap { transform: rotateX(180deg); z-index: 1; }
        .envelope-opening .wax-seal { opacity: 0; }
        .envelope-opening .envelope-paper-preview { transform: translateY(-150px) scale(1.5); opacity: 1; transition: transform 1.2s ease; }

        #letter-room {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            display: none; justify-content: center; align-items: center; z-index: 3000;
            opacity: 0; transition: opacity 1s ease;
        }

        .bg-sad { background: linear-gradient(135deg, #A8B8FF, #E6E6FA); }
        .bg-happy { background: linear-gradient(135deg, #FFF6CC, #FFDCEB); }
        .bg-night { background: linear-gradient(135deg, #2B2D42, #1a1a2e); }
        .bg-sick { background: linear-gradient(135deg, #E2F0CB, #F2ECFF); }
        .bg-warm { background: linear-gradient(135deg, #FFD1DC, #FFE4E1); }

        .letter-paper-full {
            background-color: #FFF8F0;
            width: 90%; max-width: 700px; max-height: 85vh;
            padding: 70px 70px 140px 70px; /* Increased bottom padding to clear the buttons */
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
            transform: rotate(2deg) translateY(50px); opacity: 0;
            transition: all 1.2s cubic-bezier(0.25, 1, 0.5, 1);
            overflow-y: auto; overflow-x: hidden; position: relative;
        }
        
        .letter-paper-full::before {
            content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.04; pointer-events: none; z-index: 0; mix-blend-mode: multiply;
        }
        
        .letter-paper-full::-webkit-scrollbar { display: none; }
        .paper-ready { transform: rotate(1deg) translateY(0); opacity: 1; }

        .paper-content-wrapper { position: relative; z-index: 1; }
        .decor-top-left { position: absolute; top: 30px; left: 35px; font-size: 1.5rem; opacity: 0.8; z-index: 1; }
        .decor-bottom-right { position: absolute; bottom: 30px; right: 35px; font-size: 1.5rem; opacity: 0.8; z-index: 1; }

        .paper-header { font-family: 'DM Serif Display', serif; font-size: 44px; color: #5D4E75; text-align: center; margin-bottom: 50px; line-height: 1.2; }
        .paper-header-lines { font-size: 1.2rem; opacity: 0.4; letter-spacing: 2px; font-weight: normal; }
        .paper-greeting { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: #4B4453; font-weight: 600; margin-bottom: 20px; font-style: italic; }
        .paper-body { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #4B4453; line-height: 2; white-space: pre-wrap; text-align: left; font-weight: 500; }

        .paper-divider { text-align: center; color: #D8C8E8; font-size: 1.2rem; letter-spacing: 2px; margin: 50px 0; font-family: 'Arial', sans-serif; }
        .ps-box { text-align: left; margin-bottom: 40px; }
        .ps-title { font-family: 'Caveat', cursive; font-size: 26px; color: #4B4453; font-weight: 700; }
        .ps-content { font-family: 'Caveat', cursive; font-size: 24px; color: #4B4453; line-height: 1.6; font-weight: 600;}

        .signature-text { font-family: 'Caveat', cursive; font-size: 32px; color: #8B6F97; text-align: center; line-height: 1.2; font-weight: 700; }

        .letter-controls { position: fixed; bottom: 30px; display: flex; gap: 20px; z-index: 3100; opacity: 0; transition: opacity 1s ease; }
        .letter-btn { background: rgba(255,255,255,0.85); border: 2px solid white; color: #5D4E75; padding: 15px 30px; border-radius: 30px; font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 1.1rem; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: all 0.3s; }
        .letter-btn:hover { background: #E7D7F7; transform: translateY(-5px); }

        #sleepy-companion { position: fixed; bottom: -100px; right: 30px; z-index: 9999; transition: bottom 1.5s cubic-bezier(0.25, 1, 0.5, 1); display: flex; align-items: flex-end; gap: 10px; pointer-events: none; }
        .companion-bubble { background: white; padding: 15px 20px; border-radius: 20px 20px 0 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); font-family: 'Quicksand'; font-weight: 700; font-size: 1rem; color: #5D4E75; margin-bottom: 40px; }
    `;
    document.head.appendChild(letterStyles);

    // --- 3. The Letter Data ---
    window.lettersData = [
        { id: "insecure", icon: "✨", theme: "warm", title: "Open When You're Feeling Insecure", greeting: "Hey, pretty girl.", closing: "Always rooting for you,", ps: "If your brain keeps saying mean things about you, send it to me. I'd like to have a word with it.", content: `Come here for a second.\n\nI need to ask you something.\n\nWho exactly convinced you that you weren't enough?\n\nBecause I'd like to have a very serious conversation with them.\n\nYou know what I see when I look at you?\n\nI see someone with the prettiest smile.\n\nSomeone whose laugh can instantly make my day better.\n\nSomeone who's kind in ways she doesn't even notice.\n\nSomeone who somehow manages to make ordinary moments feel special.\n\nAnd yes...\n\nSomeone who's ridiculously pretty.\n\nSeriously.\n\nWho could even dislike you?\n\nLook at you.\n\nYou're adorable.\n\nYou're funny.\n\nYou're caring.\n\nYou're beautiful.\n\nHonestly, I think your brain just enjoys making things up sometimes.\n\nSo the next time you start picking yourself apart...\n\nBorrow my eyes for a little while.\n\nBecause I promise I'd never look at you the way you sometimes look at yourself.\n\nYou're so much kinder than you give yourself credit for.\n\nAnd so much prettier than you believe.` },
        { id: "reassurance", icon: "🤍", theme: "warm", title: "Open When You Need Reassurance", greeting: "Hey, love.", closing: "Until next time,", ps: "You don't have to ask if I'm free. Just call. We'll figure the rest out later. ❤️", content: `Can I be selfish for a second?\n\nI need you to promise me something.\n\nPromise me that when you're struggling...\n\nYou won't immediately decide to deal with everything on your own.\n\nI know that's what you usually do.\n\nYou tell yourself you'll figure it out.\n\nYou convince yourself you don't want to bother anyone.\n\nBut if there's one person I never want you to hesitate to bother...\n\nIt's me.\n\nSeriously.\n\nIf you're sad...\n\nCall me.\n\nIf you're angry...\n\nCall me.\n\nIf you're crying...\n\nCall me.\n\nIf you just had the best day ever and you're excited...\n\nPlease call me.\n\nI want to hear all of it.\n\nThe good days.\n\nThe bad days.\n\nThe completely random "guess what happened today" stories.\n\nI don't just want to be around for your best moments.\n\nI want to be there for all of them.\n\nSo don't ever think you're too much.\n\nYou could never be too much for me.` },
        { id: "nosleep", icon: "🌙", theme: "night", title: "Open When You Can't Sleep", greeting: "Hey, sleepyhead.", closing: "Go to sleep.<br>I'll know if you don't. ♡", ps: "Sleep. That's an order. (A very loving one.)", content: `You're awake again, aren't you?\n\nI knew it.\n\nInstead of sleeping like a normal person, you're reading letters on a website.\n\nHonestly...\n\nThat's kind of cute.\n\nI wish I was there.\n\nI'd probably tell you to put your phone away...\n\nAnd then I'd immediately start another conversation that keeps us awake for another hour.\n\nNot exactly helpful.\n\nBut at least we'd both be awake together.\n\nIf your mind won't slow down tonight, don't fight it.\n\nTake a deep breath.\n\nWrap yourself up in your blanket.\n\nListen to your favorite song.\n\nThink about one happy memory instead of a hundred stressful ones.\n\nTomorrow will come whether you worry tonight or not.\n\nSo you might as well let yourself rest.\n\nAnd if you're still awake after this...\n\nText me.\n\nOdds are I probably am too.` },
        { id: "smile", icon: "🌼", theme: "happy", title: "Open When You Need a Smile", greeting: "Well... look who showed up.", closing: "Now go smile.", ps: "If you're still refusing to smile, I'm going to assume you're just being stubborn.", content: `Excuse me.\n\nYes, you.\n\nSmile inspection.\n\nI'm waiting.\n\n...\n\nWas that a smile?\n\nNo?\n\nHmm.\n\nLooks like I'm going to have to work a little harder.\n\nCan I tell you something?\n\nOne of my favorite things about you is how easily you make other people smile.\n\nWhich is honestly a little unfair.\n\nBecause now I have to compete with that.\n\nSo here's my attempt.\n\nYou're ridiculously cute.\n\nYou have the most contagious laugh.\n\nYou somehow make even the most ordinary conversations memorable.\n\nAnd you look really pretty when you're smiling.\n\nYes.\n\nThat was absolutely me trying to convince you to smile.\n\nDid it work?\n\nI hope so.\n\nBecause I'd hate to lose this very important competition.\n\nNow...\n\nSmile for me.\n\nJust a little.\n\nThere it is.\n\nI knew I'd win eventually.` },
        { id: "down", icon: "🌧", theme: "sad", title: "Open When You're Feeling Down", greeting: "Hi, sunshine.", closing: "Your favorite person 🤍", ps: "Today's allowed to be a bad day. Just don't let it convince you that you're having a bad life. Those are two very different things.", content: `I don't know what happened today, but I'm guessing it wasn't exactly your favorite day.\n\nFirst of all... I'm sorry.\n\nSecond of all... before your brain starts making today seem like the end of the world, let's calm it down for a second.\n\nOne bad day doesn't mean you're having a bad life.\n\nOne mistake doesn't undo all the good you've done.\n\nOne rough moment doesn't suddenly make you any less wonderful.\n\nI know it's easier to believe the bad things than the good ones. Our brains are kind of weird like that.\n\nSo until your brain decides to behave, let me do the thinking for both of us.\n\nYou're doing okay.\n\nMaybe not perfect.\n\nMaybe not amazing.\n\nBut okay is enough.\n\nTomorrow is a completely different day, and you don't have to carry today's weight into it.\n\nNow go do something nice for yourself.\n\nYou deserve at least one nice thing today.` },
        { id: "miss", icon: "🧸", theme: "warm", title: "Open When You Miss Me", greeting: "Oh! It's you again.", closing: "Waiting for you,", ps: "Stop reading this and come find me already. I think I've waited long enough.", content: `So...\n\nYou clicked on this one.\n\nInteresting.\n\nMissing me already?\n\nYou're such a weirdo.\n\n...\n\nI mean, I get it.\n\nI'm pretty cool.\n\nI'm kidding.\n\n(Kind of.)\n\nI wish I knew what made you open this letter. Maybe today was just one of those days where you wanted someone familiar around. If that's the case, I hope this is enough until we can actually hang out.\n\nI like knowing that even when we're doing our own thing, we still somehow end up thinking about each other.\n\nThat's nice.\n\nLife gets busy, people get caught up in things, and sometimes days pass faster than we'd like.\n\nBut none of that changes the fact that I'm always happy to hear from you.\n\nSo don't overthink it.\n\nSend the text.\n\nCall me.\n\nSend me a meme.\n\nTell me something random.\n\nOr just say "hi."\n\nI promise I won't mind.\n\nNow stop sitting there smiling at your screen.\n\nIt's making you look suspicious.` },
        { id: "exam", icon: "📚", theme: "happy", title: "Open Before An Exam", greeting: "Hello, trouble.", closing: "You've got this,", ps: "If you finish the exam and immediately start overthinking every answer, I'm legally obligated to tell you to stop. You can't change the answers anymore, so go celebrate surviving instead.", content: `Alright.\n\nDeep breath.\n\nNo, seriously.\n\nTake one.\n\nDone?\n\nGood.\n\nI know you're probably sitting there thinking about everything you don't know instead of everything you've already studied.\n\nThat's just your brain being dramatic again.\n\nYou've worked hard.\n\nYou've put the time in.\n\nAnd now the only thing left to do is trust yourself.\n\nDon't let one question throw you off.\n\nIf you don't know the answer, move on.\n\nCome back later.\n\nOne difficult question doesn't decide the whole exam.\n\nAnd one exam definitely doesn't decide your future.\n\nJust do your best.\n\nThat's all anyone—including me—could ever ask of you.\n\nI'm already proud of you.\n\nNow go show that exam who's actually in charge.` },
        { id: "overthinking", icon: "🌌", theme: "night", title: "Open When You're Overthinking", greeting: "Hey. Yeah, you.", closing: "Take a breath,", ps: "Your brain is grounded for the rest of the day. It has officially lost overthinking privileges.", content: `Let me guess.\n\nYou've replayed the same conversation at least twelve times already.\n\nYou've imagined seventeen different outcomes.\n\nYou've somehow convinced yourself that the worst possible scenario is definitely going to happen.\n\nSound about right?\n\nYour brain deserves an award.\n\nNot for being correct.\n\nJust for having an incredible imagination.\n\nTake a breath.\n\nNot every awkward moment is remembered forever.\n\nNot every unanswered message means something's wrong.\n\nNot every silence needs filling.\n\nSometimes things are just...\n\nNormal.\n\nGive yourself a break.\n\nYou don't have to solve tomorrow tonight.\n\nAnd you definitely don't have to fight battles that only exist in your imagination.\n\nYour brain means well.\n\nIt's just being a little dramatic today.` },
        { id: "longday", icon: "🍂", theme: "warm", title: "Open After A Long Day", greeting: "There you are. I've been waiting for you.", closing: "Rest now,", ps: "Your only assignment tonight is to rest. Yes, this assignment is graded. Yes, I'll know if you don't do it.", content: `Welcome back.\n\nYou made it.\n\nI don't know whether today was amazing, terrible, or just painfully average.\n\nBut it's over now.\n\nAnd honestly?\n\nI'm glad.\n\nBecause now you can finally stop carrying everything around.\n\nYou don't have to answer every message tonight.\n\nYou don't have to finish every task tonight.\n\nYou don't have to feel guilty for resting.\n\nBeing tired doesn't mean you're lazy.\n\nIt means you're human.\n\nSo put your phone down for a bit.\n\nGet comfortable.\n\nFind a blanket.\n\nWatch something that makes you laugh.\n\nOr do absolutely nothing.\n\nYou'd be surprised how healing "doing nothing" can be.\n\nToday's finished.\n\nLet it stay there.` },
        { id: "lonely", icon: "🌧", theme: "sad", title: "Open When You're Feeling Lonely", greeting: "Hi, my favorite person.", closing: "Always here,", ps: "Just because we're not in the same place doesn't mean you're by yourself.", content: `I know loneliness has this annoying habit of making the world feel a lot quieter than it actually is.\n\nIt makes you think nobody understands.\n\nNobody notices.\n\nNobody's around.\n\nBut feelings aren't always facts.\n\nSometimes loneliness lies.\n\nIt tells you you're by yourself when you're really not.\n\nI hope you remember that there are people who care about you more than you probably realize.\n\nI'm one of them.\n\nWhether we're talking every hour, every day, or we've both just been busy with life...\n\nThat doesn't change.\n\nYou're still important to me.\n\nYou're still someone I care about.\n\nAnd you're never a burden for needing someone.\n\nSo if today feels a little lonely...\n\nRemember this letter.\n\nAnd remember me.` },
        { id: "stressed", icon: "🍵", theme: "sick", title: "Open When You're Stressed", greeting: "Okay, let's take a timeout.", closing: "Relax,", ps: "Go unclench your jaw. I know you're doing it.", content: `Pause.\n\nSeriously.\n\nBefore you keep reading...\n\nRelax your shoulders.\n\nUnclench your jaw.\n\nTake one deep breath.\n\nThere.\n\nAlready doing better.\n\nStress has this funny way of convincing us that everything is urgent.\n\nSpoiler alert...\n\nIt isn't.\n\nOne thing at a time.\n\nYou don't have to solve your entire life before dinner.\n\nYou just have to solve the next thing.\n\nThen the next.\n\nThen the next.\n\nYou're stronger than you think.\n\nAnd even if today feels messy...\n\nMessy days don't last forever.` },
        { id: "motivation", icon: "🌅", theme: "happy", title: "Open When You Need Motivation", greeting: "Hey, you.", closing: "So proud of you,", ps: "One step is still progress. Don't underestimate how far tiny steps can take you.", content: `I know starting is sometimes the hardest part.\n\nYou keep waiting until you feel motivated enough.\n\nConfident enough.\n\nReady enough.\n\nCan I tell you a secret?\n\nAlmost nobody feels completely ready.\n\nThey just start anyway.\n\nSo don't worry about taking huge steps today.\n\nTake one small one.\n\nThen another.\n\nTiny progress is still progress.\n\nYou don't have to sprint.\n\nJust don't convince yourself that standing still is your only option.\n\nYou've got this.\n\nEven if today's version of "got this" looks different from yesterday's.` },
        { id: "angry", icon: "🌩", theme: "sad", title: "Open When You're Angry", greeting: "Well... someone's grumpy.", closing: "Still love you,", ps: "Before you start plotting someone's downfall... maybe have a snack first. You'd be surprised how often that helps. ❤️", content: `I could tell the second you clicked on this letter.\n\nSo...\n\nWho do I need to fight?\n\nI'm kidding.\n\n...\n\nMostly.\n\nI'm not going to tell you to calm down because I think we both know that has literally never worked in the history of humanity.\n\nAnd honestly?\n\nMaybe you don't need to calm down right this second.\n\nMaybe you just need someone to admit that whatever happened really sucked.\n\nSo here you go.\n\nI'm sorry.\n\nI'm sorry today decided to test your patience.\n\nI'm sorry someone said something they shouldn't have.\n\nI'm sorry things didn't go the way you hoped.\n\nWhatever happened...\n\nI hate that it made you feel like this.\n\nNow, can I ask you something?\n\nIs this something that's going to matter a week from now?\n\nMaybe.\n\nMaybe not.\n\nIf the answer is yes, then it's worth dealing with.\n\nIf the answer is no...\n\nThen maybe don't let it steal the rest of your day.\n\nSome people just aren't worth that much of your energy.\n\nAnd you?\n\nYour energy is way too precious to waste on people who don't deserve it.\n\nSo here's my very professional advice.\n\nTake a deep breath.\n\nDrink some water.\n\nPut on your favorite song.\n\nGo for a walk.\n\nPunch a pillow if you absolutely have to.\n\nJust... maybe don't send that text while you're still angry.\n\nFuture you will appreciate that.\n\nBesides...\n\nI like your smile a lot more than your angry face.\n\nAlthough...\n\nYour angry little rants are kind of cute.\n\nDon't let that go to your head.\n\nNow go reclaim the rest of your day.\n\nDon't let one bad moment convince you the whole day was ruined.\n\nYou're bigger than this.\n\nAnd if you're still mad after all that...\n\nCome tell me the whole story.\n\nI promise to act appropriately outraged with you.\n\n"Wait... they actually said that?"\n\n"No way."\n\n"You're kidding."\n\nSee?\n\nI've already got your side.` },
        { id: "happy", icon: "☀", theme: "happy", title: "Open When You're Happy", greeting: "Heyyy!!", closing: "Keep smiling,", ps: "I hope today keeps surprising you in the best ways. And if something even better happens... I expect to hear about it. ❤️", content: `Look at you!!\n\nYou're happy!!\n\nFinally, the universe decided to do its job for once.\n\nI love that.\n\nHonestly, I think the world is a much better place when it's being kind to you.\n\nYou deserve days that make you smile for absolutely no reason.\n\nYou deserve moments where you're laughing so hard your stomach hurts.\n\nYou deserve days that end with you thinking,\n\n"Today was actually really nice."\n\nIf something wonderful happened today...\n\nI hope you celebrated it.\n\nEven if it's something tiny.\n\nMaybe you finished something you've been working on.\n\nMaybe someone complimented you.\n\nMaybe you got good news.\n\nMaybe today just felt... lighter.\n\nWhatever it was...\n\nI'm so happy it happened to you.\n\nSometimes we're so busy waiting for the next big thing that we forget to enjoy the little victories.\n\nSo don't do that today.\n\nBe proud of yourself.\n\nSmile a little longer.\n\nReplay the happy moment in your head as many times as you want.\n\nThose moments deserve to stay with you.\n\nAnd selfishly...\n\nI wish I was there to see you smiling.\n\nBecause I think your smile is one of my favorite things in the world.\n\nSo keep it around for a while, okay?\n\nYou look really, really pretty wearing it.\n\nNow go enjoy your day.\n\nYou've earned it.\n\nNow stop reading this.\n\nGo enjoy your happy moment.\n\nThe letter will still be here tomorrow, but today won't.\n\nGo make another memory.\n\nAnd don't forget to tell me all about it later. ❤️` },
        { id: "goodnews", icon: "🎉", theme: "happy", title: "Open After Good News", greeting: "WAIT.", closing: "Celebrating with you,", ps: "I reserve the right to celebrate your wins even more than you do.", content: `YOU HAVE GOOD NEWS??\n\nAnd you're reading this before telling me??\n\nExcuse me??\n\nI should've been the first person to know.\n\nI'm offended.\n\n...\n\nOkay, not really.\n\nI'm just really happy for you.\n\nWhatever happened...\n\nI'm proud of you.\n\nYou work so hard for the things you care about, and I love seeing life reward you every once in a while.\n\nCelebrate it.\n\nPlease.\n\nDon't immediately move on to the next goal.\n\nDon't say,\n\n"It's not that big of a deal."\n\nIt is.\n\nIf it made you happy...\n\nThen it's worth celebrating.\n\nSo smile.\n\nTake pictures.\n\nTreat yourself.\n\nBrag a little.\n\nYou've earned it.\n\nAnd then...\n\nCome tell me everything.\n\nEvery tiny detail.\n\nI want the full story.\n\nNot the short version.\n\nThe entire thing.` },
        { id: "proud", icon: "✨", theme: "warm", title: "Open When You're Proud of Yourself", greeting: "Hey, pretty girl.", closing: "Endlessly proud,", ps: "Please don't follow this achievement with, 'It wasn't that hard.' We both know that's not true.", content: `Can I just say something?\n\nI'm really glad you're proud of yourself.\n\nYou should be.\n\nI know how hard you are on yourself sometimes.\n\nYou're always thinking about what you could've done better instead of looking at everything you've already accomplished.\n\nSo if today is one of those rare moments where you're looking at yourself and thinking,\n\n"I actually did pretty well."\n\nHold onto that feeling.\n\nDon't let your brain take it away five minutes later.\n\nBe proud.\n\nYou've earned that.\n\nAnd if you ever forget...\n\nI'll gladly remind you.\n\nBecause trust me...\n\nI've been proud of you for a long time.` },
        { id: "hug", icon: "🫂", theme: "warm", title: "Open When You Need A Hug", greeting: "Come here for a second.", closing: "Squeezing you tight,", ps: "Don't forget to drink water. Yes, I'm reminding you again. And no, this reminder isn't optional. 😌💜", content: `No, seriously.\n\nCome here.\n\nImagine I'm giving you the biggest hug ever.\n\nThe kind where you don't have to explain anything.\n\nNo pretending you're okay.\n\nNo fake smiles.\n\nNo "I'm fine."\n\nJust a hug.\n\nStay there for a few seconds.\n\n...\n\nThere.\n\nThat already feels a little better, doesn't it?\n\nI know hugs can't magically fix everything, but I really wish I could give you one whenever you needed it.\n\nAnd honestly...\n\nYou know you never have to go through things alone, right?\n\nYou can literally call me.\n\nAt any time.\n\nI don't care if it's early in the morning, late at night, or you've had the worst day ever.\n\nIf you need me, call me.\n\nI'll come over, give you the biggest hug imaginable, sit with you for as long as you need, listen to everything you want to say—or nothing at all if you don't feel like talking.\n\nWe'll order food, watch something, go for a drive, make tea, sit in complete silence, or do absolutely nothing together.\n\nWhatever helps.\n\nYou never have to earn my time.\n\nYou never have to apologize for needing someone.\n\nEspecially not me.\n\nSo the next time life feels a little too heavy...\n\nDon't just read this letter.\n\nCall me.\n\nI'd much rather be hugging you for real than have this letter do all the work.\n\nNow come over here.\n\nI still owe you one ridiculously long hug.\n\n🤍` },
        { id: "sick", icon: "🤒", theme: "sick", title: "Open When You're Sick", greeting: "Excuse me.", closing: "Get better soon,", ps: "Your mission is simple: drink your water, take your medicine, eat something, and get better. Failure to comply may result in me showing up and taking over your recovery myself. ❤️", content: `What is this?\n\nWho gave you permission to get sick?\n\nBecause I certainly didn't.\n\nI leave you unsupervised for five minutes and now you're ill?\n\nUnbelievable.\n\nThis is very inconvenient for me, you know.\n\nI don't like it when my favorite person isn't feeling like herself.\n\nI know you're probably sitting there saying,\n\n"I'm fine."\n\nNo.\n\nYou're sick.\n\nYou're officially banned from saying you're fine until I say otherwise.\n\nNow tell me...\n\nHave you been drinking enough water?\n\nTaken your medicine?\n\nActually rested?\n\nOr are you pretending you'll magically feel better while continuing to do everything except take care of yourself?\n\nYeah...\n\nThat's what I thought.\n\nListen to me for a minute.\n\nYour only job right now is to get better.\n\nThe dishes can wait.\n\nThe assignments can wait.\n\nThe messages can wait.\n\nThe world will survive without you being productive for a day or two.\n\nI promise.\n\nAnd if you're sitting there thinking,\n\n"I don't really feel like eating."\n\nToo bad.\n\nYou're eating anyway.\n\nIf you don't have anything at home...\n\nTell me.\n\nI'll order food for you.\n\nNo arguing.\n\nNo saying,\n\n"It's okay."\n\nBecause it's not okay if you're sitting there sick and refusing to eat.\n\nAnd yes...\n\nI will make sure you eat.\n\nYes, I'm threatening you with food again.\n\nApparently that's become one of my talents.\n\nHonestly...\n\nIf I could, I'd come over with soup, snacks, medicine, and enough blankets to turn you into the coziest burrito ever.\n\nI'd make sure you took your medicine on time, keep reminding you to drink water, and probably ask you every ten minutes if you're feeling any better.\n\nYou'd probably get annoyed with me...\n\nBut I'd still do it.\n\nBecause I care about you.\n\nAnd besides...\n\nSomeone has to take care of the sick baby.\n\n(Yes, I called you a baby.\n\nNo, you don't get to argue.\n\nYou're sick, so I've automatically won this debate.)\n\nNow be good.\n\nRest.\n\nWatch something comforting.\n\nSleep as much as you need.\n\nAnd let your body do its thing.\n\nI'll be here when you're feeling better.\n\nHopefully causing trouble with you instead of writing you sick letters.` },
        { id: "crying", icon: "💧", theme: "sad", title: "Open When You Feel Like Crying", interactive: "crying", greeting: "Hey, love.", closing: "Sleep well, pretty girl.", ps: "I hope one day you see yourself through my eyes. I think you'd finally understand why you're so easy to love. 🤍" },
        { id: "hungry", icon: "🍜", theme: "warm", title: "Open When You're Hungry", interactive: "hungry", greeting: "Ahem.", closing: "Go eat.", ps: "This letter is now judging you until you've eaten. 🍜❤️" }
    ];

    const cryingText = `If you opened this letter...\n\nI'm guessing today has been one of those days where you need a little reminder.\n\nSo let me remind you.\n\nYou are loved.\n\nNot because of what you achieve.\n\nNot because you're always cheerful.\n\nNot because you're doing everything perfectly.\n\nYou're loved because you're you.\n\nI wish you could see yourself the way I see you.\n\nYou'd notice the little things you never give yourself credit for.\n\nThe way you always remember the tiny details about people.\n\nThe way you make others feel comfortable without even trying.\n\nThe way your smile somehow makes everything around it feel a little lighter.\n\nThe way your laugh is so contagious that I can't help but smile too.\n\nYou're so busy worrying about whether you're enough that you forget something important.\n\nYou've been enough all along.\n\nYou don't have to earn love.\n\nYou don't have to compete for it.\n\nYou don't have to prove that you're worthy of it.\n\nYou already are.\n\nAnd I hope you never think you have to become someone else just to deserve being loved.\n\nBecause if I'm being honest...\n\nI wouldn't change a thing about you.\n\nNot your random little habits.\n\nNot the way you get excited over the smallest things.\n\nNot your stubbornness.\n\nNot your overthinking.\n\nNot even the moments when you doubt yourself.\n\nThose are all parts of the person I've come to care about so much.\n\nSo whenever life convinces you that you're difficult to love...\n\nRead this again.\n\nBecause I'll keep disagreeing with that thought every single time.\n\nYou are loved.\n\nCompletely.\n\nExactly as you are.\n\nAnd if one day you forget that...\n\nCome back here.\n\nI'll remind you as many times as you need.\n\nBefore you close this letter...\n\nI want you to do one thing for me.\n\nPut your hand over your heart for just a second.\n\nFeel that?\n\nThat's proof that you've made it through every hard day you've ever had.\n\nAnd somewhere out there...\n\nThere's someone who's incredibly grateful that heart belongs to you.\n\nI'll remind you again tomorrow if I have to.`;

    const hungryText = `Before you continue reading...\n\nI have one very important question.\n\nHave.\n\nYou.\n\nEaten?\n\nNo, "I'll eat later" is not an acceptable answer.\n\nNeither is "I forgot."\n\nAnd absolutely not "I just had coffee."\n\nThat is not food.\n\nI know you.\n\nYou'll keep saying,\n\n"I'll eat in five minutes."\n\nAnd somehow five minutes turns into three hours.\n\nWe're not doing that today.\n\nSo here's the deal.\n\nPause whatever you're doing.\n\nGo find something to eat.\n\nI genuinely don't care if it's a full meal, leftovers from yesterday, instant noodles, a sandwich, or breakfast at 4 p.m.\n\nJust eat something.\n\nYour body has been working hard for you all day.\n\nThe least you can do is give it some fuel.\n\nAnd before you say,\n\n"I'm not that hungry."\n\nYou probably are.\n\nYou've just ignored it long enough that your stomach gave up trying to convince you.\n\nAlso...\n\nIf you're sitting there thinking,\n\n"I don't really have anything to eat."\n\nTell me.\n\nSeriously.\n\nI'll order you food.\n\nNo arguments.\n\nNo "it's okay."\n\nNo "you don't have to."\n\nI know exactly what you're about to say, and the answer is still no.\n\nLet me.\n\nBesides...\n\nYes, I will make sure you eat.\n\nYes, I'm absolutely threatening you with food.\n\nAnd yes, it's because I know you'll somehow convince yourself you can survive on absolutely nothing all day.\n\nYou might get away with fooling everyone else.\n\nYou're not fooling me.\n\nNow...\n\nClose this letter.\n\nGo eat.\n\nThen you can come back and tell me what you had.\n\nAnd if your answer is,\n\n"Nothing."\n\nI'm going to pretend to be very disappointed in you.\n\n(Okay... not pretend. I actually will be.)\n\nSo go.\n\nShoo.\n\nYour food is waiting.`;

    // --- 4. The HTML Injection Function ---
    window.injectLettersEngine = function() {
        if (!document.getElementById('drawer-overlay')) {
            const engineHTML = `
                <div id="drawer-overlay">
                    <h1 class="drawer-header">━━━━━━━━━━━━━━━<br>💌<br>The Envelope Drawer<br>━━━━━━━━━━━━━━━<br><span style="font-size: 1.2rem; font-family: 'Quicksand'; letter-spacing: 1px; color: #8B6F97;">Pick whichever one your heart needs today.</span></h1>
                    <div id="envelope-grid"></div>
                    <button class="letter-btn" onclick="window.closeDrawer()" style="margin-top: 50px;">🏡 Back Home</button>
                </div>
                <div id="letter-room">
                    <div class="letter-paper-full" id="active-paper">
                        <div class="paper-content-wrapper">
                            <div class="decor-top-left">🌸</div>
                            <div class="decor-bottom-right">❀</div>
                            <div class="paper-header">
                                <span class="paper-header-lines">━━━━━━━━━━━━━━━━━━</span><br>
                                <span id="paper-title"></span><br>
                                <span class="paper-header-lines">━━━━━━━━━━━━━━━━━━</span>
                            </div>
                            <div class="paper-greeting" id="paper-greeting"></div>
                            <div class="paper-body" id="paper-body"></div>
                            <div id="interactive-zone" style="margin-top: 20px;"></div>
                            <div class="paper-footer" id="paper-footer">
                                <div class="paper-divider">❀ • ─────────── • ❀</div>
                                <div class="ps-box" id="paper-ps-box">
                                    <span class="ps-title">P.S. ♡</span><br>
                                    <span class="ps-content" id="paper-ps-content"></span>
                                </div>
                                <div class="signature-text" id="paper-signature"></div>
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
        }
    };

    // Run injection as soon as the file loads
    window.injectLettersEngine();

    // --- 5. The Core Logic ---
    let activeLetter = null;
    let letterCatTimer = null;

    window.startLetterCompanionTimer = function() {
        clearTimeout(letterCatTimer);
        letterCatTimer = setTimeout(() => {
            if (!document.getElementById('sleepy-companion')) {
                const cat = document.createElement('div');
                cat.id = 'sleepy-companion';
                cat.innerHTML = `<div class="companion-bubble">You've been here for a while... I hope you're feeling a little lighter now. 🤍</div><div style="font-size: 3rem;">🐱</div>`;
                document.body.appendChild(cat);
                setTimeout(() => { cat.style.bottom = '20px'; }, 100);
                setTimeout(() => { cat.style.bottom = '-100px'; setTimeout(()=>cat.remove(), 2000); }, 8000); 
            }
        }, 480000); // 8 minutes
    };

    // 5.1 Open the Drawer
    window.openLetters = function() {
        try {
            window.injectLettersEngine(); // Failsafe injection
            
            const dash = document.getElementById('main-dashboard');
            const overlay = document.getElementById('drawer-overlay');
            const grid = document.getElementById('envelope-grid');
            
            if(!overlay || !grid) {
                alert("Error: The envelope drawer elements are missing from the page.");
                return;
            }

            if(dash) {
                dash.style.transition = 'filter 0.6s ease';
                dash.style.filter = 'blur(10px) brightness(0.8)';
            }
            
            grid.innerHTML = '';
            window.lettersData.forEach(letter => {
                grid.innerHTML += `
                    <div class="envelope-container" onclick="window.openEnvelope('${letter.id}', this)">
                        <div class="envelope-flap"></div>
                        <div class="envelope-paper-preview">✨</div>
                        <div class="envelope-body">
                            <div class="envelope-label">💌<br>Open When<br>${letter.title.replace('Open When ', '').replace('Open ', '')}</div>
                        </div>
                        <div class="wax-seal">❤️</div>
                    </div>
                `;
            });

            overlay.style.display = 'flex';
            setTimeout(() => { overlay.style.opacity = '1'; }, 10);
            window.startLetterCompanionTimer();
            
        } catch (error) {
            alert("Error in openLetters: " + error.message);
        }
    };

    window.closeDrawer = function() {
        const dash = document.getElementById('main-dashboard');
        const overlay = document.getElementById('drawer-overlay');
        if(overlay) overlay.style.opacity = '0';
        if(dash) dash.style.filter = 'none';
        setTimeout(() => { if(overlay) overlay.style.display = 'none'; }, 800);
    };

    // 5.2 Envelope Animation -> Letter Room
    window.openEnvelope = function(id, element) {
        try {
            activeLetter = window.lettersData.find(l => l.id === id);
            element.classList.add('envelope-opening');
            
            if(window.crossfade) {
                window.crossfade('bg-smilebox', 0.2); // Uses the ambient smilebox music for reading
            }

            setTimeout(() => {
                const room = document.getElementById('letter-room');
                const paper = document.getElementById('active-paper');
                const title = document.getElementById('paper-title');
                const greeting = document.getElementById('paper-greeting');
                const body = document.getElementById('paper-body');
                const interactive = document.getElementById('interactive-zone');
                const footer = document.getElementById('paper-footer');
                const psBox = document.getElementById('paper-ps-box');
                const psContent = document.getElementById('paper-ps-content');
                const signature = document.getElementById('paper-signature');
                const controls = document.getElementById('letter-controls');

                document.getElementById('drawer-overlay').style.display = 'none';
                
                room.className = `bg-${activeLetter.theme}`;
                title.innerText = activeLetter.title;
                greeting.innerText = activeLetter.greeting || "";
                signature.innerHTML = activeLetter.closing || "Love,";
                interactive.innerHTML = '';
                paper.scrollTop = 0; 
                
                if(activeLetter.ps) {
                    psBox.style.display = 'block';
                    psContent.innerText = activeLetter.ps;
                } else {
                    psBox.style.display = 'none';
                }

                if (activeLetter.interactive === "crying") {
                    body.innerHTML = `You've been crying, haven't you?<br><br>I can tell.<br><br><div style="text-align:center; font-family:'Quicksand'; font-size: 1.2rem; font-weight:bold; color:#5D4E75; margin-top:30px;">Do you want to talk about it?</div>`;
                    footer.style.display = 'none';
                    interactive.innerHTML = `
                        <div style="display:flex; flex-direction:column; gap:15px; align-items:center; margin-top:20px;">
                            <button class="letter-btn" onclick="window.revealLetterInteractive('crying', 'yes')">Yes.</button>
                            <button class="letter-btn" onclick="window.revealLetterInteractive('crying', 'later')">Not yet.</button>
                            <button class="letter-btn" onclick="window.revealLetterInteractive('crying', 'unknown')">I don't even know why I'm crying.</button>
                        </div>
                    `;
                } else if (activeLetter.interactive === "hungry") {
                    body.innerHTML = hungryText;
                    footer.style.display = 'none';
                    interactive.innerHTML = `
                        <div style="display:flex; flex-direction:column; gap:15px; align-items:center; margin-top:20px;">
                            <button class="letter-btn" style="background:#FFF6CC;" onclick="window.revealLetterInteractive('hungry', 'ate')">🍜 I Ate Something</button>
                            <button class="letter-btn" style="background:#FFDCEB;" onclick="window.revealLetterInteractive('hungry', 'starving')">😒 I'm Still Not Eating</button>
                        </div>
                    `;
                } else {
                    body.innerHTML = activeLetter.content;
                    footer.style.display = 'block';
                }

                room.style.display = 'flex';
                setTimeout(() => { room.style.opacity = '1'; }, 50);
                setTimeout(() => { 
                    paper.classList.add('paper-ready'); 
                    controls.style.opacity = '1';
                }, 600); 
            }, 1200); 
            
        } catch (error) {
            alert("Error in openEnvelope: " + error.message);
        }
    };

    // 5.3 Interactive Responses
    window.revealLetterInteractive = function(type, response) {
        const body = document.getElementById('paper-body');
        const interactive = document.getElementById('interactive-zone');
        const footer = document.getElementById('paper-footer');
        
        if (type === 'crying') {
            let prefix = "";
            if(response === 'yes') prefix = "I'm listening. Take your time. Whatever is on your mind, I'm here. 💜\n\n";
            if(response === 'later') prefix = "That's okay. You don't have to talk until you're ready. I'll just be here. 🌸\n\n";
            if(response === 'unknown') prefix = "That happens sometimes. Your heart just needs to let it out. You're doing just fine. ☁️\n\n";
            interactive.innerHTML = '';
            body.innerHTML = prefix + cryingText;
            footer.style.display = 'block';
        } else if (type === 'hungry') {
            if (response === 'ate') {
                interactive.innerHTML = `<div style="font-family:'Caveat', cursive; font-weight:700; color:#5D4E75; font-size:32px; text-align:center; margin-top:30px;">Good. I'm proud of you. See? That wasn't so hard. 🤍</div>`;
                footer.style.display = 'block';
            } else {
                interactive.innerHTML = `<div style="font-family:'Quicksand', sans-serif; font-weight:700; color:#FF8BA7; font-size:1.1rem; border: 2px dashed #FF8BA7; padding: 20px; border-radius: 15px; text-align:center; margin-top:30px;">Access denied. Reason: Hungry gremlin detected. Go eat first. 😡</div>`;
            }
        }
    };

    // 5.4 Closing & Returning
    window.foldLetter = function() {
        const room = document.getElementById('letter-room');
        const paper = document.getElementById('active-paper');
        const controls = document.getElementById('letter-controls');
        
        if(paper) paper.classList.remove('paper-ready');
        if(controls) controls.style.opacity = '0';
        if(room) room.style.opacity = '0';
        
        if(window.crossfade) {
            window.crossfade('bg-dashboard', 0.15); // Return to dashboard music
        }

        setTimeout(() => { 
            if(room) room.style.display = 'none'; 
            window.closeDrawer(); 
        }, 1000);
    };

    window.backToDrawer = function() {
        const room = document.getElementById('letter-room');
        const paper = document.getElementById('active-paper');
        const overlay = document.getElementById('drawer-overlay');
        
        if(paper) paper.classList.remove('paper-ready');
        if(room) room.style.opacity = '0';
        
        if(window.crossfade) {
            window.crossfade('bg-dashboard', 0.15); // Return to dashboard music
        }

        setTimeout(() => { 
            if(room) room.style.display = 'none'; 
            if(overlay) overlay.style.display = 'flex';
            document.querySelectorAll('.envelope-container').forEach(e => e.classList.remove('envelope-opening'));
        }, 1000);
    };

} catch (globalError) {
    alert("CRITICAL ERROR loading letters.js: " + globalError.message);
}
