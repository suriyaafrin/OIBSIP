(() => {
  const STORAGE_KEY = 'todoList.tasks.v1';

  const ICONS = {
    check: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5L6.2 12 13 4"/></svg>`,
    pencil: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 2.5l2 2L5 13l-3 1 1-3 8.5-8.5z"/></svg>`,
    trash: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4.5 4.5l.6 8.4a1 1 0 001 .9h3.8a1 1 0 001-.9l.6-8.4"/></svg>`
  };

  /** @type {{id: string, text: string, done: boolean, createdAt: string, doneAt: string|null}[]} */
  let tasks = loadTasks();
  let editingId = null;

  const els = {
    form: document.getElementById('add-form'),
    input: document.getElementById('task-input'),
    pendingList: document.getElementById('pending-list'),
    doneList: document.getElementById('done-list'),
    pendingEmpty: document.getElementById('pending-empty'),
    doneEmpty: document.getElementById('done-empty'),
    pendingCount: document.getElementById('pending-count'),
    doneCount: document.getElementById('done-count'),
    clearDone: document.getElementById('clear-done'),
  };

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
      ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  function render() {
    const pending = tasks.filter(t => !t.done);
    const done = tasks.filter(t => t.done);

    els.pendingCount.textContent = `${pending.length} pending`;
    els.doneCount.textContent = `${done.length} done`;

    els.pendingEmpty.classList.toggle('hidden', pending.length > 0);
    els.doneEmpty.classList.toggle('hidden', done.length > 0);
    els.clearDone.classList.toggle('hidden', done.length === 0);

    renderList(els.pendingList, pending);
    renderList(els.doneList, done);
  }

  function renderList(container, items) {
    container.innerHTML = '';
    items.forEach(task => container.appendChild(buildTaskEl(task)));
  }

  function buildTaskEl(task) {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' is-done' : '');
    li.dataset.id = task.id;

    if (editingId === task.id) {
      li.innerHTML = `
        <div class="edit-row">
          <label class="sr-only" for="edit-${task.id}">Edit task</label>
          <input id="edit-${task.id}" class="edit-input" type="text" value="${escapeAttr(task.text)}" maxlength="200">
          <div class="edit-actions">
            <button type="button" class="text-btn save-btn">Save</button>
            <button type="button" class="text-btn cancel-btn">Cancel</button>
          </div>
        </div>`;

      const editInput = li.querySelector('.edit-input');
      const commit = () => {
        const val = editInput.value.trim();
        if (!val) return;
        task.text = val;
        editingId = null;
        saveTasks();
        render();
      };
      li.querySelector('.save-btn').addEventListener('click', commit);
      li.querySelector('.cancel-btn').addEventListener('click', () => {
        editingId = null;
        render();
      });
      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); commit(); }
        if (e.key === 'Escape') { e.preventDefault(); editingId = null; render(); }
      });

      queueMicrotask(() => { editInput.focus(); editInput.select(); });
      return li;
    }

    const timestamp = task.done
      ? 'Completed ' + formatDate(task.doneAt)
      : 'Added ' + formatDate(task.createdAt);

    li.innerHTML = `
      <button type="button" class="checkbox" aria-pressed="${task.done}" aria-label="${task.done ? 'Mark as pending' : 'Mark as done'}">
        ${ICONS.check}
      </button>
      <div class="task-body">
        <p class="task-text"></p>
        <span class="task-meta">${timestamp}</span>
      </div>
      <div class="task-actions">
        <button type="button" class="icon-btn edit-btn" aria-label="Edit task">${ICONS.pencil}</button>
        <button type="button" class="icon-btn danger del-btn" aria-label="Delete task">${ICONS.trash}</button>
      </div>`;

    // set text content safely (avoids HTML injection from task text)
    li.querySelector('.task-text').textContent = task.text;

    li.querySelector('.checkbox').addEventListener('click', () => toggleTask(task.id));
    li.querySelector('.edit-btn').addEventListener('click', () => {
      editingId = task.id;
      render();
    });
    li.querySelector('.del-btn').addEventListener('click', () => deleteTask(task.id));

    return li;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function addTask(text) {
    tasks.unshift({
      id: uid(),
      text,
      done: false,
      createdAt: new Date().toISOString(),
      doneAt: null,
    });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.done = !task.done;
    task.doneAt = task.done ? new Date().toISOString() : null;
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    if (editingId === id) editingId = null;
    saveTasks();
    render();
  }

  function clearDone() {
    tasks = tasks.filter(t => !t.done);
    saveTasks();
    render();
  }

  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.input.value.trim();
    if (!text) return;
    addTask(text);
    els.input.value = '';
    els.input.focus();
  });

  els.clearDone.addEventListener('click', clearDone);

  render();
})();