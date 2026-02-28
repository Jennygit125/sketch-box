const sketchBox = document.getElementById("sketch_box");
const grid_size = 600;
const slider = document.querySelector("#size_adjust");
const colorPicker = document.querySelector("#color_selector");
const randomBtn = document.querySelector("#random");
const clearBtn = document.querySelector("#clear");
const shadeToggle = document.querySelector("#shade_toggle");

let currentColor = '#000000';
let shading = false; // shading mode

// turns a hex string like "#aabbcc" into {r,g,b}
function hexToRgb(hex) {
    const trimmed = hex.replace('#','');
    const bigint = parseInt(trimmed, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}


function createGrid(cells) {
    sketchBox.innerHTML = '';
    sketchBox.style.width = grid_size + 'px';
    sketchBox.style.height = grid_size + 'px';
    sketchBox.style.display = 'grid';
    sketchBox.style.gridTemplateColumns = `repeat(${cells}, ${grid_size/cells}px)`;
    sketchBox.style.gridTemplateRows = `repeat(${cells}, ${grid_size/cells}px)`;

    const paintCell = cell => {
        if (shading) {
            let alpha = parseFloat(cell.dataset.alpha) || 0;
            alpha = Math.min(1, alpha + 0.1);
            cell.dataset.alpha = alpha;
            const {r,g,b} = hexToRgb(currentColor);
            cell.style.backgroundColor = `rgba(${r},${g},${b},${alpha})`;
        } else {
            cell.style.backgroundColor = currentColor;
            cell.dataset.alpha = 1;
        }
    };

    for (let i = 0; i < cells * cells; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.style.width = `${grid_size / cells}px`;
        cell.style.height = `${grid_size / cells}px`;
        cell.dataset.alpha = 0;
        cell.style.backgroundColor = 'rgba(0,0,0,0)';
        cell.addEventListener('mouseover', () => paintCell(cell));
        sketchBox.appendChild(cell);
    }
}

slider.addEventListener('input', (e) => createGrid(parseInt(e.target.value, 10)));
colorPicker.addEventListener('input', (e) => currentColor = e.target.value);
randomBtn.addEventListener('click', () => {
    currentColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    colorPicker.value = currentColor;
});
shadeToggle.addEventListener('change', e => shading = e.target.checked);
clearBtn.addEventListener('click', () => createGrid(parseInt(slider.value, 10)));


window.addEventListener('load', () => createGrid(parseInt(slider.value, 10)));