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

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value.trim().toLowerCase();
        
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'inline-block';

        try {
            // Use the email as the document ID for easy lookup
            const userRef = doc(db, "users", email);
            await setDoc(userRef, {
                email: email,
                gift: null, // Gift is initially null
                registeredAt: new Date()
            });

            console.log("User successfully registered!");
            document.getElementById('main-container').style.display = 'none';
            showGiftSection();

        } catch (error) {
            console.error("Error writing document: ", error);
            alert("Registration failed! This email might already be registered. Please try with another email or contact support.");
            submitButton.disabled = false;
            buttonText.style.display = 'inline-block';
            spinner.style.display = 'none';
        }
    });

    function showGiftSection() {
        const giftContainer = document.getElementById('gift-container');
        const giftBoxesContainer = document.querySelector('.gift-boxes');
        giftContainer.style.display = 'block';

        for (let i = 0; i < 6; i++) {
            const giftBox = document.createElement('div');
            giftBox.className = 'gift-box';
            giftBox.innerHTML = `
                <div class="box-face box-front">🎁</div>
                <div class="box-face box-back"></div>
            `;
            giftBox.addEventListener('click', () => openGift(giftBox), { once: true });
            giftBoxesContainer.appendChild(giftBox);
        }
    }

    async function openGift(clickedBox) {
        document.querySelectorAll('.gift-box').forEach(box => {
            box.style.pointerEvents = 'none';
        });

        clickedBox.classList.add('is-opened');
        
        const gifts = [
            '₹500 Gift Voucher', '₹200 Cash Prize', 'Guaranteed Verification Badge!', 'Free Monetization!',
            'Sorry, Empty Box!', 'Sorry, Empty Box!', 'Sorry, Empty Box!', 'Sorry, Empty Box!'
        ];
        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        const email = document.getElementById('email').value.trim().toLowerCase();

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
            }, 800);

        } catch (error) {
            console.error("Error updating gift: ", error);
            backFace.textContent = "Error!";
            alert("There was an error saving your gift. Please refresh and try again.");
        }
    }
});
// ▼▼▼ MUSIC AUTOPLAY FIX ▼▼▼
const backgroundMusic = document.getElementById('background-music');
let musicStarted = false;

// Is function se music start hoga
async function playMusic() {
    if (!musicStarted) {
        try {
            await backgroundMusic.play();
            musicStarted = true;
            // Pehli baar click ke baad is listener ko hata dein
            document.body.removeEventListener('click', playMusic);
            console.log("Music started successfully!");
        } catch (error) {
            console.error("Music play failed:", error);
        }
    }
}

// Body par kahin bhi click karne par music start karne ki koshish karein
document.body.addEventListener('click', playMusic);
// ▲▲▲ MUSIC AUTOPLAY FIX ▲▲▲
