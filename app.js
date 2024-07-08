// Initialize Firebase (replace with your own Firebase configuration)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to chat messages container
const chatMessages = document.getElementById('chatMessages');

// Reference to input field and send button
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Event listener for "Enter" key in message input field
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Event listener for send button click
sendButton.addEventListener('click', function() {
    sendMessage();
});

// Function to send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== '') {
        // Add message to Firestore
        db.collection('messages').add({
            text: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
            console.log('Message sent with ID: ', docRef.id);
            messageInput.value = ''; // Clear the input field
        })
        .catch(function(error) {
            console.error('Error adding message: ', error);
        });
    }
}

// Function to display messages in the UI
function displayMessages() {
    db.collection('messages').orderBy('timestamp')
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === 'added') {
                const message = change.doc.data();
                displayMessage(message);
            }
        });
    });
}

// Function to display a message in the UI
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message.text;
    chatMessages.appendChild(messageElement);
}

// Display initial messages
displayMessages();
