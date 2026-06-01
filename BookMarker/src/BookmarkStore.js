// Name: Maksym Kholodenko, 05/31/2026, used GitHub Copilot to make minimal punctuation corrections
// Lab 7

import Bookmark from './Bookmark.js';

const STORAGE_KEY = 'bookmarks';

export default class BookmarkStore {
  constructor(linkPreviewService) {
    this.linkPreviewService = linkPreviewService;
    this.onBookmarkListChanged = () => {};
    this.bookmarks = this.loadBookmarks();
  }

  loadBookmarks() {
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (!Array.isArray(savedBookmarks) || !savedBookmarks.every(bookmark => this.isValidBookmark(bookmark))) {
        throw new Error('Invalid bookmark payload');
      }

      return savedBookmarks.map(
        ({ title, link, description = '', image = '' }) =>
          new Bookmark(title, link, description, image)
      );
    } catch {
      return [
        new Bookmark(
          'Pexels',
          'https://www.pexels.com/',
          'Really cool site for open source photos',
          ''
        ),
        new Bookmark(
          'Brian Bird',
          'https://profbird.dev/',
          "Brian's professional website",
          ''
        )
      ];
    }
  }

  isValidBookmark(bookmark) {
    return (
      typeof bookmark === 'object' &&
      bookmark !== null &&
      typeof bookmark.title === 'string' &&
      typeof bookmark.link === 'string' &&
      typeof bookmark.description === 'string' &&
      typeof bookmark.image === 'string' &&
      this.isSafeHttpUrl(bookmark.link)
    );
  }

  commit(bookmarks) {
    this.bookmarks = bookmarks;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    this.onBookmarkListChanged(this.bookmarks);
  }

  subscribeBookmarkListChanged(callback) {
    this.onBookmarkListChanged = callback;
  }

  isSafeHttpUrl(value) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async addBookmark(url, description = '') {
    if (!this.isSafeHttpUrl(url)) {
      return {
        ok: false,
        message: 'Please enter a valid http or https URL.'
      };
    }

    let previewLoaded = false;
    let bookmarkTitle = url;
    let bookmarkDescription = description;
    let bookmarkImage = '';
    let bookmarkUrl = url;

    try {
      const preview = await this.linkPreviewService.fetchPreview(url);
      bookmarkTitle = preview.title || url;
      bookmarkDescription = preview.description || description;
      bookmarkImage = preview.image || '';
      bookmarkUrl = preview.url || url;
      previewLoaded = true;
    } catch {
      // Fallback: still save the bookmark even if the preview request fails.
    }

    const newBookmark = new Bookmark(
      bookmarkTitle,
      bookmarkUrl,
      bookmarkDescription,
      bookmarkImage
    );

    this.commit([...this.bookmarks, newBookmark]);

    return {
      ok: true,
      previewLoaded,
      message: previewLoaded
        ? 'Bookmark added with live preview data.'
        : 'Bookmark added, but preview data could not be loaded.'
    };
  }

  deleteBookmark(index) {
    this.commit(this.bookmarks.filter((_, bookmarkIndex) => bookmarkIndex !== index));
  }
}


