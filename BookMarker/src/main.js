// Name: Maksym Kholodenko, 05/31/2026, used GitHub Copilot to make minimal punctuation corrections
// Lab 7

import './general.js';
import { html, render } from 'lit-html';
import BookmarkStore from './BookmarkStore.js';
import LinkPreviewService from './LinkPreviewService.js';

const linkPreviewService = new LinkPreviewService();
const store = new BookmarkStore(linkPreviewService);

const app = document.querySelector('.bookmarks-list');
const form = document.querySelector('.bookmark-form');
const urlInput = document.getElementById('url');
const descriptionInput = document.getElementById('description');
const submitButton = form.querySelector('button[type="submit"]');
const apiMessage = document.getElementById('apiMessage');

const bookmarkTemplate = (bookmark, index) => html`
  <div class="bookmark-item content" data-index="${index}">
    <a
      href="${bookmark.link}"
      target="_blank"
      rel="noopener noreferrer"
      class="bookmark"
    >
      <div
        class="img"
        style=${bookmark.image ? `background-image: url('${bookmark.image}')` : ''}
      >
        &nbsp;
      </div>

      <div class="title">
        <div>
          <strong>${bookmark.title}</strong><br />
          <span class="bookmark-description">${bookmark.description || bookmark.link}</span>
        </div>
      </div>
    </a>

    <button
      name="deleteBookmark"
      type="button"
      class="btn p-0 border-0 delete-button"
      aria-label="Delete bookmark"
    >
      <i class="bi-trash delete-icon"></i>
    </button>
  </div>
`;

const bookmarksTemplate = (bookmarks) => html`
  ${bookmarks.length === 0
    ? html`<div class="empty-message content">No bookmarks saved yet.</div>`
    : bookmarks.map((bookmark, index) => bookmarkTemplate(bookmark, index))}
`;

const displayBookmarks = (bookmarks) => {
  render(bookmarksTemplate(bookmarks), app);
};

const showMessage = (message, isError = false) => {
  apiMessage.hidden = false;
  apiMessage.textContent = message;
  apiMessage.className = isError
    ? 'api-message content api-error'
    : 'api-message content api-success';
};

const clearMessage = () => {
  apiMessage.hidden = true;
  apiMessage.textContent = '';
};

const resetForm = () => {
  form.reset();
  urlInput.classList.remove('is-invalid');
};

const handleAddBookmark = async (event) => {
  event.preventDefault();
  clearMessage();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Adding...';

  const result = await store.addBookmark(
    urlInput.value.trim(),
    descriptionInput.value.trim()
  );

  submitButton.disabled = false;
  submitButton.textContent = 'Add';

  if (!result.ok) {
    urlInput.setCustomValidity(result.message);
    form.reportValidity();
    urlInput.setCustomValidity('');
    return;
  }

  showMessage(result.message, !result.previewLoaded);
  resetForm();
};

const handleDeleteBookmark = (event) => {
  const deleteButton = event.target.closest('button[name="deleteBookmark"]');
  if (!deleteButton) {
    return;
  }

  const bookmarkItem = deleteButton.closest('[data-index]');
  const index = Number(bookmarkItem.dataset.index);
  store.deleteBookmark(index);
};

const init = () => {
  store.subscribeBookmarkListChanged(displayBookmarks);
  form.addEventListener('submit', handleAddBookmark);
  app.addEventListener('click', handleDeleteBookmark);
  displayBookmarks(store.bookmarks);
};

document.addEventListener('DOMContentLoaded', init);


