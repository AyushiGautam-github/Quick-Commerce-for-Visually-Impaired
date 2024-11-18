const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const synth = window.speechSynthesis; // Define synth for speech synthesis
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Start the SpeechRecognition service
recognition.start();
console.log('Voice recognition started for cart.');

// Event listener for recognized commands
recognition.onresult = event => {
    const command = event.results[0][0].transcript.trim().toLowerCase();
    console.log('Command received:', command);

    if (command === 'checkout') {
        triggerCheckout();
    } else if (command === 'continue shopping') {
        continueShopping();
    } else if (command.startsWith('remove')) {
        const itemName = command.replace('remove', '').trim(); // Extract item name
        removeItemFromCart(itemName);
    } else if (command === 'read cart') {
        readCartContents();
    } else if (command === 'stop') {
        stopReading();
    } else {
        console.log('Command not recognized.');
    }
};

// Function to simulate checkout button click
function triggerCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.click();
        console.log('Proceeding to checkout.');
    } else {
        console.log('Checkout button not found.');
    }
}

// Function to redirect to shopping page
function continueShopping() {
    window.location.href = 'index.html';
    console.log('Continuing shopping.');
}

// Function to remove an item from the cart
function removeItemFromCart(name) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (itemIndex > -1) {
        const removedItem = cartItems.splice(itemIndex, 1)[0];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart(); // Refresh the cart display after removal
        console.log(`Removed ${removedItem.name} from cart.`);
    } else {
        console.log(`Item not recognized or found in cart: ${name}`);
    }
}

// Function to read cart contents aloud
function readCartContents() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let cartText;

    if (cartItems.length > 0) {
        cartText = cartItems.map(item => `${item.name}, quantity: ${item.quantity}`).join('. ');
    } else {
        cartText = 'Your cart is empty.';
    }

    console.log('Reading cart contents:', cartText); // Log the text being read
    readText(cartText);
}

// Function to read text aloud
// Function to read text aloud
function readText(text) {
    stopReading(); // Stop any current reading
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Event listeners for the utterance to track when it's started and ended
    utterance.onstart = () => {
        console.log('Started speaking:', text);
    };
    
    utterance.onend = () => {
        console.log('Finished speaking.');
    };

    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
    };

    synth.speak(utterance);
}


// Function to stop reading aloud
function stopReading() {
    synth.cancel();
    console.log('Stopped reading.');
}

// Restart SpeechRecognition service if it stops
recognition.onend = () => {
    console.log('Voice recognition service has ended. Restarting...');
    recognition.start();
};

// Handle speech recognition errors
recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
};
