const textElements = [
    document.getElementById("text1"),
    document.getElementById("text2"),
    document.getElementById("text3")
];
const disappearOffsetMs = 50;
const startDisappearDelay = 700;

const audioStrings = [
    {
        str: "Today is election day",
        duration: 3
    },
    {
        str: "anxious",
        duration: 2
    },
    {
        str: "heightened anticipation",
        duration: 1.2
    },
    {
        str: "tonight",
        duration: 1.5
    },
    {
        str: "focus",
        duration: 1.5
    },
    {
        str: "what’s going to happen",
        duration: 2
    },
    {
        str: "rumination",
        duration: 1.2
    },
];

function stringToSpans(inputString) {
    return inputString.split('').map(char => `<span>${char}</span>`).join('');
}

function addDisappearClassToSpans(textElem) {
    const spans = textElem.querySelectorAll("span");
    setTimeout(() => {
        spans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add("disappeared");
                span.style.top = `${Math.random()*4 - 2}em`;
                span.style.left = `${Math.random()*4 - 2}em`;
            }, index * disappearOffsetMs);
        });
    }, startDisappearDelay);
}

function displayTextWithTiming(textElements, audioStrings) {
    let totalTime = 0;
    let elementIndex = 0;

    audioStrings.forEach((audio, index) => {
        // Set each text to appear after the cumulative total time has passed
        setTimeout(() => {
            const currentTextElem = textElements[elementIndex];
            currentTextElem.innerHTML = stringToSpans(audio.str);

            // Add fade-in effect
            currentTextElem.classList.add("fade-in");

            // Remove fade-in class after transition duration
            setTimeout(() => {
                currentTextElem.classList.remove("fade-in");
            }, 4000); // Adjust this duration with the CSS transition if needed

            addDisappearClassToSpans(currentTextElem);

            // Update to next text element
            elementIndex = (elementIndex + 1) % textElements.length;

        }, totalTime);

        // Increment totalTime by the duration for the next text
        totalTime += audio.duration * 1000; // Convert duration to milliseconds
    });
}

// Start the display function
displayTextWithTiming(textElements, audioStrings);
