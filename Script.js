// Import functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3LsTKS2BGyL1rVrnkFHnZkuo-fQKFY2w",
  authDomain: "independence-day-yappzy.firebaseapp.com",
  projectId: "independence-day-yappzy",
  storageBucket: "independence-day-yappzy.appspot.com",
  messagingSenderId: "257916895856",
  appId: "1:257916895856:web:4a8c1e0f4d8c3fd2312ab5"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.querySelector('.button-text');
    const spinner = document.querySelector('.spinner');

    // Check if user has already registered in this browser session
    const registeredEmail = localStorage.getItem('yappzy_registered_email');
    if (registeredEmail) {
        showThankYouMessage();
    }

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value.trim().toLowerCase();
        
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'inline-block';

        try {
            const userRef = doc(db, "users", email);
            await setDoc(userRef, {
                email: email,
                gift: null,
                registeredAt: new Date()
            });

            console.log("User successfully registered!");
            localStorage.setItem('yappzy_registered_email', email); // Save registration status
            document.getElementById('main-container').style.display = 'none';
            showGiftSection();

        } catch (error) {
            console.error("Error writing document: ", error);
            alert("Registration failed! This email might already be registered.");
            submitButton.disabled = false;
            buttonText.style.display = 'inline-block';
            spinner.style.display = 'none';
        }
    });

    function showGiftSection() {
        const giftContainer = document.getElementById('gift-container');
        const giftBoxesContainer = document.querySelector('.gift-boxes');
        giftBoxesContainer.innerHTML = ''; // Clear previous boxes if any
        giftContainer.style.display = 'block';

        for (let i = 0; i < 6; i++) {
            const giftBox = document.createElement('div');
            giftBox.className = 'gift-box';
            giftBox.innerHTML = `<div class="box-face box-front">🎁</div><div class="box-face box-back"></div>`;
            giftBox.addEventListener('click', () => openGift(giftBox), { once: true });
            giftBoxesContainer.appendChild(giftBox);
        }
    }

    async function openGift(clickedBox) {
        document.querySelectorAll('.gift-box').forEach(box => {
            box.style.pointerEvents = 'none';
        });

        clickedBox.classList.add('is-opened');
        
        const gifts = ['₹500 Gift Voucher', '₹200 Cash Prize', 'Guaranteed Verification Badge!', 'Free Monetization!', 'Sorry, Empty Box!', 'Sorry, Empty Box!'];
        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        const email = localStorage.getItem('yappzy_registered_email');

        const backFace = clickedBox.querySelector('.box-back');
        backFace.textContent = "Revealing...";

        try {
            const userRef = doc(db, "users", email);
            await updateDoc(userRef, { gift: randomGift });
            console.log("Gift successfully updated!");

            setTimeout(() => {
                backFace.textContent = randomGift;
                document.getElementById('gift-message').textContent = `You've won: ${randomGift}`;
                document.getElementById('gift-message-container').style.display = 'block';
                
                // Show the "OK" button
                const backToHomeBtn = document.getElementById('back-to-home-btn');
                backToHomeBtn.style.display = 'inline-block';
                backToHomeBtn.addEventListener('click', () => {
                    document.getElementById('gift-container').style.display = 'none';
                    document.getElementById('main-container').style.display = 'block';
                    showThankYouMessage(); // Show thank you message on home screen
                });
            }, 800);

        } catch (error) {
            console.error("Error updating gift: ", error);
            backFace.textContent = "Error!";
        }
    }

    function showThankYouMessage() {
        const offerDescription = document.querySelector('.offer-description');
        const registrationForm = document.getElementById('registration-form');
        offerDescription.innerHTML = "<strong>Thank you for registering!</strong><br>We have saved your spot. We'll see you at the app launch in November 2025!";
        registrationForm.style.display = 'none';
    }
});

// ▼▼▼ MUSIC AUTOPLAY FIX ▼▼▼
const backgroundMusic = document.getElementById('background-music');
let musicStarted = false;

async function playMusic() {
    if (!musicStarted) {
        try {
            await backgroundMusic.play();
            musicStarted = true;
            document.body.removeEventListener('click', playMusic);
            console.log("Music started successfully!");
        } catch (error) {
            console.error("Music play failed:", error);
        }
    }
}
document.body.addEventListener('click', playMusic);
// ▲▲▲ MUSIC AUTOPLAY FIX ▲▲▲
