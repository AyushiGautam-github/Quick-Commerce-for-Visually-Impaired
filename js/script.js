const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const synth = window.speechSynthesis;
let readingSectionId = null;

// Configure SpeechRecognition
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Start the SpeechRecognition service
recognition.start();
console.log('Speech recognition started.');

// Event listener for when a result is returned
recognition.onresult = event => {
    const command = event.results[0][0].transcript.trim().toLowerCase();
    console.log('Command received:', command);

    if (command === 'read') {
        if (readingSectionId) {
            const section = document.getElementById(readingSectionId);
            if (section) {
                readText(section.textContent);
            } else {
                console.log("Section not found for reading.");
            }
        } else {
            readText(document.body.textContent);
        }
    } else if (command === 'stop') {
        stopReading();
    } else if (command.startsWith('add to cart')) {
        const productName = command.replace('add to cart', '').trim();
        if (productName) {
            addProductToCartByVoice(productName);
        } else {
            console.log("Please specify a product name to add to cart.");
        }
    } else {
        navigateToSection(command);
    }
};

// Function to read text content
function readText(text) {
    stopReading(); // Stop any ongoing speech synthesis
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    console.log("Reading text:", text);
}

// Function to stop reading
function stopReading() {
    synth.cancel();
    console.log("Stopped reading.");
    readingSectionId = null; // Clear the current reading section
}

// Function to navigate to a section
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        readingSectionId = sectionId; // Set the section to read
        console.log("Navigated to section:", sectionId);
    } else {
        console.log('Section not found:', sectionId);
    }
}

// Function to add a product to the cart by voice
function addProductToCartByVoice(productName) {
    const productBoxes = document.querySelectorAll('.products .box');
    let found = false;

    productBoxes.forEach(box => {
        const name = box.getAttribute('data-name').toLowerCase();

        if (name === productName) {
            const productTitle = box.querySelector('h3').textContent;
            const productPrice = parseInt(box.querySelector('.Price').textContent.replace(/[^0-9]/g, ''));
            const productImgSrc = box.querySelector('img').getAttribute('src');
            
            // Add product to cart
            addToCart(productTitle, productPrice, productImgSrc);
            found = true;
            console.log(`Product added to cart: ${productTitle}`);

            // Redirect to cart page
            window.location.href = 'cart.html';
        }
    });

    if (!found) {
        console.log(`Product not found: ${productName}`);
    }
}

// Sample addToCart function for demonstration
function addToCart(name, price, imgSrc) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: name,
            price: price,
            imgSrc: imgSrc,
            quantity: 1
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Restart SpeechRecognition service if it stops
recognition.onend = () => {
    console.log('Speech recognition service has ended. Restarting...');
    recognition.start();
};

// Handle speech recognition errors
recognition.onerror = event => {
    console.error('Speech recognition error:', event.error);
};
