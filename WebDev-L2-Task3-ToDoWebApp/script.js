let allData = [];
let editingId = null;

const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const form = document.getElementById('add-form');
const input = document.getElementById('task-input');

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function renderTasks() {
    const pending = allData.filter(t => !t.completed);
    const completed = allData.filter(t => t.completed);

    pendingCount.textContent = pending.length + ' pending';
    completedCount.textContent = completed.length + ' completed';

    pendingEmpty.classList.toggle('hidden', pending.length > 0);
    completedEmpty.classList.toggle('hidden', completed.length > 0);

    renderList(pendingList, pending, false);
    renderList(completedList, completed, true);
}

function renderList(container, items, isCompleted) {
    const existing = new Map([...container.children].map(el => [el.dataset.id, el]));
    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        let el = existing.get(item.__backendId);
        if (el) {
            updateTaskEl(el, item, isCompleted);
            existing.delete(item.__backendId);
        } else {
            el = createTaskEl(item, isCompleted);
            el.dataset.id = item.__backendId;
        }
        fragment.appendChild(el);
    });

    existing.forEach(el => el.remove());
    container.appendChild(fragment);
}

function createTaskEl(item, isCompleted) {
    const div = document.createElement('div');
    div.className = 'task-item flex items-start gap-3 p-4 rounded-xl border';
    div.style.borderColor = '#E5E7EB';
    div.dataset.id = item.__backendId;
    updateTaskEl(div, item, isCompleted);
    return div;
}

function updateTaskEl(div, item, isCompleted) {
    if (editingId === item.__backendId) {
        div.innerHTML = `
            <div class="flex-1">
                <input type="text" class="edit-input w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#4CAF7D]" value="${item.task_text.replace(/"/g, '&quot;')}" style="border-color:#E5E7EB">
                <div class="flex gap-2 mt-2">
                    <button class="save-btn px-3 py-1 rounded-lg text-sm font-medium text-white" style="background:#4CAF7D">Save</button>
                    <button class="cancel-btn px-3 py-1 rounded-lg text-sm font-medium" style="background:#E5E7EB;color:#1F2937">Cancel</button>
                </div>
            </div>`;
        const editInput = div.querySelector('.edit-input');
        div.querySelector('.save-btn').onclick = async () => {
            const val = editInput.value.trim();
            if (!val) return;
            editingId = null;
            await window.dataSdk.update({ ...item, task_text: val });
        };
        div.querySelector('.cancel-btn').onclick = () => { editingId = null; renderTasks(); };
        setTimeout(() => editInput.focus(), 0);
        return;
    }

    const ts = isCompleted && item.completed_at ? 'Completed ' + formatDate(item.completed_at) : 'Added ' + formatDate(item.created_at);
    div.innerHTML = `
        <button class="toggle-btn mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition" style="border-color:${isCompleted ? '#10B981' : '#E5E7EB'};background:${isCompleted ? '#10B981' : 'transparent'}">
            ${isCompleted ? '<i data-lucide="check" style="width:12px;height:12px;color:white"></i>' : ''}
        </button>
        <div class="flex-1 min-w-0">
            <p class="text-[15px] ${isCompleted ? 'line-through opacity-60' : ''}" style="color:#1F2937">${item.task_text}</p>
            <span class="text-xs" style="color:#6B7280">${ts}</span>
        </div>
        <div class="flex gap-1 flex-shrink-0">
            <button class="edit-btn p-1.5 rounded-lg hover:bg-gray-100 transition"><i data-lucide="pencil" style="width:16px;height:16px;color:#6B7280"></i></button>
            <button class="del-btn p-1.5 rounded-lg hover:bg-red-50 transition"><i data-lucide="trash-2" style="width:16px;height:16px;color:#EF4444"></i></button>
        </div>`;

    div.querySelector('.toggle-btn').onclick = async () => {
        const now = !item.completed ? new Date().toISOString() : '';
        await window.dataSdk.update({ ...item, completed: !item.completed, completed_at: now });
    };
    div.querySelector('.edit-btn').onclick = () => { editingId = item.__backendId; renderTasks(); };
    div.querySelector('.del-btn').onclick = async () => { await window.dataSdk.delete(item); };

    lucide.createIcons();
}

const handler = {
    onDataChanged(data) {
        allData = data;
        renderTasks();
    }
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    if (allData.length >= 999) { return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    input.value = '';
    const result = await window.dataSdk.create({ task_text: text, completed: false, created_at: new Date().toISOString(), completed_at: '' });
    btn.disabled = false;
    if (!result.isOk) input.value = text;
});

(async () => {
    const r = await window.dataSdk.init(handler);
    if (!r.isOk) console.error('SDK init failed');
    lucide.createIcons();
})();