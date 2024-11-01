const sketch = (p) => {
    let ctx;

    // {pos1, r1, c1, pos2, r2, c2, offsetX, offsetY}
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
            const pos1 = [Math.random() * p.width*2 - p.width, Math.random() * p.height*2 - p.height];
            const pos2 = [...pos1]; 
            const r1 = Math.random() * 10 + 1;
            const r2 = Math.random() * 50 + p.width / 3;
            const c1 = palette[Math.floor(Math.random() * palette.length)];
            const c2 = hexToRgba(palette[Math.floor(Math.random() * palette.length)], 0);

            // Initial target colors for transition
            const targetC1 = palette[Math.floor(Math.random() * palette.length)];
            const targetC2 = hexToRgba(palette[Math.floor(Math.random() * palette.length)], 0);

            gradData.push({
                pos1, r1, c1, targetC1, c1Progress: 0,
                pos2, r2, c2, targetC2, c2Progress: 0,
                offsetX: Math.random() * 1000,
                offsetY: Math.random() * 1000
            });
        }
    };

    p.draw = () => {
        p.background(50);

        gradData.forEach((g, i) => {
            // Update positions with Perlin noise for smooth movement
            g.pos1[0] = p.noise(g.offsetX + p.frameCount * speed) * p.width;
            g.pos1[1] = p.noise(g.offsetY + p.frameCount * speed) * p.height;
            g.pos2[0] = g.pos1[0] + Math.sin(p.frameCount * speed) * 50;
            g.pos2[1] = g.pos1[1] + Math.cos(p.frameCount * speed) * 50;

            // Interpolate colors towards the target colors
            g.c1 = lerpColor(g.c1, g.targetC1, g.c1Progress);
            g.c2 = lerpColor(g.c2, g.targetC2, g.c2Progress);

            // Update progress for both color transitions
            g.c1Progress += transitionSpeed;
            g.c2Progress += transitionSpeed;

            // If color transition is complete, select new target colors and reset progress
            if (g.c1Progress >= 1) {
                g.targetC1 = palette[Math.floor(Math.random() * palette.length)];
                g.c1Progress = 0;
            }
            if (g.c2Progress >= 1) {
                g.targetC2 = hexToRgba(palette[Math.floor(Math.random() * palette.length)], 0);
                g.c2Progress = 0;
            }

            const grad = ctx.createRadialGradient(
                g.pos1[0],
                g.pos1[1],
                g.r1,
                g.pos2[0],
                g.pos2[1],
                g.r2
            );
            grad.addColorStop(0, g.c1);
            grad.addColorStop(1, g.c2);

            p.push();
            p.noStroke();
            ctx.fillStyle = grad;
            p.rect(-p.width, -p.height, p.width*2, p.height*2);
            p.pop();
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

function hexToRgba(hex, alpha) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Return the rgba color
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lerpColor(color1, color2, progress) {
    // Extract RGBA components from color strings
    const c1 = color1.match(/\d+/g).map(Number);
    const c2 = color2.match(/\d+/g).map(Number);

    // Ensure both colors have RGBA components (alpha defaults to 1 if missing)
    const r1 = c1[0], g1 = c1[1], b1 = c1[2], a1 = c1[3] !== undefined ? c1[3] / 255 : 1;
    const r2 = c2[0], g2 = c2[1], b2 = c2[2], a2 = c2[3] !== undefined ? c2[3] / 255 : 1;

    // Linearly interpolate each component
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    const a = a1 + (a2 - a1) * progress;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
}


new p5(sketch);
