const textElements = [
    document.getElementById("text1"),
    document.getElementById("text2"),
    document.getElementById("text3")
];
const disappearOffsetMs = 50;
const startDisappearDelay = 400;

const audioStrings = [
    {
        str: "Today is election day",
        duration: 1.2
    },
    {
        str: "I'm guessing that",
        duration: 1.2
    },
    {
        str: "feeling very anxious.",
        duration: 1.2
    },
    {
        str: "heightened anticipation",
        duration: 1.2
    },
    {
        str: "what is going to happen",
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
            }, index * disappearOffsetMs);
        });
    }, startDisappearDelay);
}

function displayTextWithTiming(textElements, audioStrings) {
    let totalTime = 0;
    let elementIndex = 0;

    audioStrings.forEach((audio, index) => {
        totalTime += audio.duration * 1000; // Convert duration to milliseconds

        setTimeout(() => {
            const currentTextElem = textElements[elementIndex];
            currentTextElem.innerHTML = stringToSpans(audio.str);

            // Add fade-in effect
            currentTextElem.classList.add("fade-in");

            // Remove fade-in class after transition duration (500ms)
            setTimeout(() => {
                currentTextElem.classList.remove("fade-in");
            }, 3000); // Match this duration with the CSS transition

            addDisappearClassToSpans(currentTextElem);

            elementIndex = (elementIndex + 1) % textElements.length; // Cycle through text elements
        }, totalTime);
    });
}

// Start the display function
displayTextWithTiming(textElements, audioStrings);
