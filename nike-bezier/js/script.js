
const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
function info() {
    Swal.fire({
        title: "Info",
        html: `
                    <h4> Made by Brin Blasco </h1>
                    <br />
                    <style>
                    a {
                        color: #9999FF;
                    }
                    </style>
                    <span>Github: <a href="https://github.com/BrinBlasco">github.com/BrinBlasco</a></span>
                    <br />
                    <span>Hosted with: <a href="https://pages.github.com/">Github Pages</a></span> 
                    <br /><br>
                    <p>
                        This is our 2nd project assignment for the subject of website design, we were supposed to integrate bezier curve, first through gimp and then port it into svg and canvas js.
                    </p>
                `,
        didOpen: () => {
            const confirmButton = Swal.getConfirmButton();
            confirmButton.style.backgroundColor = "#000";
            confirmButton.style.borderRadius = "0";
            confirmButton.style.color = "white";

            const popup = Swal.getPopup();
            popup.style.borderRadius = "0";
        }
    });
}
function add(className) {
    remove();
    const slider = document.querySelector(".slider");
    slider.classList.add(className);
}
function remove() {
    const slider = document.querySelector(".slider");
    if (slider.classList.contains("first") || slider.classList.contains("second") || slider.classList.contains("third")) {
        slider.classList.remove("third");
        slider.classList.remove("second");
        slider.classList.remove("first");
    }
}
function clearCanvas() {
    canvas.width = canvas.width;
}
function draw(initailColor) {

    ctx.fillStyle = initailColor;
    ctx.strokeStyle = initailColor;

    ctx.scale(0.3, 0.3);
    ctx.translate(590, 250);
    ctx.beginPath();
    ctx.moveTo(97.25, 143.75);
    ctx.bezierCurveTo(97.25, 143.75, 70.5, 201.5, 110.75, 216.5);
    ctx.bezierCurveTo(126, 226.5, 164.75, 212.75, 164.75, 212.75);
    ctx.bezierCurveTo(164.75, 212.75, 466.75, 130.25, 466.75, 130.25);
    ctx.bezierCurveTo(466.75, 130.25, 232.67, 232, 233.33, 232.67);
    ctx.bezierCurveTo(234, 233.33, 137, 273.75, 137, 273.75);
    ctx.bezierCurveTo(137, 273.75, 65.27, 302.73, 48.36, 254.18);
    ctx.bezierCurveTo(35.27, 207.64, 97.25, 143.75, 97.25, 143.75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
document.addEventListener("DOMContentLoaded", () => {
    draw("#000");
});

const logoColorPicker = document.querySelector("#logoColorPicker");
logoColorPicker.addEventListener('input', e => {
    const color = e.target.value;
    const pngThing = document.querySelector(".element.png img");
    const svgThing = document.querySelector(".element.svg svg");


    changeImageColor(pngThing, color);
    svgThing.querySelector('path').setAttribute("fill", color);
    svgThing.querySelector('path').setAttribute("stroke", color);
    clearCanvas();
    draw(color);
});
function changeImageColor(image, color) {
    console.log(image, color, rgbToHsl(hexToRgb(color)));
    image.style.filter = `invert(1) sepia(1) hue-rotate(${rgbToHsl(hexToRgb(color))[0] * 360}deg) saturate(10)`;
}


function hexToRgb(color) {
    let hex = color[0] === '#' ? color.slice(1) : color;
    let c;

    // expand the short hex by doubling each character, fc0 -> ffcc00
    if (hex.length !== 6) {
        hex = ((() => {
            const result = [];
            for (c of Array.from(hex)) {
                result.push(`${c}${c}`);
            }
            return result;
        })()).join('');
    }
    const colorStr = hex.match(/#?(.{2})(.{2})(.{2})/).slice(1);
    const rgb = colorStr.map(col => parseInt(col, 16));
    rgb.push(1);
    return rgb;
}

function rgbToHsl(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const add = max + min;

    const hue =
        min === max ?
            0
            : r === max ?
                (((60 * (g - b)) / diff) + 360) % 360
                : g === max ?
                    ((60 * (b - r)) / diff) + 120
                    :
                    ((60 * (r - g)) / diff) + 240;

    const lum = 0.5 * add;

    const sat =
        lum === 0 ?
            0
            : lum === 1 ?
                1
                : lum <= 0.5 ?
                    diff / add
                    :
                    diff / (2 - add);

    const h = Math.round(hue);
    const s = Math.round(sat * 100);
    const l = Math.round(lum * 100);
    const a = rgb[3] || 1;

    return [h, s, l, a];
}