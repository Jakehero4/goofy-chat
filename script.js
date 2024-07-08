// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBAs9x7gUbXmlwSo3nFK8BpJGjVLNpFXQA",
    authDomain: "goofy-chat-8fe24.firebaseapp.com",
    projectId: "goofy-chat-8fe24",
    storageBucket: "goofy-chat-8fe24.appspot.com",
    messagingSenderId: "881596865630",
    appId: "1:881596865630:web:52eea86293545560a928cf"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const chatContainer = document.getElementById('chat-container');
const loginContainer = document.getElementById('login-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesDiv = document.getElementById('messages');

loginButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
});

logoutButton.addEventListener('click', () => {
    auth.signOut();
});

auth.onAuthStateChanged(user => {
    if (user) {
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'block';
        loadMessages();
    } else {
        loginContainer.style.display = 'block';
        chatContainer.style.display = 'none';
    }
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        db.collection('messages').add({
            text: message,
            uid: auth.currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = '';
    }
});

function loadMessages() {
    db.collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
        messagesDiv.innerHTML = '';
        snapshot.forEach(doc => {
            const message = doc.data();
            const messageElement = document.createElement('div');
            messageElement.textContent = message.text;
            messagesDiv.appendChild(messageElement);
        });
    });
}
