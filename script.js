const canvas = document.getElementById("pookalam");
const ctx = canvas.getContext("2d");

const colors = {
    green: "#1B4D3E",
    darkGreen: "#06351D",
    white: "#FFFDF2",
    yellow: "#FFD700",
    orange: "#FF4500",
    red: "#D2143A"
};

let canvasSize = 0;
let animationFrame;
let startTime = 0;

const LAYER_TIME = 300;
const GAP_TIME = 40;

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvasSize = Math.floor(
        Math.min(rect.width, rect.height)
    );

    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    startAnimation();
}

function circle(cx, cy, r, color) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function ring(cx, cy, radius, width, color) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function petal(x, y, length, width, angle, color) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();

    ctx.moveTo(0, 0);

    ctx.bezierCurveTo(
        width,
        length * 0.25,
        width,
        length * 0.75,
        0,
        length
    );

    ctx.bezierCurveTo(
        -width,
        length * 0.75,
        -width,
        length * 0.25,
        0,
        0
    );

    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
}

function flowerRing(
    cx,
    cy,
    radius,
    count,
    petalLength,
    petalWidth,
    color,
    rotation = 0,
    amount = 1
) {
    const visible = Math.floor(count * amount);

    for (let i = 0; i < visible; i++) {
        const angle =
            rotation +
            (Math.PI * 2 * i) / count;

        const x =
            cx +
            Math.cos(angle) * radius;

        const y =
            cy +
            Math.sin(angle) * radius;

        petal(
            x,
            y,
            petalLength,
            petalWidth,
            angle + Math.PI / 2,
            color
        );
    }
}

function dotRing(
    cx,
    cy,
    radius,
    count,
    dotRadius,
    color,
    rotation = 0,
    amount = 1
) {
    const visible = Math.floor(count * amount);

    for (let i = 0; i < visible; i++) {
        const angle =
            rotation +
            (Math.PI * 2 * i) / count;

        circle(
            cx + Math.cos(angle) * radius,
            cy + Math.sin(angle) * radius,
            dotRadius,
            color
        );
    }
}

function leaf(
    x,
    y,
    length,
    width,
    angle,
    color
) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();

    ctx.moveTo(0, 0);

    ctx.quadraticCurveTo(
        width,
        length * 0.5,
        0,
        length
    );

    ctx.quadraticCurveTo(
        -width,
        length * 0.5,
        0,
        0
    );

    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
}

function leafRing(
    cx,
    cy,
    radius,
    count,
    length,
    width,
    color,
    rotation = 0,
    amount = 1
) {
    const visible = Math.floor(count * amount);

    for (let i = 0; i < visible; i++) {
        const angle =
            rotation +
            (Math.PI * 2 * i) / count;

        leaf(
            cx + Math.cos(angle) * radius,
            cy + Math.sin(angle) * radius,
            length,
            width,
            angle + Math.PI / 2,
            color
        );
    }
}

function smallFlower(
    cx,
    cy,
    petals,
    radius,
    color,
    centerColor,
    amount = 1
) {
    const visible = Math.floor(petals * amount);

    for (let i = 0; i < visible; i++) {
        const angle =
            (Math.PI * 2 * i) / petals;

        petal(
            cx + Math.cos(angle) * radius * 0.42,
            cy + Math.sin(angle) * radius * 0.42,
            radius,
            radius * 0.30,
            angle + Math.PI / 2,
            color
        );
    }

    if (amount >= 1) {
        circle(
            cx,
            cy,
            radius * 0.20,
            centerColor
        );
    }
}

function textureRing(
    cx,
    cy,
    radius,
    count,
    spread,
    color
) {
    for (let i = 0; i < count; i++) {
        const angle =
            Math.random() * Math.PI * 2;

        const r =
            radius +
            (Math.random() - 0.5) * spread;

        circle(
            cx + Math.cos(angle) * r,
            cy + Math.sin(angle) * r,
            1.5 + Math.random() * 2,
            color
        );
    }
}

function drawBackground(C) {
    const background =
        ctx.createRadialGradient(
            C,
            C,
            50,
            C,
            C,
            600
        );

    background.addColorStop(
        0,
        "#073D20"
    );

    background.addColorStop(
        0.75,
        "#032712"
    );

    background.addColorStop(
        1,
        "#011409"
    );

    ctx.fillStyle = background;

    ctx.fillRect(
        0,
        0,
        1100,
        1100
    );
}

