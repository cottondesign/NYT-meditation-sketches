# Project Overview

## Live Preview & Repository Access
- **Live Sketches:** See the latest version of live sketches [here](#).
- **GitHub Repository:** This is a public repository, enabling the development team to access and make changes seamlessly.

## Feature Breakdown

### 1. Color Mesh Gradient
**File:** `/js/meshGradient.js`

- **Color:** Adjusted to a new color palette. You can easily swap colors by modifying the hex values on **Line 11**. Just replace them with the desired color codes.
- **Speed:** The animation speed has been tweaked but can be further customized on **Line 8**.
- **Number of Gradients:** This parameter is adjustable on **Line 6** if you want to experiment with the gradient density.
- **In Progress:** Currently, gradients are centered on the canvas. Work is underway to make them fill the full screen; no anticipated issues.

### 2. Color Mesh Gradient + Color Change
**Status:** In progress

- This addition aims to create a smooth, meditative transition between colors.
- Estimated time for completion: **1–2 hours.**
- Once finished, it will be easy to swap in/out with the existing gradient setup.

### 3. + Text Display
**File:** `/js/disappearingText.js`

- **Text:** Each line of text is defined in an array, with durations assigned to control display time. Easily modifiable in the initial lines of the code.
- **Blur/Effect:** The current text disappearance effect is managed purely with CSS.
  - **Effect Style:** Located in `disappearingText.css` on **Line 35** (`.text span.disappeared`), where you can adjust the appearance of disappearing text.
  - **Timing:** The transition speed is on **Line 42** of the CSS file, while the start delay and letter delay can be modified on **Lines 6 and 7** in the JavaScript file.

## Notes
This ReadMe consolidates all information for quick reference. Any additional questions can be directed my way till the end of the day.

— Talia
