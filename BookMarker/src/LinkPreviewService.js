// Name: Maksym Kholodenko, 05/31/2026, used GitHub Copilot to make minimal punctuation corrections
// Lab 7

export default class LinkPreviewService {
  constructor() {
    this.apiUrl = '/api/link-preview';
  }

  async fetchPreview(url) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: url })
    });

    if (!response.ok) {
      let message = `Link preview request failed with status ${response.status}.`;

      try {
        const errorData = await response.json();
        if (errorData?.message) {
          message = errorData.message;
        }
      } catch {
      }

      throw new Error(message);
    }

    const data = await response.json();

    return {
      title: data.title || url,
      description: data.description || '',
      image: data.image || '',
      url: data.url || url
    };
  }
}


