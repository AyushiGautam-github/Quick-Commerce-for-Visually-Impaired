// Initialize Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let currentField = null;

// Start the SpeechRecognition service
recognition.start();
console.log('Voice recognition activated.');

// Event listener for when a result is returned
recognition.onresult = event => {
    const command = event.results[0][0].transcript.trim().toLowerCase();
    console.log('Command received:', command);

    if (command.startsWith("name is")) {
        const name = command.replace("name is", "").trim();
        document.getElementById('fullName').value = name;
        currentField = "fullName";
    } 
    else if (command.startsWith("card number is")) {
        const cardNumber = command.replace("card number is", "").trim();
        document.getElementById('cardNumber').value = cardNumber;
        currentField = "cardNumber";
    } else if (command.startsWith("expiry date is")) {
        const expiryDate = command.replace("expiry date is", "").trim();
        document.getElementById('expiryDate').value = expiryDate;
        currentField = "expiryDate";
    } else if (command.startsWith("cvc is")) {
        const cvc = command.replace("cvc is", "").trim();
        document.getElementById('cvc').value = cvc;
        currentField = "cvc";
    } else if (command === "proceed to payment") {
        window.location.href = 'orderplace.html';
    } else if (command === "back to checkout") {
        window.location.href = 'checkout.html';
    } else if (command === "stop") {
        recognition.stop();
        console.log('Voice recognition stopped.');
    } else {
        console.log('Command not recognized.');
    }
};

// Restart SpeechRecognition service if it stops unexpectedly
recognition.onend = () => {
    if (currentField) {
        console.log(`Voice input ended for: ${currentField}`);
        currentField = null;
    }
    // Re-enable recognition if it was not intentionally stopped
    recognition.start();
};

// Handle speech recognition errors
recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
    recognition.stop();
    setTimeout(() => recognition.start(), 1000); // Restart after a short delay
};
