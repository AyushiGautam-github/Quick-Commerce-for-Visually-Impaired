// Initialize Speech Recognition and Speech Synthesis
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const synth = window.speechSynthesis;

// Configure Speech Recognition
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Function to read page content and instructions
function readPageContent() {
    // Stop any ongoing speech synthesis to prevent overlap
    if (synth.speaking) {
        synth.cancel();
    }
    
    // Text to be read aloud
    const text = "Order placed successfully! Say 'go to home' to go to home.";
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Check when speaking is complete, then restart listening
    utterance.onend = () => {
        console.log("Finished reading the page content.");
        recognition.start(); // Start listening again after reading content
    };
    
    // Start speaking the content
    synth.speak(utterance);
}

// Start Speech Recognition
recognition.start();

// Event listener for recognized speech commands
recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.trim().toLowerCase();
    console.log('Command received:', command);

    // Check for the "read" command to read page content aloud
    if (command === 'read') {
        readPageContent();
    } 
    // Check for variations of the "go to home" command
    else if (command.includes('go to home') || command.includes('return to home') || command.includes('home')) {
        window.location.href = 'index.html'; // Redirect to home
    } else {
        console.log('Command not recognized:', command);
    }
};

// Restart Speech Recognition if it stops
recognition.onend = () => {
    // Restart speech recognition only if not currently speaking
    if (!synth.speaking) {
        recognition.start();
    }
};

// Handle errors
recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
};
