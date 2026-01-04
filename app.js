const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const itemList = document.getElementById('itemList');
const stylePicker = document.getElementById('stylePicker');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const captureArea = document.getElementById('captureArea');

// 1. Load Data from LocalStorage
let items = JSON.parse(localStorage.getItem('myPwaList')) || [];

function renderList() {
    itemList.innerHTML = items.map((item, index) => `
        <li class="flex justify-between items-center border-b pb-2 group">
            <span>${item}</span>
            <button onclick="removeItem(${index})" class="text-red-400 text-sm">✕</button>
        </li>
    `).join('');
    localStorage.setItem('myPwaList', JSON.stringify(items));
}

// 2. One-tap Addition
function addItem() {
    const val = itemInput.value.trim();
    if (val) {
        items.push(val);
        itemInput.value = '';
        renderList();
        window.scrollTo(0, document.body.scrollHeight);
    }
}

addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });

// 3. Remove Item
window.removeItem = (index) => {
    items.splice(index, 1);
    renderList();
};

// 4. Custom Styles
stylePicker.addEventListener('change', (e) => {
    itemList.className = `space-y-3 ${e.target.value}`;
});

// 5. Download as JPEG
downloadBtn.addEventListener('click', () => {
    html2canvas(captureArea).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-list.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    });
});

// 6. Clear All
clearBtn.addEventListener('click', () => {
    if(confirm("Clear entire list?")) {
        items = [];
        renderList();
    }
});

// Initial Render
renderList();