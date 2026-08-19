(() => {
  const STORAGE_KEY = 'ledger.entries.v1';

  const ICONS = {
    check: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5L6.2 12 13 4"/></svg>`,
    pencil: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 2.5l2 2L5 13l-3 1 1-3 8.5-8.5z"/></svg>`,
    trash: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4.5 4.5l.6 8.4a1 1 0 001 .9h3.8a1 1 0 001-.9l.6-8.4"/></svg>`
  };

  /** @type {{id: string, text: string, settled: boolean, createdAt: string, settledAt: string|null}[]} */
  let entries = loadEntries();
  let editingId = null;

  const els = {
    form: document.getElementById('add-form'),
    input: document.getElementById('task-input'),
    openList: document.getElementById('open-list'),
    settledList: document.getElementById('settled-list'),
    openEmpty: document.getElementById('open-empty'),
    settledEmpty: document.getElementById('settled-empty'),
    openCount: document.getElementById('open-count'),
    settledCount: document.getElementById('settled-count'),
    ledgerNumber: document.getElementById('ledger-number'),
    clearSettled: document.getElementById('clear-settled'),
  };

  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
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

  function pad(n) {
    return String(n).padStart(3, '0');
  }

  function render() {
    const open = entries.filter(e => !e.settled);
    const settled = entries.filter(e => e.settled);

    els.ledgerNumber.textContent = pad(entries.length);
    els.openCount.textContent = String(open.length);
    els.settledCount.textContent = String(settled.length);

    els.openEmpty.classList.toggle('hidden', open.length > 0);
    els.settledEmpty.classList.toggle('hidden', settled.length > 0);
    els.clearSettled.classList.toggle('hidden', settled.length === 0);

    renderList(els.openList, open, 1);
    renderList(els.settledList, settled, open.length + 1);
  }

  function renderList(container, items, startIndex) {
    container.innerHTML = '';
    items.forEach((entry, i) => {
      container.appendChild(buildEntryEl(entry, startIndex + i));
    });
  }

  function buildEntryEl(entry, index) {
    const li = document.createElement('li');
    li.className = 'entry' + (entry.settled ? ' is-settled' : '');
    li.dataset.id = entry.id;

    if (editingId === entry.id) {
      li.innerHTML = `
        <span class="entry-index">${pad(index)}</span>
        <div class="edit-row">
          <label class="sr-only" for="edit-${entry.id}">Edit entry</label>
          <input id="edit-${entry.id}" class="edit-input" type="text" value="${escapeAttr(entry.text)}" maxlength="200">
        </div>
        <div class="edit-actions">
          <button type="button" class="text-btn save-btn">Save</button>
          <button type="button" class="text-btn cancel-btn">Cancel</button>
        </div>`;

      const editInput = li.querySelector('.edit-input');
      const commit = () => {
        const val = editInput.value.trim();
        if (!val) return;
        entry.text = val;
        editingId = null;
        saveEntries();
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

    const timestamp = entry.settled
      ? 'Settled ' + formatDate(entry.settledAt)
      : 'Logged ' + formatDate(entry.createdAt);

    li.innerHTML = `
      <span class="entry-index">${pad(index)}</span>
      <button type="button" class="stamp" aria-pressed="${entry.settled}" aria-label="${entry.settled ? 'Mark as open' : 'Mark as settled'}">
        ${ICONS.check}
      </button>
      <div class="entry-body">
        <p class="entry-text"></p>
        <span class="entry-meta">${timestamp}</span>
      </div>
      <div class="entry-actions">
        <button type="button" class="icon-btn edit-btn" aria-label="Edit entry">${ICONS.pencil}</button>
        <button type="button" class="icon-btn danger del-btn" aria-label="Delete entry">${ICONS.trash}</button>
      </div>`;

    // set text content safely (avoids HTML injection from task text)
    li.querySelector('.entry-text').textContent = entry.text;

    li.querySelector('.stamp').addEventListener('click', () => toggleEntry(entry.id));
    li.querySelector('.edit-btn').addEventListener('click', () => {
      editingId = entry.id;
      render();
    });
    li.querySelector('.del-btn').addEventListener('click', () => deleteEntry(entry.id));

    return li;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function addEntry(text) {
    entries.unshift({
      id: uid(),
      text,
      settled: false,
      createdAt: new Date().toISOString(),
      settledAt: null,
    });
    saveEntries();
    render();
  }

  function toggleEntry(id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    entry.settled = !entry.settled;
    entry.settledAt = entry.settled ? new Date().toISOString() : null;
    saveEntries();
    render();
  }

  function deleteEntry(id) {
    entries = entries.filter(e => e.id !== id);
    if (editingId === id) editingId = null;
    saveEntries();
    render();
  }

  function clearSettled() {
    entries = entries.filter(e => !e.settled);
    saveEntries();
    render();
  }

  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.input.value.trim();
    if (!text) return;
    addEntry(text);
    els.input.value = '';
    els.input.focus();
  });

  els.clearSettled.addEventListener('click', clearSettled);

  render();
})();