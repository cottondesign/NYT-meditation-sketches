const sketch = (p) => {
    let ctx;

    // {pos1, r1, c1, pos2, r2, c2, offsetX, offsetY, startColor, endColor, t}
    const gradData = [];
    const numGradients = 30;

    const speed = 0.002;
    const transitionSpeed = 0.01;
    const pos1Speed = 0.001;

    const spreadFactorX = 1.5; // Increase this factor to spread more horizontally
const spreadFactorY = 1.5; // Increase this factor to spread more vertically

    const palette = [
        "#533770",
        "#6B786C",
        "#74677E",
        "#77D7BD",
        "#8BBBDD",
        "#9B7B70",
        "#A493BB",
        "#BAC67E",
        "#BBACE5",
        "#BCDAE9",
        "#C1C9ED",
        "#D0ABAC",
        "#D1EBE9",
        "#EBE0A3",
        "#F1A777",
        "#F5C9B1"
    ];

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.elt.style.transform = 'scale(1.1)';

        ctx = p.drawingContext;

        for (let i = 0; i < numGradients; i++) {
            const pos1 = [Math.random() * p.width * 2, Math.random() * p.height * 2];
            const pos2 = [...pos1]; 
            const r1 = Math.random() * 14 + 3;
            let r2 = Math.max(p.random(p.width/2, p.width/7),p.random(p.width/2, p.width/7));
            if (window.innerWidth < 750){
                r2 = Math.max(p.random(p.width, p.width/5),p.random(p.width, p.width/5));
            }
            r2 = 100;
            const c1start = palette[Math.floor(Math.random() * palette.length)];
            const c2start = palette[Math.floor(Math.random() * palette.length)];
            const c1end = palette[Math.floor(Math.random() * palette.length)]; // c2 always with alpha 0
            const c2end = palette[Math.floor(Math.random() * palette.length)]; // c2 always with alpha 0

            // Adding offsets for Perlin noise
            const offsetX = Math.random() * 2000;
            const offsetY = Math.random() * 2000;

            gradData.push({ pos1, r1, pos2, r2, c1start, c2start, c1end, c2end, offsetX, offsetY, t: 0 });
        }
    };

    p.draw = () => {
        p.background(50);

        gradData.forEach((g) => {
            // Update positions with Perlin noise for smooth movement
            // Spread positions further across the canvas by adjusting with spreadFactorX and spreadFactorY
            g.pos1[0] = (p.noise(g.offsetX + p.frameCount * pos1Speed) - 0.5) * spreadFactorX * p.width + p.width / 2;
            g.pos1[1] = (p.noise(g.offsetY + p.frameCount * pos1Speed) - 0.5) * spreadFactorY * p.height + p.height / 2;

            // g.pos1[0] = p.noise(g.offsetX + p.frameCount * pos1Speed) * p.width;
            // g.pos1[1] = p.noise(g.offsetY + p.frameCount * pos1Speed) * p.height;
            // g.pos2[0] = g.pos1[0] + Math.sin(p.frameCount * speed) * 50;
            // g.pos2[1] = g.pos1[1] + Math.cos(p.frameCount * speed) * 50;

            const maxRadius = 50;
            const angleNoiseOffset = 0.006; // Controls the speed of angle variation
            
            // Use Perlin noise for a smoother and more dynamic angle around pos1
            const angle = p.noise(g.offsetX + p.frameCount * angleNoiseOffset) * Math.PI * 2;
            
            g.pos2[0] = g.pos1[0] + Math.cos(angle) * maxRadius;
            g.pos2[1] = g.pos1[1] + Math.sin(angle) * maxRadius;

            // Lerp the colors
            g.t += transitionSpeed;
            if (g.t >= 1) {
                g.t = 0; // Reset t for the new transition
                g.c1start = g.c1end; // Cycle the start color to the current end color
                g.c1end = palette[Math.floor(Math.random() * palette.length)]; // Choose a new end color
                g.c2start = g.c2end; // Cycle the start color to the current end color
                g.c2end = palette[Math.floor(Math.random() * palette.length)]; // Choose a new end color
            }

            const lerpColor = (start, end, t) => {
                const startColor = hexToRgb(start);
                const endColor = hexToRgb(end);
                const r = Math.round(startColor.r + (endColor.r - startColor.r) * t);
                const g = Math.round(startColor.g + (endColor.g - startColor.g) * t);
                const b = Math.round(startColor.b + (endColor.b - startColor.b) * t);
                return `rgb(${r}, ${g}, ${b})`;
            };

            const lerpedColor1 = lerpColor(g.c1start, g.c1end, g.t);
            const lerpedColor2 = lerpColor(g.c2start, g.c2end, g.t);

            const grad = ctx.createRadialGradient(
                g.pos1[0],
                g.pos1[1],
                g.r1,
                g.pos2[0],
                g.pos2[1],
                g.r2
            );
            grad.addColorStop(0, lerpedColor1);
            grad.addColorStop(1, rgbToRgba(lerpedColor2, 0));

            p.push();
            p.noStroke();
            ctx.fillStyle = grad;
            p.rect(-p.width, -p.height, p.width * 2, p.height * 2);
            p.pop();
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

function hexToRgb(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}

function hexToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function rgbToRgba(rgbString, alpha) {
    // Extract the numeric values from the RGB string
    const rgbValues = rgbString.match(/\d+/g);
    if (rgbValues && rgbValues.length === 3) {
        const r = rgbValues[0];
        const g = rgbValues[1];
        const b = rgbValues[2];
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        throw new Error("Invalid RGB string format.");
    }
}

new p5(sketch);
