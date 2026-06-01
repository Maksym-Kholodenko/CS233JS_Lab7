// Name: Maksym Kholodenko, 05/31/2026
// Lab 7

export default class Bookmark {
  constructor(title, link, description = '', image = '') {
    this.title = title?.trim() || link;
    this.link = link.trim();
    this.description = description.trim();
    this.image = image;
  }
}


