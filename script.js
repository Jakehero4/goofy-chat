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
  displayMessage(message);
});

// Function to send a new message
window.sendMessage = function() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value;
  const user = auth.currentUser; // Get the current user

  if (messageText.trim() !== "" && user) {
    // Push the message to the database with user details and timestamp
    messagesRef.push({
      text: messageText,
      username: user.displayName,
      profilePic: user.photoURL,
      timestamp: new Date().toISOString() // Add a timestamp
    });
    messageInput.value = ""; // Clear the input field
  }
};

function displayMessage(message) {
  const messagesContainer = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  // Create a user info section
  const userInfo = document.createElement("div");
  userInfo.classList.add("user-info");

  // Profile picture
  const profilePic = document.createElement("img");
  profilePic.src = message.profilePic;
  profilePic.alt = message.username;
  profilePic.classList.add("profile-pic");

  // Username
  const usernameElement = document.createElement("span");
  usernameElement.textContent = message.username;
  usernameElement.classList.add("username");

  // Append profile picture and username to user info
  userInfo.appendChild(profilePic);
  userInfo.appendChild(usernameElement);

  // Timestamp
  const timestampElement = document.createElement("span");
  timestampElement.textContent = new Date().toLocaleTimeString(); // Adjust this according to your timestamp format
  timestampElement.classList.add("timestamp");

  // Message text
  const textElement = document.createElement("p");
  textElement.textContent = message.text;
  textElement.classList.add("message-text");

  // Append user info, timestamp, and text to the message element
  messageElement.appendChild(userInfo);
  messageElement.appendChild(timestampElement); // Timestamp goes above the message text
  messageElement.appendChild(textElement);

  // Append the message element to the containers
  messagesContainer.appendChild(messageElement);

  // Scroll to the bottom of the chat
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
