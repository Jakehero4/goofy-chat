// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAs9x7gUbXmlwSo3nFK8BpJGjVLNpFXQA",
  authDomain: "goofy-chat-8fe24.firebaseapp.com",
  databaseURL: "https://goofy-chat-8fe24-default-rtdb.firebaseio.com",
  projectId: "goofy-chat-8fe24",
  storageBucket: "goofy-chat-8fe24.appspot.com",
  messagingSenderId: "881596865630",
  appId: "1:881596865630:web:52eea86293545560a928cf",
  measurementId: "G-2DRHGM50RM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Google Sign-In
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Sign in with Google
document.getElementById('googleSignInBtn').onclick = function() {
  auth.signInWithPopup(googleProvider)
    .then((result) => {
      const user = result.user;
      console.log('User signed in:', user);
      document.querySelector('.auth-container').style.display = 'none';
      document.querySelector('.chat-container').style.display = 'block';
    })
    .catch((error) => {
      console.error('Error during sign-in:', error);
    });
};

// Sign Out
document.getElementById('signOutBtn').onclick = function() {
  auth.signOut().then(() => {
    console.log('User signed out');
    document.querySelector('.auth-container').style.display = 'block';
    document.querySelector('.chat-container').style.display = 'none';
  }).catch((error) => {
    console.error('Error during sign-out:', error);
  });
};

// Monitor Auth State
auth.onAuthStateChanged((user) => {
  if (user) {
    document.querySelector('.auth-container').style.display = 'none';
    document.querySelector('.chat-container').style.display = 'block';
  } else {
    document.querySelector('.auth-container').style.display = 'block';
    document.querySelector('.chat-container').style.display = 'none';
  }
});

// Reference to the messages in the database
const messagesRef = database.ref("messages");

// Listen for new messages added to the database
messagesRef.on("child_added", (snapshot) => {
  const message = snapshot.val();
  displayMessage(message.text);
});

// Function to send a new message
window.sendMessage = function() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value;

  if (messageText.trim() !== "") {
    // Push the message to the database
    messagesRef.push({ text: messageText });
    messageInput.value = ""; // Clear the input field
  }
};

// Function to display messages in the chat window
function displayMessage(text) {
  const messagesContainer = document.getElementById("messages");
  const messageElement = document.createElement("p");
  messageElement.textContent = text;
  messagesContainer.appendChild(messageElement);

  // Scroll to the bottom of the chat
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}