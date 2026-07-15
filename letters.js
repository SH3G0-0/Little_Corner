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
    `;
    document.head.appendChild(letterStyles);

    // --- 3. The Letter Data ---
    window.lettersData = [
        { id: "insecure", icon: "✨", theme: "warm", title: "Open When You're Feeling Insecure", greeting: "Hey, pretty girl.", closing: "Always rooting for you,", ps: "If your brain keeps saying mean things about you, send it to me. I'd like to have a word with it.", content: `Come here for a second.\nI need to ask you something.\nWho exactly convinced you that you weren't enough?\nBecause I'd like to have a very serious conversation with them.\nYou know what I see when I look at you?\nI see someone with the prettiest smile.\nSomeone whose laugh can instantly make my day better.\nSomeone who's kind in ways she doesn't even notice.\nSomeone who somehow manages to make ordinary moments feel special.\nAnd yes...\nSomeone who's ridiculously pretty.\nSeriously.\nWho could even dislike you?\nLook at you.\nYou're adorable.\nYou're funny.\nYou're caring.\nYou're beautiful.\nHonestly, I think your brain just enjoys making things up sometimes.\nSo the next time you start picking yourself apart...\nBorrow my eyes for a little while.\nBecause I promise I'd never look at you the way you sometimes look at yourself.\nYou're so much kinder than you give yourself credit for.\nAnd so much prettier than you believe.` },
        { id: "reassurance", icon: "🤍", theme: "warm", title: "Open When You Need Reassurance", greeting: "Hey, love.", closing: "Until next time,", ps: "You don't have to ask if I'm free. Just call. We'll figure the rest out later. ❤️", content: `Can I be selfish for a second?\nI need you to promise me something.\nPromise me that when you're struggling...\nYou won't immediately decide to deal with everything on your own.\nI know that's what you usually do.\nYou tell yourself you'll figure it out.\nYou convince yourself you don't want to bother anyone.\nBut if there's one person I never want you to hesitate to bother...\nIt's me.\nSeriously.\nIf you're sad...\nCall me.\nIf you're angry...\nCall me.\nIf you're crying...\nCall me.\nIf you just had the best day ever and you're excited...\nPlease call me.\nI want to hear all of it.\nThe good days.\nThe bad days.\nThe completely random "guess what happened today" stories.\nI don't just want to be around for your best moments.\nI want to be there for all of them.\nSo don't ever think you're too much.\nYou could never be too much for me.` },
        { id: "nosleep", icon: "🌙", theme: "night", title: "Open When You Can't Sleep", greeting: "Hey, sleepyhead.", closing: "Go to sleep.<br>I'll know if you don't. ♡", ps: "Sleep. That's an order. (A very loving one.)", content: `You're awake again, aren't you?\nI knew it.\nInstead of sleeping like a normal person, you're reading letters on a website.\nHonestly...\nThat's kind of cute.\nI wish I was there.\nI'd probably tell you to put your phone away...\nAnd then I'd immediately start another conversation that keeps us awake for another hour.\nNot exactly helpful.\nBut at least we'd both be awake together.\nIf your mind won't slow down tonight, don't fight it.\nTake a deep breath.\nWrap yourself up in your blanket.\nListen to your favorite song.\nThink about one happy memory instead of a hundred stressful ones.\nTomorrow will come whether you worry tonight or not.\nSo you might as well let yourself rest.\nAnd if you're still awake after this...\nText me.\nOdds are I probably am too.` },
        { id: "smile", icon: "🌼", theme: "happy", title: "Open When You Need a Smile", greeting: "Well... look who showed up.", closing: "Now go smile.", ps: "If you're still refusing to smile, I'm going to assume you're just being stubborn.", content: `Excuse me.\nYes, you.\nSmile inspection.\nI'm waiting.\n...\nWas that a smile?\nNo?\nHmm.\nLooks like I'm going to have to work a little harder.\nCan I tell you something?\nOne of my favorite things about you is how easily you make other people smile.\nWhich is honestly a little unfair.\nBecause now I have to compete with that.\nSo here's my attempt.\nYou're ridiculously cute.\nYou have the most contagious laugh.\nYou somehow make even the most ordinary conversations memorable.\nAnd you look really pretty when you're smiling.\nYes.\nThat was absolutely me trying to convince you to smile.\nDid it work?\nI hope so.\nBecause I'd hate to lose this very important competition.\nNow...\nSmile for me.\nJust a little.\nThere it is.\nI knew I'd win eventually.` },
        { id: "down", icon: "🌧", theme: "sad", title: "Open When You're Feeling Down", greeting: "Hi, sunshine.", closing: "Your favorite person 🤍", ps: "Today's allowed to be a bad day. Just don't let it convince you that you're having a bad life. Those are two very different things.", content: `I don't know what happened today, but I'm guessing it wasn't exactly your favorite day.\nFirst of all... I'm sorry.\nSecond of all... before your brain starts making today seem like the end of the world, let's calm it down for a second.\nOne bad day doesn't mean you're having a bad life.\nOne mistake doesn't undo all the good you've done.\nOne rough moment doesn't suddenly make you any less wonderful.\nI know it's easier to believe the bad things than the good ones. Our brains are kind of weird like that.\nSo until your brain decides to behave, let me do the thinking for both of us.\nYou're doing okay.\nMaybe not perfect.\nMaybe not amazing.\nBut okay is enough.\nTomorrow is a completely different day, and you don't have to carry today's weight into it.\nNow go do something nice for yourself.\nYou deserve at least one nice thing today.` },
        { id: "miss", icon: "🧸", theme: "warm", title: "Open When You Miss Me", greeting: "Oh! It's you again.", closing: "Waiting for you,", ps: "Stop reading this and come find me already. I think I've waited long enough.", content: `So...\nYou clicked on this one.\nInteresting.\nMissing me already?\nYou're such a weirdo.\n...\nI mean, I get it.\nI'm pretty cool.\nI'm kidding.\n(Kind of.)\nI wish I knew what made you open this letter. Maybe today was just one of those days where you wanted someone familiar around. If that's the case, I hope this is enough until we can actually hang out.\nI like knowing that even when we're doing our own thing, we still somehow end up thinking about each other.\nThat's nice.\nLife gets busy, people get caught up in things, and sometimes days pass faster than we'd like.\nBut none of that changes the fact that I'm always happy to hear from you.\nSo don't overthink it.\nSend the text.\nCall me.\nSend me a meme.\nTell me something random.\nOr just say "hi."\nI promise I won't mind.\nNow stop sitting there smiling at your screen.\nIt's making you look suspicious.` },
        { id: "exam", icon: "📚", theme: "happy", title: "Open Before An Exam", greeting: "Hello, trouble.", closing: "You've got this,", ps: "If you finish the exam and immediately start overthinking every answer, I'm legally obligated to tell you to stop. You can't change the answers anymore, so go celebrate surviving instead.", content: `Alright.\nDeep breath.\nNo, seriously.\nTake one.\nDone?\nGood.\nI know you're probably sitting there thinking about everything you don't know instead of everything you've already studied.\nThat's just your brain being dramatic again.\nYou've worked hard.\nYou've put the time in.\nAnd now the only thing left to do is trust yourself.\nDon't let one question throw you off.\nIf you don't know the answer, move on.\nCome back later.\nOne difficult question doesn't decide the whole exam.\nAnd one exam definitely doesn't decide your future.\nJust do your best.\nThat's all anyone—including me—could ever ask of you.\nI'm already proud of you.\nNow go show that exam who's actually in charge.` },
        { id: "overthinking", icon: "🌌", theme: "night", title: "Open When You're Overthinking", greeting: "Hey. Yeah, you.", closing: "Take a breath,", ps: "Your brain is grounded for the rest of the day. It has officially lost overthinking privileges.", content: `Let me guess.\nYou've replayed the same conversation at least twelve times already.\nYou've imagined seventeen different outcomes.\nYou've somehow convinced yourself that the worst possible scenario is definitely going to happen.\nSound about right?\nYour brain deserves an award.\nNot for being correct.\nJust for having an incredible imagination.\nTake a breath.\nNot every awkward moment is remembered forever.\nNot every unanswered message means something's wrong.\nNot every silence needs filling.\nSometimes things are just...\nNormal.\nGive yourself a break.\nYou don't have to solve tomorrow tonight.\nAnd you definitely don't have to fight battles that only exist in your imagination.\nYour brain means well.\nIt's just being a little dramatic today.` },
        { id: "longday", icon: "🍂", theme: "warm", title: "Open After A Long Day", greeting: "There you are. I've been waiting for you.", closing: "Rest now,", ps: "Your only assignment tonight is to rest. Yes, this assignment is graded. Yes, I'll know if you don't do it.", content: `Welcome back.\nYou made it.\nI don't know whether today was amazing, terrible, or just painfully average.\nBut it's over now.\nAnd honestly?\nI'm glad.\nBecause now you can finally stop carrying everything around.\nYou don't have to answer every message tonight.\nYou don't have to finish every task tonight.\nYou don't have to feel guilty for resting.\nBeing tired doesn't mean you're lazy.\nIt means you're human.\nSo put your phone down for a bit.\nGet comfortable.\nFind a blanket.\nWatch something that makes you laugh.\nOr do absolutely nothing.\nYou'd be surprised how healing "doing nothing" can be.\nToday's finished.\nLet it stay there.` },
        { id: "lonely", icon: "🌧", theme: "sad", title: "Open When You're Feeling Lonely", greeting: "Hi, my favorite person.", closing: "Always here,", ps: "Just because we're not in the same place doesn't mean you're by yourself.", content: `I know loneliness has this annoying habit of making the world feel a lot quieter than it actually is.\nIt makes you think nobody understands.\nNobody notices.\nNobody's around.\nBut feelings aren't always facts.\nSometimes loneliness lies.\nIt tells you you're by yourself when you're really not.\nI hope you remember that there are people who care about you more than you probably realize.\nI'm one of them.\nWhether we're talking every hour, every day, or we've both just been busy with life...\nThat doesn't change.\nYou're still important to me.\nYou're still someone I care about.\nAnd you're never a burden for needing someone.\nSo if today feels a little lonely...\nRemember this letter.\nAnd remember me.` },
        { id: "stressed", icon: "🍵", theme: "sick", title: "Open When You're Stressed", greeting: "Okay, let's take a timeout.", closing: "Relax,", ps: "Go unclench your jaw. I know you're doing it.", content: `Pause.\nSeriously.\nBefore you keep reading...\nRelax your shoulders.\nUnclench your jaw.\nTake one deep breath.\nThere.\nAlready doing better.\nStress has this funny way of convincing us that everything is urgent.\nSpoiler alert...\nIt isn't.\nOne thing at a time.\nYou don't have to solve your entire life before dinner.\nYou just have to solve the next thing.\nThen the next.\nThen the next.\nYou're stronger than you think.\nAnd even if today feels messy...\nMessy days don't last forever.` },
        { id: "motivation", icon: "🌅", theme: "happy", title: "Open When You Need Motivation", greeting: "Hey, you.", closing: "So proud of you,", ps: "One step is still progress. Don't underestimate how far tiny steps can take you.", content: `I know starting is sometimes the hardest part.\nYou keep waiting until you feel motivated enough.\nConfident enough.\nReady enough.\nCan I tell you a secret?\nAlmost nobody feels completely ready.\nThey just start anyway.\nSo don't worry about taking huge steps today.\nTake one small one.\nThen another.\nTiny progress is still progress.\nYou don't have to sprint.\nJust don't convince yourself that standing still is your only option.\nYou've got this.\nEven if today's version of "got this" looks different from yesterday's.` },
        { id: "angry", icon: "🌩", theme: "sad", title: "Open When You're Angry", greeting: "Well... someone's grumpy.", closing: "Still love you,", ps: "Before you start plotting someone's downfall... maybe have a snack first. You'd be surprised how often that helps. ❤️", content: `I could tell the second you clicked on this letter.\nSo...\nWho do I need to fight?\nI'm kidding.\n...\nMostly.\nI'm not going to tell you to calm down because I think we both know that has literally never worked in the history of humanity.\nAnd honestly?\nMaybe you don't need to calm down right this second.\nMaybe you just need someone to admit that whatever happened really sucked.\nSo here you go.\nI'm sorry.\nI'm sorry today decided to test your patience.\nI'm sorry someone said something they shouldn't have.\nI'm sorry things didn't go the way you hoped.\nWhatever happened...\nI hate that it made you feel like this.\nNow, can I ask you something?\nIs this something that's going to matter a week from now?\nMaybe.\nMaybe not.\nIf the answer is yes, then it's worth dealing with.\nIf the answer is no...\nThen maybe don't let it steal the rest of your day.\nSome people just aren't worth that much of your energy.\nAnd you?\nYour energy is way too precious to waste on people who don't deserve it.\nSo here's my very professional advice.\nTake a deep breath.\nDrink some water.\nPut on your favorite song.\nGo for a walk.\nPunch a pillow if you absolutely have to.\nJust... maybe don't send that text while you're still angry.\nFuture you will appreciate that.\nBesides...\nI like your smile a lot more than your angry face.\nAlthough...\nYour angry little rants are kind of cute.\nDon't let that go to your head.\nNow go reclaim the rest of your day.\nDon't let one bad moment convince you the whole day was ruined.\nYou're bigger than this.\nAnd if you're still mad after all that...\nCome tell me the whole story.\nI promise to act appropriately outraged with you.\n"Wait... they actually said that?"\n"No way."\n"You're kidding."\nSee?\nI've already got your side.` },
        { id: "happy", icon: "☀", theme: "happy", title: "Open When You're Happy", greeting: "Heyyy!!", closing: "Keep smiling,", ps: "I hope today keeps surprising you in the best ways. And if something even better happens... I expect to hear about it. ❤️", content: `Look at you!!\nYou're happy!!\nFinally, the universe decided to do its job for once.\nI love that.\nHonestly, I think the world is a much better place when it's being kind to you.\nYou deserve days that make you smile for absolutely no reason.\nYou deserve moments where you're laughing so hard your stomach hurts.\nYou deserve days that end with you thinking,\n"Today was actually really nice."\nIf something wonderful happened today...\nI hope you celebrated it.\nEven if it's something tiny.\nMaybe you finished something you've been working on.\nMaybe someone complimented you.\nMaybe you got good news.\nMaybe today just felt... lighter.\nWhatever it was...\nI'm so happy it happened to you.\nSometimes we're so busy waiting for the next big thing that we forget to enjoy the little victories.\nSo don't do that today.\nBe proud of yourself.\nSmile a little longer.\nReplay the happy moment in your head as many times as you want.\nThose moments deserve to stay with you.\nAnd selfishly...\nI wish I was there to see you smiling.\nBecause I think your smile is one of my favorite things in the world.\nSo keep it around for a while, okay?\nYou look really, really pretty wearing it.\nNow go enjoy your day.\nYou've earned it.\nNow stop reading this.\nGo enjoy your happy moment.\nThe letter will still be here tomorrow, but today won't.\nGo make another memory.\nAnd don't forget to tell me all about it later. ❤️` },
        { id: "goodnews", icon: "🎉", theme: "happy", title: "Open After Good News", greeting: "WAIT.", closing: "Celebrating with you,", ps: "I reserve the right to celebrate your wins even more than you do.", content: `YOU HAVE GOOD NEWS??\nAnd you're reading this before telling me??\nExcuse me??\nI should've been the first person to know.\nI'm offended.\n...\nOkay, not really.\nI'm just really happy for you.\nWhatever happened...\nI'm proud of you.\nYou work so hard for the things you care about, and I love seeing life reward you every once in a while.\nCelebrate it.\nPlease.\nDon't immediately move on to the next goal.\nDon't say,\n"It's not that big of a deal."\nIt is.\nIf it made you happy...\nThen it's worth celebrating.\nSo smile.\nTake pictures.\nTreat yourself.\nBrag a little.\nYou've earned it.\nAnd then...\nCome tell me everything.\nEvery tiny detail.\nI want the full story.\nNot the short version.\nThe entire thing.` },
        { id: "proud", icon: "✨", theme: "warm", title: "Open When You're Proud of Yourself", greeting: "Hey, pretty girl.", closing: "Endlessly proud,", ps: "Please don't follow this achievement with, 'It wasn't that hard.' We both know that's not true.", content: `Can I just say something?\nI'm really glad you're proud of yourself.\nYou should be.\nI know how hard you are on yourself sometimes.\nYou're always thinking about what you could've done better instead of looking at everything you've already accomplished.\nSo if today is one of those rare moments where you're looking at yourself and thinking,\n"I actually did pretty well."\nHold onto that feeling.\nDon't let your brain take it away five minutes later.\nBe proud.\nYou've earned that.\nAnd if you ever forget...\nI'll gladly remind you.\nBecause trust me...\nI've been proud of you for a long time.` },
        { id: "hug", icon: "🫂", theme: "warm", title: "Open When You Need A Hug", greeting: "Come here for a second.", closing: "Squeezing you tight,", ps: "Don't forget to drink water. Yes, I'm reminding you again. And no, this reminder isn't optional. 😌💜", content: `No, seriously.\nCome here.\nImagine I'm giving you the biggest hug ever.\nThe kind where you don't have to explain anything.\nNo pretending you're okay.\nNo fake smiles.\nNo "I'm fine."\nJust a hug.\nStay there for a few seconds.\n...\nThere.\nThat already feels a little better, doesn't it?\nI know hugs can't magically fix everything, but I really wish I could give you one whenever you needed it.\nAnd honestly...\nYou know you never have to go through things alone, right?\nYou can literally call me.\nAt any time.\nI don't care if it's early in the morning, late at night, or you've had the worst day ever.\nIf you need me, call me.\nI'll come over, give you the biggest hug imaginable, sit with you for as long as you need, listen to everything you want to say—or nothing at all if you don't feel like talking.\nWe'll order food, watch something, go for a drive, make tea, sit in complete silence, or do absolutely nothing together.\nWhatever helps.\nYou never have to earn my time.\nYou never have to apologize for needing someone.\nEspecially not me.\nSo the next time life feels a little too heavy...\nDon't just read this letter.\nCall me.\nI'd much rather be hugging you for real than have this letter do all the work.\nNow come over here.\nI still owe you one ridiculously long hug.\n🤍` },
        { id: "sick", icon: "🤒", theme: "sick", title: "Open When You're Sick", greeting: "Excuse me.", closing: "Get better soon,", ps: "Your mission is simple: drink your water, take your medicine, eat something, and get better. Failure to comply may result in me showing up and taking over your recovery myself. ❤️", content: `What is this?\nWho gave you permission to get sick?\nBecause I certainly didn't.\nI leave you unsupervised for five minutes and now you're ill?\nUnbelievable.\nThis is very inconvenient for me, you know.\nI don't like it when my favorite person isn't feeling like herself.\nI know you're probably sitting there saying,\n"I'm fine."\nNo.\nYou're sick.\nYou're officially banned from saying you're fine until I say otherwise.\nNow tell me...\nHave you been drinking enough water?\nTaken your medicine?\nActually rested?\nOr are you pretending you'll magically feel better while continuing to do everything except take care of yourself?\nYeah...\nThat's what I thought.\nListen to me for a minute.\nYour only job right now is to get better.\nThe dishes can wait.\nThe assignments can wait.\nThe messages can wait.\nThe world will survive without you being productive for a day or two.\nI promise.\nAnd if you're sitting there thinking,\n"I don't really feel like eating."\nToo bad.\nYou're eating anyway.\nIf you don't have anything at home...\nTell me.\nI'll order food for you.\nNo arguing.\nNo saying,\n"It's okay."\nBecause it's not okay if you're sitting there sick and refusing to eat.\nAnd yes...\nI will make sure you eat.\nYes, I'm threatening you with food again.\nApparently that's become one of my talents.\nHonestly...\nIf I could, I'd come over with soup, snacks, medicine, and enough blankets to turn you into the coziest burrito ever.\nI'd make sure you took your medicine on time, keep reminding you to drink water, and probably ask you every ten minutes if you're feeling any better.\nYou'd probably get annoyed with me...\nBut I'd still do it.\nBecause I care about you.\nAnd besides...\nSomeone has to take care of the sick baby.\n(Yes, I called you a baby.\nNo, you don't get to argue.\nYou're sick, so I've automatically won this debate.)\nNow be good.\nRest.\nWatch something comforting.\nSleep as much as you need.\nAnd let your body do its thing.\nI'll be here when you're feeling better.\nHopefully causing trouble with you instead of writing you sick letters.` },
        { id: "crying", icon: "💧", theme: "sad", title: "Open When You Feel Like Crying", interactive: "crying", greeting: "Hey, love.", closing: "Sleep well, pretty girl.", ps: "I hope one day you see yourself through my eyes. I think you'd finally understand why you're so easy to love. 🤍" },
        { id: "hungry", icon: "🍜", theme: "warm", title: "Open When You're Hungry", interactive: "hungry", greeting: "Ahem.", closing: "Go eat.", ps: "This letter is now judging you until you've eaten. 🍜❤️" }
    ];

    const cryingText = `If you opened this letter...\nI'm guessing today has been one of those days where you need a little reminder.\nSo let me remind you.\nYou are loved.\nNot because of what you achieve.\nNot because you're always cheerful.\nNot because you're doing everything perfectly.\nYou're loved because you're you.\nI wish you could see yourself the way I see you.\nYou'd notice the little things you never give yourself credit for.\nThe way you always remember the tiny details about people.\nThe way you make others feel comfortable without even trying.\nThe way your smile somehow makes everything around it feel a little lighter.\nThe way your laugh is so contagious that I can't help but smile too.\nYou're so busy worrying about whether you're enough that you forget something important.\nYou've been enough all along.\nYou don't have to earn love.\nYou don't have to compete for it.\nYou don't have to prove that you're worthy of it.\nYou already are.\nAnd I hope you never think you have to become someone else just to deserve being loved.\nBecause if I'm being honest...\nI wouldn't change a thing about you.\nNot your random little habits.\nNot the way you get excited over the smallest things.\nNot your stubbornness.\nNot your overthinking.\nNot even the moments when you doubt yourself.\nThose are all parts of the person I've come to care about so much.\nSo whenever life convinces you that you're difficult to love...\nRead this again.\nBecause I'll keep disagreeing with that thought every single time.\nYou are loved.\nCompletely.\nExactly as you are.\nAnd if one day you forget that...\nCome back here.\nI'll remind you as many times as you need.\nBefore you close this letter...\nI want you to do one thing for me.\nPut your hand over your heart for just a second.\nFeel that?\nThat's proof that you've made it through every hard day you've ever had.\nAnd somewhere out there...\nThere's someone who's incredibly grateful that heart belongs to you.\nI'll remind you again tomorrow if I have to.`;

    const hungryText = `Before you continue reading...\nI have one very important question.\nHave.\nYou.\nEaten?\nNo, "I'll eat later" is not an acceptable answer.\nNeither is "I forgot."\nAnd absolutely not "I just had coffee."\nThat is not food.\nI know you.\nYou'll keep saying,\n"I'll eat in five minutes."\nAnd somehow five minutes turns into three hours.\nWe're not doing that today.\nSo here's the deal.\nPause whatever you're doing.\nGo find something to eat.\nI genuinely don't care if it's a full meal, leftovers from yesterday, instant noodles, a sandwich, or breakfast at 4 p.m.\nJust eat something.\nYour body has been working hard for you all day.\nThe least you can do is give it some fuel.\nAnd before you say,\n"I'm not that hungry."\nYou probably are.\nYou've just ignored it long enough that your stomach gave up trying to convince you.\nAlso...\nIf you're sitting there thinking,\n"I don't really have anything to eat."\nTell me.\nSeriously.\nI'll order you food.\nNo arguments.\nNo "it's okay."\nNo "you don't have to."\nI know exactly what you're about to say, and the answer is still no.\nLet me.\nBesides...\nYes, I will make sure you eat.\nYes, I'm absolutely threatening you with food.\nAnd yes, it's because I know you'll somehow convince yourself you can survive on absolutely nothing all day.\nYou might get away with fooling everyone else.\nYou're not fooling me.\nNow...\nClose this letter.\nGo eat.\nThen you can come back and tell me what you had.\nAnd if your answer is,\n"Nothing."\nI'm going to pretend to be very disappointed in you.\n(Okay... not pretend. I actually will be.)\nSo go.\nShoo.\nYour food is waiting.`;

    // --- 4. The HTML Injection Function ---
    window.injectLettersEngine = function() {
        if (!document.getElementById('drawer-overlay')) {
            const engineHTML = `
                <div id="drawer-overlay">
                    <div class="drawer-header">━━━━━━━━━━━━━━━<br>💌<br>The Envelope Drawer<br>━━━━━━━━━━━━━━━<br><span style="font-size: 1.2rem; font-family: 'Quicksand'; letter-spacing: 1px; color: #8B6F97;">Pick whichever one your heart needs today.</span></div>
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

    window.injectLettersEngine();

    // --- 5. The Core Logic ---
    let activeLetter = null;

    window.openLetters = function() {
        const dash = document.getElementById('main-dashboard');
        const overlay = document.getElementById('drawer-overlay');
        const grid = document.getElementById('envelope-grid');
        
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
    };

    window.closeDrawer = function() {
        const dash = document.getElementById('main-dashboard');
        const overlay = document.getElementById('drawer-overlay');
        if(overlay) overlay.style.opacity = '0';
        if(dash) dash.style.filter = 'none';
        setTimeout(() => { if(overlay) overlay.style.display = 'none'; }, 800);
    };

    window.openEnvelope = function(id, element) {
        activeLetter = window.lettersData.find(l => l.id === id);
        element.classList.add('envelope-opening');
        
        if(window.crossfade) {
            window.crossfade('bg-smilebox', 0.2); 
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
                body.innerHTML = hungryText.replace(/\n/g, '<br>');
                footer.style.display = 'none';
                interactive.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:15px; align-items:center; margin-top:20px;">
                        <button class="letter-btn" style="background:#FFF6CC;" onclick="window.revealLetterInteractive('hungry', 'ate')">🍜 I Ate Something</button>
                        <button class="letter-btn" style="background:#FFDCEB;" onclick="window.revealLetterInteractive('hungry', 'starving')">😒 I'm Still Not Eating</button>
                    </div>
                `;
            } else {
                body.innerHTML = activeLetter.content.replace(/\n/g, '<br>');
                footer.style.display = 'block';
            }

            room.style.display = 'flex';
            setTimeout(() => { room.style.opacity = '1'; }, 50);
            setTimeout(() => { 
                paper.classList.add('paper-ready'); 
                controls.style.opacity = '1';
            }, 600); 
        }, 1200); 
    };

    window.revealLetterInteractive = function(type, response) {
        const body = document.getElementById('paper-body');
        const interactive = document.getElementById('interactive-zone');
        const footer = document.getElementById('paper-footer');
        
        if (type === 'crying') {
            let prefix = "";
            if(response === 'yes') prefix = "I'm listening. Take your time. Whatever is on your mind, I'm here. 💜<br><br>";
            if(response === 'later') prefix = "That's okay. You don't have to talk until you're ready. I'll just be here. 🌸<br><br>";
            if(response === 'unknown') prefix = "That happens sometimes. Your heart just needs to let it out. You're doing just fine. ☁️<br><br>";
            interactive.innerHTML = '';
            body.innerHTML = prefix + cryingText.replace(/\n/g, '<br>');
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

    window.foldLetter = function() {
        const room = document.getElementById('letter-room');
        const paper = document.getElementById('active-paper');
        const controls = document.getElementById('letter-controls');
        
        if(paper) paper.classList.remove('paper-ready');
        if(controls) controls.style.opacity = '0';
        if(room) room.style.opacity = '0';
        
        if(window.crossfade) {
            window.crossfade('bg-dashboard', 0.15); 
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
            window.crossfade('bg-dashboard', 0.15); 
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