function drawLayer(layer, amount, C) {

    if (layer === 1) {

        smallFlower(
            C,
            C,
            18,
            48,
            colors.white,
            colors.yellow,
            amount
        );

        dotRing(
            C,
            C,
            27,
            10,
            3.5,
            colors.yellow,
            0,
            amount
        );
    }

    if (layer === 2) {

        ring(
            C,
            C,
            128,
            18 * amount,
            colors.yellow
        );
    }

    if (layer === 3) {

        flowerRing(
            C,
            C,
            104,
            12,
            36,
            13,
            colors.orange,
            Math.PI / 12,
            amount
        );

        dotRing(
            C,
            C,
            90,
            18,
            3,
            colors.yellow,
            0,
            amount
        );
    }

    if (layer === 4) {

        ring(
            C,
            C,
            150,
            7 * amount,
            colors.white
        );
    }

    if (layer === 5) {

        flowerRing(
            C,
            C,
            185,
            16,
            58,
            22,
            colors.orange,
            0,
            amount
        );

        ring(
            C,
            C,
            215,
            8 * amount,
            colors.white
        );
    }

    if (layer === 6) {

        flowerRing(
            C,
            C,
            252,
            34,
            68,
            25,
            colors.red,
            Math.PI / 34,
            amount
        );

        dotRing(
            C,
            C,
            252,
            34,
            3,
            colors.white,
            0,
            amount
        );
    }

    if (layer === 7) {

        ring(
            C,
            C,
            285,
            7 * amount,
            colors.white
        );

        flowerRing(
            C,
            C,
            315,
            55,
            28,
            10,
            "#174D2F",
            Math.PI / 55,
            amount
        );

        ring(
            C,
            C,
            350,
            10 * amount,
            colors.yellow
        );
    }

    if (layer === 8) {

        flowerRing(
            C,
            C,
            395,
            22,
            82,
            30,
            colors.orange,
            Math.PI / 22,
            amount
        );

        flowerRing(
            C,
            C,
            395,
            22,
            45,
            16,
            colors.white,
            Math.PI / 11,
            amount
        );

        dotRing(
            C,
            C,
            395,
            22,
            6,
            colors.yellow,
            Math.PI / 22,
            amount
        );
    }

    if (layer === 9) {

        ring(
            C,
            C,
            425,
            7 * amount,
            colors.white
        );
    }

    if (layer === 10) {

        leafRing(
            C,
            C,
            455,
            100,
            32,
            11,
            "#164A2C",
            Math.PI / 2,
            amount
        );

        if (amount >= 1) {
            textureRing(
                C,
                C,
                455,
                150,
                42,
                "#27613A"
            );
        }

        ring(
            C,
            C,
            478,
            7 * amount,
            colors.white
        );

        ring(
            C,
            C,
            500,
            24 * amount,
            "#1B4D3E"
        );

        ring(
            C,
            C,
            500,
            3 * amount,
            "#0C5A3E"
        );
    }
}

function drawPookalam(progress) {

    const scale =
        canvasSize / 1100;

    ctx.clearRect(
        0,
        0,
        canvasSize,
        canvasSize
    );

    ctx.save();

    ctx.scale(
        scale,
        scale
    );

    const C = 550;

    drawBackground(C);

    circle(
        C,
        C,
        510,
        "#07351D"
    );

    const totalLayerTime =
        LAYER_TIME + GAP_TIME;

    for (let layer = 1; layer <= 10; layer++) {

        const layerStart =
            (layer - 1) * totalLayerTime;

        const elapsed =
            progress - layerStart;

        if (elapsed <= 0) {
            break;
        }

        const amount =
            Math.min(
                elapsed / LAYER_TIME,
                1
            );

        drawLayer(
            layer,
            amount,
            C
        );
    }

    ctx.restore();
}

function animate(timestamp) {

    if (!startTime) {
        startTime = timestamp;
    }

    const elapsed =
        timestamp - startTime;

    const totalDuration =
        (LAYER_TIME + GAP_TIME) * 10;

    const progress =
        Math.min(
            elapsed / totalDuration,
            1
        ) * totalDuration;

    drawPookalam(progress);

    if (elapsed < totalDuration) {

        animationFrame =
            requestAnimationFrame(animate);

    } else {

        drawPookalam(totalDuration);
    }
}

function startAnimation() {

    cancelAnimationFrame(
        animationFrame
    );

    startTime = 0;

    animationFrame =
        requestAnimationFrame(animate);
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();