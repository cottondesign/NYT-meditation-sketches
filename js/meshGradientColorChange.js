const sketch = (p) => {
    let ctx;

    // {pos1, r1, c1, pos2, r2, c2, offsetX, offsetY, startColor, endColor, t}
    const gradData = [];
    const numGradients = 40;

    const speed = 0.002;
    const transitionSpeed = 0.01;

    const palette = [
        "#533770", "#6B786C", "#74677E", "#77D7BD", "#8BBDD7", "#9B7B70", "#ffffff", "#9F7E8C", "#A493BB", "#BAC67E", "#BBACE5", "#BEADAC", "#C1C9ED", "#CFC8B5", "#D0ABAC", "#DDD4BC", "#EBE0A3", "#F1A777", "#F5C9B1"
    ];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        ctx = p.drawingContext;

        for (let i = 0; i < numGradients; i++) {
            const pos1 = [Math.random() * p.width * 2 - p.width, Math.random() * p.height * 2 - p.height];
            const pos2 = [...pos1]; 
            const r1 = Math.random() * 10 + 1;
            const r2 = Math.random() * 50 + p.width / 3;
            const startColor = palette[Math.floor(Math.random() * palette.length)];
            const endColor = palette[Math.floor(Math.random() * palette.length)];
            const c2 = hexToRgba(endColor, 0); // c2 always with alpha 0

            // Adding offsets for Perlin noise
            const offsetX = Math.random() * 1000;
            const offsetY = Math.random() * 1000;

            gradData.push({ pos1, r1, startColor, pos2, r2, c2, offsetX, offsetY, endColor, t: 0 });
        }
    };

    p.draw = () => {
        p.background(50);

        gradData.forEach((g) => {
            // Update positions with Perlin noise for smooth movement
            g.pos1[0] = p.noise(g.offsetX + p.frameCount * speed) * p.width;
            g.pos1[1] = p.noise(g.offsetY + p.frameCount * speed) * p.height;
            g.pos2[0] = g.pos1[0] + Math.sin(p.frameCount * speed) * 50;
            g.pos2[1] = g.pos1[1] + Math.cos(p.frameCount * speed) * 50;

            // Lerp the colors
            g.t += transitionSpeed;
            if (g.t > 1) {
                g.t = 0; // Reset to loop the transition
                g.startColor = g.endColor; // Cycle the start color
                g.endColor = palette[Math.floor(Math.random() * palette.length)]; // Choose a new end color
                g.c2 = hexToRgba(g.endColor, 0); // Update c2 with the new end color and alpha 0
            }

            const lerpColor = (start, end, t) => {
                const startColor = hexToRgb(start);
                const endColor = hexToRgb(end);
                const r = Math.round(startColor.r + (endColor.r - startColor.r) * t);
                const g = Math.round(startColor.g + (endColor.g - startColor.g) * t);
                const b = Math.round(startColor.b + (endColor.b - startColor.b) * t);
                return `rgb(${r}, ${g}, ${b})`;
            };

            const lerpedColor1 = lerpColor(g.startColor, g.endColor, g.t);
            const lerpedColor2 = g.c2; // c2 remains transparent

            const grad = ctx.createRadialGradient(
                g.pos1[0],
                g.pos1[1],
                g.r1,
                g.pos2[0],
                g.pos2[1],
                g.r2
            );
            grad.addColorStop(0, lerpedColor1);
            grad.addColorStop(1, lerpedColor2);

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

new p5(sketch);
