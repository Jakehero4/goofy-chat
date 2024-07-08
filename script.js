document.getElementById('send-button').addEventListener('click', function() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  if (message) {
    addMessageToChat(message);
    messageInput.value = '';
  }
});

function addMessageToChat(message) {
  const messagesContainer = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = message;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
