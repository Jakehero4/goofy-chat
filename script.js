// Firebase configuration (use your actual Firebase project details here)
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
const storage = firebase.storage();

// Google Sign-In
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Sign in with Google
document.getElementById('googleSignInBtn').onclick = function() {
  auth.signInWithPopup(googleProvider)
    .then((result) => {
      const user = result.user;
      console.log('User signed in:', user);
      toggleChatUI(user);
    })
    .catch((error) => {
      console.error('Error during sign-in:', error);
    });
};

// Sign up with email and password
document.getElementById('emailSignUpBtn').onclick = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User signed up:', user);
      toggleChatUI(user); // Go to chat room after signup
    })
    .catch((error) => {
      console.error('Error during sign-up:', error);
      alert(error.message); // Show error to the user
    });
};

// Sign in with email and password
document.getElementById('emailSignInBtn').onclick = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User signed in:', user);
      toggleChatUI(user);
    })
    .catch((error) => {
      console.error('Error during sign-in:', error);
      alert(error.message); // Show error to the user
    });
};

// Sign Out
document.getElementById('signOutBtn').onclick = function() {
  auth.signOut().then(() => {
    console.log('User signed out');
    toggleAuthUI();
  }).catch((error) => {
    console.error('Error during sign-out:', error);
  });
};

// Monitor Auth State
auth.onAuthStateChanged((user) => {
  if (user) {
    toggleChatUI(user);
    loadMessages();
    showUserSettings(user); // Show the user settings to set profile
  } else {
    toggleAuthUI();
  }
});

// Function to toggle visibility between authentication and chat UI
function toggleAuthUI() {
  document.querySelector('.auth-container').style.display = 'block';
  document.querySelector('.chat-container').style.display = 'none';
  document.querySelector('.private-chat-container').style.display = 'none';
  document.querySelector('.user-settings').style.display = 'none';
}

function toggleChatUI(user) {
  document.querySelector('.auth-container').style.display = 'none';
  document.querySelector('.chat-container').style.display = 'block';
  document.getElementById('signOutBtn').style.display = 'inline-block'; // Show sign-out button
  loadMessages();
}

// Function to load public messages from Firebase
function loadMessages() {
  const messagesRef = database.ref("messages");
  messagesRef.on("child_added", (snapshot) => {
    const message = snapshot.val();
    displayMessage(message);
  });
}

// Function to send a public message
window.sendMessage = function() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value;
  const user = auth.currentUser;

  if (messageText.trim() !== "" && user) {
    const messagesRef = database.ref("messages");
    messagesRef.push({
      text: messageText,
      username: user.displayName || user.email,
      profilePic: user.photoURL,
      timestamp: firebase.database.ServerValue.TIMESTAMP, // Store timestamp on server
      senderId: user.uid,
    });
    messageInput.value = ""; // Clear the input field
  }
};

// Function to display a message
function displayMessage(message) {
  const messagesContainer = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  // Create user info section
  const userInfo = document.createElement("div");
  userInfo.classList.add("user-info");

  const profilePic = document.createElement("img");
  profilePic.src = message.profilePic || "default-profile-pic.png";
  profilePic.alt = message.username;
  profilePic.classList.add("profile-pic");

  const usernameElement = document.createElement("span");
  usernameElement.textContent = message.username;
  usernameElement.classList.add("username");

  userInfo.appendChild(profilePic);
  userInfo.appendChild(usernameElement);

  const timestampElement = document.createElement("span");
  timestampElement.textContent = new Date(message.timestamp).toLocaleTimeString();
  timestampElement.classList.add("timestamp");

  const textElement = document.createElement("p");
  textElement.textContent = message.text;
  textElement.classList.add("message-text");

  messageElement.appendChild(userInfo);
  messageElement.appendChild(timestampElement);
  messageElement.appendChild(textElement);

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to send a private message
window.sendPrivateMessage = function(receiverId) {
  const privateMessageInput = document.getElementById("privateMessageInput");
  const messageText = privateMessageInput.value;
  const user = auth.currentUser;

  if (messageText.trim() !== "" && user) {
    const privateMessagesRef = database.ref("privateMessages");
    const messageData = {
      text: messageText,
      username: user.displayName || user.email,
      senderId: user.uid,
      receiverId: receiverId,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };

    privateMessagesRef.child(user.uid).child(receiverId).push(messageData);
    privateMessagesRef.child(receiverId).child(user.uid).push(messageData);
    
    privateMessageInput.value = "";
  }
};

// Function to load private messages between the current user and a selected receiver
function loadPrivateMessages(receiverId) {
  const user = auth.currentUser;
  const privateMessagesRef = database.ref("privateMessages");

  privateMessagesRef.child(user.uid).child(receiverId).on("child_added", function(snapshot) {
    const message = snapshot.val();
    displayPrivateMessage(message);
  });
}

// Function to display a private message
function displayPrivateMessage(message) {
  const privateMessagesContainer = document.getElementById("privateMessages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  const userInfo = document.createElement("div");
  userInfo.classList.add("user-info");

  const profilePic = document.createElement("img");
  profilePic.src = message.profilePic || "default-profile-pic.png";
  profilePic.alt = message.username;
  profilePic.classList.add("profile-pic");

  const usernameElement = document.createElement("span");
  usernameElement.textContent = message.username;
  usernameElement.classList.add("username");

  userInfo.appendChild(profilePic);
  userInfo.appendChild(usernameElement);

  const timestampElement = document.createElement("span");
  timestampElement.textContent = new Date(message.timestamp).toLocaleTimeString();
  timestampElement.classList.add("timestamp");

  const textElement = document.createElement("p");
  textElement.textContent = message.text;
  textElement.classList.add("message-text");

  messageElement.appendChild(userInfo);
  messageElement.appendChild(timestampElement);
  messageElement.appendChild(textElement);

  privateMessagesContainer.appendChild(messageElement);
  privateMessagesContainer.scrollTop = privateMessagesContainer.scrollHeight;
}

// Select a user to start a private chat
function startPrivateChat(receiverId) {
  document.querySelector('.chat-container').style.display = 'none';
  document.querySelector('.private-chat-container').style.display = 'block';
  loadPrivateMessages(receiverId);
}
