const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const itemList = document.getElementById('itemList');
const stylePicker = document.getElementById('stylePicker');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const emptyState = document.getElementById('emptyState');
const captureArea = document.getElementById('captureArea');

// Set Current Date
const options = { weekday: 'long', month: 'short', day: 'numeric' };
document.getElementById('dateDisplay').innerText = new Date().toLocaleDateString('en-US', options);

// State management
let items = JSON.parse(localStorage.getItem('proList')) || [];

function renderList() {
    if (items.length === 0) {
        emptyState.classList.remove('hidden');
        itemList.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        itemList.classList.remove('hidden');
    }

    itemList.innerHTML = items.map((item, index) => `
        <li class="list-item-appear flex items-center justify-between group">
            <div class="flex items-center gap-3 flex-1 cursor-pointer" onclick="toggleCheck(${index})">
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}">
                    ${item.checked ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                </div>
                <span class="text-lg transition-all ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}">
                    ${item.text}
                </span>
            </div>
            <button onclick="removeItem(${index})" class="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </li>
    `).join('');
    
    localStorage.setItem('proList', JSON.stringify(items));
}

// Actions
function addItem() {
    const text = itemInput.value.trim();
    if (text) {
        items.push({ text, checked: false });
        itemInput.value = '';
        renderList();
    }
}

window.toggleCheck = (index) => {
    items[index].checked = !items[index].checked;
    renderList();
};

window.removeItem = (index) => {
    items.splice(index, 1);
    renderList();
};

// Listeners
addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => e.key === 'Enter' && addItem());

stylePicker.addEventListener('change', (e) => {
    itemList.className = `space-y-4 ${e.target.value}`;
});

clearBtn.addEventListener('click', () => {
    if (confirm("Delete all items?")) {
        items = [];
        renderList();
    }
});

downloadBtn.addEventListener('click', () => {
    // Briefly hide buttons for a clean export
    const originalShadow = captureArea.style.boxShadow;
    captureArea.style.boxShadow = 'none';
    
    html2canvas(captureArea, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
        borderRadius: 24
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `List-${new Date().getTime()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
        captureArea.style.boxShadow = originalShadow;
    });
});

renderList();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("Service Worker Registered"));
}
