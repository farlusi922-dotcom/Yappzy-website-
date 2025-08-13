// Import functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = { apiKey: "AIzaSyC3LsTKS2BGyL1rVrnkFHnZkuo-fQKFY2w", authDomain: "independence-day-yappzy.firebaseapp.com", projectId: "independence-day-yappzy", storageBucket: "independence-day-yappzy.appspot.com", messagingSenderId: "257916895856", appId: "1:257916895856:web:4a8c1e0f4d8c3fd2312ab5" };
// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.querySelector('.button-text');
    const spinner = document.querySelector('.spinner');
    const bulletSound = document.getElementById('bullet-sound');
    const boxOpenSound = document.getElementById('box-open-sound'); // New sound element

    const registeredEmail = localStorage.getItem('yappzy_registered_email');
    if (registeredEmail) { showThankYouMessage(); }

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (bulletSound) { bulletSound.currentTime = 0; bulletSound.play(); }
        const email = document.getElementById('email').value.trim().toLowerCase();
        submitButton.disabled = true; buttonText.style.display = 'none'; spinner.style.display = 'inline-block';
        try {
            const userRef = doc(db, "users", email);
            await setDoc(userRef, { email: email, gift: null, registeredAt: new Date() });
            localStorage.setItem('yappzy_registered_email', email);
            setTimeout(() => { document.getElementById('main-container').style.display = 'none'; showGiftSection(); }, 300);
        } catch (error) {
            console.error("Error writing document: ", error); alert("Registration failed! This email might already be registered.");
            submitButton.disabled = false; buttonText.style.display = 'inline-block'; spinner.style.display = 'none';
        }
    });

    function showGiftSection() {
        const giftContainer = document.getElementById('gift-container');
        const giftBoxesContainer = document.querySelector('.gift-boxes');
        giftBoxesContainer.innerHTML = ''; // Clear previous content
        giftContainer.style.display = 'block';

        // Create 3 premium gift boxes
        for (let i = 0; i < 3; i++) {
            const scene = document.createElement('div');
            scene.className = 'gift-box-scene';
            scene.innerHTML = `
                <div class="gift-box-container">
                    <div class="box-lid">
                        <div class="box-face top"></div>
                        <div class="ribbon-face top-h"></div>
                        <div class="ribbon-face top-v"></div>
                        <div class="box-face front"></div>
                        <div class="box-face back"></div>
                        <div class="box-face left"></div>
                        <div class="box-face right"></div>
                    </div>
                    <div class="box-base">
                        <div class="box-face front"></div>
                        <div class="ribbon-face front-v"></div>
                        <div class="box-face back"></div>
                        <div class="box-face left"></div>
                        <div class="box-face right"></div>
                        <div class="ribbon-face right-v"></div>
                        <div class="box-face bottom"></div>
                    </div>
                    <div class="box-glow"></div>
                    <div class="prize-card">
                        <h4>You've Won</h4>
                        <p class="prize-text"></p>
                    </div>
                </div>`;
            scene.addEventListener('click', () => openGift(scene), { once: true });
            giftBoxesContainer.appendChild(scene);
        }
    }

    async function openGift(clickedScene) {
        if (boxOpenSound) { boxOpenSound.currentTime = 0; boxOpenSound.play(); }
        
        document.querySelectorAll('.gift-box-scene').forEach(scene => {
            scene.style.pointerEvents = 'none'; // Disable clicking on other boxes
        });

        const container = clickedScene.querySelector('.gift-box-container');
        container.classList.add('is-opening');
        
        const gifts = ['₹500 Gift Voucher', '₹200 Cash Prize', 'Verification Badge!', 'Free Monetization!', 'Sorry, Empty Box!', 'Sorry, Empty Box!'];
        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        const email = localStorage.getItem('yappzy_registered_email');

        // Update the prize card text
        clickedScene.querySelector('.prize-text').textContent = randomGift;

        try {
            const userRef = doc(db, "users", email);
            await updateDoc(userRef, { gift: randomGift });
            console.log("Gift successfully updated!");

            // Show the OK button after animation completes
            setTimeout(() => {
                document.getElementById('gift-message-container').style.display = 'block';
                const backToHomeBtn = document.getElementById('back-to-home-btn');
                backToHomeBtn.style.display = 'inline-block';
                backToHomeBtn.addEventListener('click', () => {
                    document.getElementById('gift-container').style.display = 'none';
                    document.getElementById('main-container').style.display = 'block';
                    showThankYouMessage();
                }, { once: true });
            }, 2500); // Wait for animations to finish

        } catch (error) {
            console.error("Error updating gift: ", error);
            clickedScene.querySelector('.prize-text').textContent = "Error!";
        }
    }

    function showThankYouMessage() {
        const offerDescription = document.querySelector('.offer-description');
        const registrationForm = document.getElementById('registration-form');
        offerDescription.innerHTML = "<strong>Thank you for registering!</strong><br>We have saved your spot. We'll see you at the app launch in November 2025!";
        registrationForm.style.display = 'none';
    }
    
    const backgroundMusic = document.getElementById('background-music');
    let musicStarted = false;
    async function playMusic() { if (!musicStarted) { try { await backgroundMusic.play(); musicStarted = true; document.body.removeEventListener('click', playMusic); } catch (e) { console.error(e); } } }
    document.body.addEventListener('click', playMusic);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible') { backgroundMusic.pause(); } else if (musicStarted) { backgroundMusic.play(); } });
});
