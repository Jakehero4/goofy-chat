// Import the functions needed from Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded } from "firebase/database";

// Firebase configuration (same as what you provided)
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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize the Realtime Database

// Reference to the messages in the database
const messagesRef = ref(database, "messages");

// Listen for new messages added to the database
onChildAdded(messagesRef, (snapshot) => {
  const message = snapshot.val();
  displayMessage(message.text);
});

// Function to send a new message
function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value;

  if (messageText.trim() !== "") {
    // Push the message to the database
    push(messagesRef, { text: messageText });
    messageInput.value = ""; // Clear the input field
  }
}

// Function to display messages in the chat window
function displayMessage(text) {
  const messagesContainer = document.getElementById("messages");
  const messageElement = document.createElement("p");
  messageElement.textContent = text;
  messagesContainer.appendChild(messageElement);

  // Scroll to the bottom of the chat
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
