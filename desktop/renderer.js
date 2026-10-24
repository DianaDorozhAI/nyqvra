(() => {
  'use strict';
  const api = window.nyqvraDesktop;
  if (!api) return;
  const strings = {
    ru: { journal: 'Журнал', back: 'Генератор', save: 'Сохранить', title: 'Сохранить в журнал', label: 'Сайт, аккаунт или комментарий', url: 'Ссылка (необязательно)', cancel: 'Отмена', close: 'Закрыть', empty: 'Сохранённых записей пока нет.', note: 'Записи хранятся на этом компьютере и зашифрованы для вашей учётной записи Windows.', saved: 'Сохранено в журнал.', show: 'Показать', hide: 'Скрыть', copy: 'Скопировать', copied: 'Скопировано', remove: 'Удалить', confirm: 'Удалить эту запись из журнала?', name: 'Укажите название, комментарий или ссылку.', invalidUrl: 'Укажите ссылку с https:// или http://.', unavailable: 'Шифрование Windows недоступно. Запись не сохранена.', locked: 'Не удалось открыть журнал. Исходный файл сохранён без изменений.', full: 'Журнал содержит 1000 записей. Удалите ненужные записи.', error: 'Не удалось выполнить действие. Попробуйте ещё раз.' },
    en: { journal: 'Journal', back: 'Generator', save: 'Save', title: 'Save to journal', label: 'Site, account or comment', url: 'Link (optional)', cancel: 'Cancel', close: 'Close', empty: 'No saved entries yet.', note: 'Entries stay on this computer, encrypted for your Windows user account.', saved: 'Saved to journal.', show: 'Show', hide: 'Hide', copy: 'Copy', copied: 'Copied', remove: 'Delete', confirm: 'Delete this journal entry?', name: 'Enter a name, comment or link.', invalidUrl: 'Enter a link starting with https:// or http://.', unavailable: 'Windows encryption is unavailable. The entry was not saved.', locked: 'The journal could not be opened. The original file has not been changed.', full: 'The journal contains 1,000 entries. Remove unneeded entries.', error: 'The action failed. Please try again.' },
  };
  const t = () => strings[document.documentElement.lang === 'en' ? 'en' : 'ru'];
  const element = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; };
  const iconButton = (icon, label) => {
    const button = element('button', 'journal-icon'); button.type = 'button'; button.title = label; button.setAttribute('aria-label', label);
    const image = element('img', 'icon'); image.src = `src/assets/icons/${icon}.svg`; image.alt = ''; button.append(image); return button;
  };
  function errorText(error) {
    return ({ NAME_REQUIRED: t().name, INVALID_URL: t().invalidUrl, ENCRYPTION_UNAVAILABLE: t().unavailable, VAULT_UNREADABLE: t().locked, VAULT_FULL: t().full })[error.message] || t().error;
  }
  const generator = document.querySelector('#generator');
  const saveButton = iconButton('plus', t().save); saveButton.id = 'desktop-save'; saveButton.classList.add('copy-button');
  document.querySelector('.result-actions').append(saveButton);
  const tab = element('button', 'journal-tab', t().journal); tab.type = 'button'; tab.setAttribute('aria-pressed', 'false'); tab.setAttribute('aria-controls', 'journal-panel');
  document.querySelector('.header-right').insertBefore(tab, document.querySelector('.languages'));
  const panel = element('section', 'panel journal-panel'); panel.id = 'journal-panel'; panel.hidden = true; panel.tabIndex = -1; panel.setAttribute('aria-labelledby', 'journal-title');
  const heading = element('div', 'password-heading');
  const title = element('h2', '', t().journal); title.id = 'journal-title';
  const back = element('button', 'journal-back', t().back); back.type = 'button';
  heading.append(title, back);
  const note = element('p', 'journal-note', t().note);
  const list = element('div', 'journal-list');
  const message = element('p', 'journal-message'); message.setAttribute('role', 'status');
  panel.append(heading, note, list, message); document.querySelector('.panel-frame').append(panel);
  const status = element('span', 'journal-feedback'); status.setAttribute('role', 'status'); document.querySelector('.site-footer').append(status);

  const dialog = element('dialog', 'journal-save'); dialog.setAttribute('aria-labelledby', 'journal-save-title');
  const dialogHeading = element('div', 'dialog-heading');
  const dialogTitle = element('h2', '', t().title); dialogTitle.id = 'journal-save-title';
  const close = iconButton('x', t().close); dialogHeading.append(dialogTitle, close);
  const form = element('form'); form.autocomplete = 'off';
  const nameLabel = element('label', 'journal-field'); const nameCaption = element('span', '', t().label);
  const name = element('input'); name.name = 'label'; name.maxLength = 120; name.autocomplete = 'off';
  nameLabel.append(nameCaption, name);
  const urlLabel = element('label', 'journal-field'); const urlCaption = element('span', '', t().url);
  const url = element('input'); url.type = 'url'; url.name = 'url'; url.maxLength = 2048; url.placeholder = 'https://'; url.autocomplete = 'off'; urlLabel.append(urlCaption, url);
  const formError = element('p', 'journal-message'); formError.setAttribute('role', 'alert');
  const actions = element('div', 'journal-form-actions'); const cancel = element('button', 'journal-back', t().cancel); cancel.type = 'button'; const submit = element('button', 'journal-submit', t().save); submit.type = 'submit'; actions.append(cancel, submit);
  form.append(nameLabel, urlLabel, formError, actions); dialog.append(dialogHeading, form); document.body.append(dialog);
  let snapshot = '';
  window.nyqvraJournal = Object.freeze({ openSave(value) { snapshot = value; form.reset(); formError.textContent = ''; dialog.showModal(); name.focus(); } });
  close.onclick = cancel.onclick = () => dialog.close();
  dialog.addEventListener('close', () => { snapshot = ''; form.reset(); formError.textContent = ''; });
  form.onsubmit = async event => {
    event.preventDefault(); submit.disabled = true; formError.textContent = '';
    try {
      await api.save({ label: name.value, url: url.value, secret: snapshot });
      dialog.close(); status.textContent = t().saved;
    } catch (error) { formError.textContent = errorText(error); }
    finally { submit.disabled = false; }
  };
  async function renderList() {
    list.replaceChildren(); message.textContent = '';
    try {
      const entries = await api.list();
      if (!entries.length) { list.append(element('p', 'journal-empty', t().empty)); return; }
      for (const entry of entries) {
        const row = element('article', 'journal-entry');
        const info = element('div', 'journal-entry-info');
        const date = element('time', 'journal-date', new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.createdAt))); date.dateTime = entry.createdAt;
        info.append(element('strong', '', entry.label), date);
        if (entry.url) info.append(element('span', 'journal-url', entry.url));
        const secretRow = element('div', 'journal-secret-row');
        const secret = element('span', 'journal-secret', '••••••••••••');
        const reveal = iconButton('eye', t().show), copy = iconButton('copy', t().copy), remove = iconButton('x', t().remove);
        let visible = false;
        reveal.onclick = async () => {
          try {
            secret.textContent = visible ? '••••••••••••' : await api.reveal(entry.id); visible = !visible;
            reveal.title = visible ? t().hide : t().show; reveal.setAttribute('aria-label', reveal.title); reveal.setAttribute('aria-pressed', String(visible)); reveal.firstChild.src = `src/assets/icons/${visible ? 'eye-off' : 'eye'}.svg`;
          } catch (error) { message.textContent = errorText(error); }
        };
        copy.onclick = async () => { try { await api.copy(entry.id); message.textContent = t().copied; } catch (error) { message.textContent = errorText(error); } };
        remove.onclick = async () => { if (!window.confirm(t().confirm)) return; try { await api.remove(entry.id); await renderList(); } catch (error) { message.textContent = errorText(error); } };
        secretRow.append(secret, reveal, copy, remove); row.append(info, secretRow); list.append(row);
      }
    } catch (error) { message.textContent = errorText(error); }
  }
  function showGenerator() { panel.hidden = true; generator.hidden = false; list.replaceChildren(); tab.setAttribute('aria-pressed', 'false'); generator.focus(); }
  tab.onclick = async () => { if (!panel.hidden) { showGenerator(); return; } generator.hidden = true; panel.hidden = false; tab.setAttribute('aria-pressed', 'true'); status.textContent = ''; await renderList(); panel.focus(); };
  back.onclick = showGenerator;
  new MutationObserver(() => {
    const text = t(); tab.textContent = title.textContent = text.journal; back.textContent = text.back; note.textContent = text.note;
    saveButton.title = text.save; saveButton.setAttribute('aria-label', text.save); dialogTitle.textContent = text.title; nameCaption.textContent = text.label; urlCaption.textContent = text.url; cancel.textContent = text.cancel; submit.textContent = text.save; close.title = text.close; close.setAttribute('aria-label', text.close); status.textContent = '';
    if (!panel.hidden) void renderList();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
