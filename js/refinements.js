const sketch = (p) => {
    let ctx;

    // {pos1, r1, c1, pos2, r2, c2, offsetX, offsetY, startColor, endColor, t}
    const gradData = [];
    const numGradients = 30;

    const speed = 0.002;
    const transitionSpeed = 0.01;
    const pos1Speed = 0.001;

    const spreadFactorX = 1.5;
    const spreadFactorY = 1.5;

    const palette = [
        "#4359AE",
        "#456240",
        "#472879",
        "#538887",
        "#638FE0",
        "#6A9CC2",
        "#70A9BA",
        "#796E86",
        "#7E68DA",
        "#9ADFC5",
        "#A56549",
        "#C4CE88",
        "#CE6060",
        "#E0A779",
        "#E2D47B",
        "#F8C094"
    ];

    const initializeGradients = () => {
        gradData.length = 0; // Clear the array to reset gradients

        // Determine the number of rows and columns for distribution
        const rows = Math.ceil(Math.sqrt(numGradients));
        const cols = Math.ceil(numGradients / rows);

        for (let i = 0; i < numGradients; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;

            // Set pos1 in a grid pattern as percentages
            const pos1 = [
                (col + 0.5 + (Math.random() - 0.5) * 0.4) / cols, // x percentage
                (row + 0.5 + (Math.random() - 0.5) * 0.4) / rows  // y percentage
            ];

            const pos2 = [...pos1];
            const r1 = Math.random() * 14 + 3;
            let r2 = Math.max(p.random(1/2, 1/5), p.random(1/2, 1/5)) * Math.min(p.width, p.height);
            if (window.innerWidth < 750) {
                r2 = Math.max(p.random(1, 1/4), p.random(1, 1/4)) * Math.min(p.width, p.height);
            }

            const c1start = palette[Math.floor(Math.random() * palette.length)];
            const c2start = palette[Math.floor(Math.random() * palette.length)];
            const c1end = palette[Math.floor(Math.random() * palette.length)];
            const c2end = palette[Math.floor(Math.random() * palette.length)];

            const offsetX = Math.random() * 2000;
            const offsetY = Math.random() * 2000;
            
            const t = Math.random();

            gradData.push({ pos1, initialPos1: [...pos1], r1, pos2, r2, c1start, c2start, c1end, c2end, offsetX, offsetY, t });
            p.shuffle(gradData, true);
        }
    };

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.elt.style.transform = 'scale(1.1)';
        ctx = p.drawingContext;
    
        initializeGradients();
    };

    p.draw = () => {
        p.background(50);

        gradData.forEach((g) => {
            const noiseX = (p.noise(g.offsetX + p.frameCount * pos1Speed) - 0.5) * spreadFactorX * 0.5 * p.width;
            const noiseY = (p.noise(g.offsetY + p.frameCount * pos1Speed) - 0.5) * spreadFactorY * 0.5 * p.height;

            // Convert percentage-based pos1 to pixel-based
            g.pos1[0] = g.initialPos1[0] * p.width + noiseX;
            g.pos1[1] = g.initialPos1[1] * p.height + noiseY;

            const maxRadius = 50;
            const angleNoiseOffset = 0.006;

            // Calculate dynamic angle for pos2 based on Perlin noise
            const angle = p.noise(g.offsetX + p.frameCount * angleNoiseOffset) * Math.PI * 2;
            g.pos2[0] = g.pos1[0] + Math.cos(angle) * maxRadius;
            g.pos2[1] = g.pos1[1] + Math.sin(angle) * maxRadius;

            // Update the lerp transition with unique timing
            g.t += transitionSpeed;
            if (g.t >= 1) {
                g.t = 0; // Reset t for the new transition
                g.c1start = g.c1end;
                g.c1end = palette[Math.floor(Math.random() * palette.length)];
                g.c2start = g.c2end;
                g.c2end = palette[Math.floor(Math.random() * palette.length)];
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

    let resizeTimeout;

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    
        // Clear the existing timeout, if any
        if (resizeTimeout) clearTimeout(resizeTimeout);
    
        // Set a new timeout to initialize gradients after 600ms of inactivity
        resizeTimeout = setTimeout(() => {
            initializeGradients();
        }, 600);
    };
};

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}

function rgbToRgba(rgbString, alpha) {
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
