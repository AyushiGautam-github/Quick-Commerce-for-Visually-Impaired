// Initialize Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let currentField = null;

// Calculate and display the total amount based on cart items
document.addEventListener("DOMContentLoaded", () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalElement = document.getElementById('totalAmount');
    const cartContainer = document.getElementById('cartItemsContainer'); // Optional: If you want to display items

    let total = 0;

    // If you have a section to display cart items on the checkout page, uncomment the following:
    // cartItems.forEach(item => {
    //     const itemRow = document.createElement('div');
    //     itemRow.classList.add('cart-item');
    //     itemRow.innerHTML = `
    //         <span>${item.name}</span>
    //         <span>${item.quantity} x ₹${item.price}</span>
    //         <span>₹${item.quantity * item.price}</span>
    //     `;
    //     cartContainer.appendChild(itemRow);
    // });

    // Calculate total amount
    cartItems.forEach(item => {
        total += item.quantity * item.price;
    });

    // Display total amount
    if (totalElement) {
        totalElement.textContent = `₹${total.toFixed(2)}`;
    }
});

// Start the SpeechRecognition service
recognition.start();
console.log('Voice recognition activated.');

// Event listener for when a result is returned
recognition.onresult = event => {
    const command = event.results[0][0].transcript.trim().toLowerCase();
    console.log('Command received:', command);

    if (command.startsWith("name is")) {
        const name = command.replace("name is", "").trim();
        document.getElementById('name').value = name;
        currentField = "name";
    } else if (command.startsWith("address is")) {
        const address = command.replace("address is", "").trim();
        document.getElementById('address').value = address;
        currentField = "address";
    } else if (command.startsWith("phone number is")) {
        const phoneNumber = command.replace("phone number is", "").trim();
        document.getElementById('phone').value = phoneNumber;
        currentField = "phone";
    } else if (command === "return to cart") {
        document.getElementById('returnToCartBtn').click();
    } else if (command === "proceed to payment") {
        document.getElementById('proceedToPaymentBtn').click();
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
