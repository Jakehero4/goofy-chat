// Initialize Firebase (ensure firebase-config.js contains your Firebase configuration)
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Get DOM elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesList = document.getElementById('messages');

// Function to send a message to Firestore
function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (messageText === '') {
        return; // Don't send empty messages
    }

    // Add a new document with a generated ID to the Firestore collection
    db.collection('messages').add({
        text: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
        console.log('Message sent with ID: ', docRef.id);
        messageInput.value = ''; // Clear the input field after sending
    })
    .catch(function(error) {
        console.error('Error sending message: ', error);
    });
}

// Event listener for Enter key press in the message input
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Event listener for Send button click
sendButton.addEventListener('click', function() {
    sendMessage();
});

// Real-time listener for incoming messages
db.collection('messages')
    .orderBy('timestamp') // Order messages by timestamp
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === 'added') {
                const message = change.doc.data();
                displayMessage(message);
            }
        });
    });

// Function to display messages in the UI
function displayMessage(message) {
    const messageElement = document.createElement('li');
    messageElement.textContent = message.text;
    messagesList.appendChild(messageElement);
}
