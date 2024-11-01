const sketch = (p) => {
    let ctx;

    // {pos1, r1, c1, pos2, r2, c2, offsetX, offsetY}
    const gradData = [];
    const numGradients = 40;

    const speed = 0.002;

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

            // Adding offsets for Perlin noise
            const offsetX = Math.random() * 1000;
            const offsetY = Math.random() * 1000;

            gradData.push({ pos1, r1, c1, pos2, r2, c2, offsetX, offsetY });
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

new p5(sketch);
