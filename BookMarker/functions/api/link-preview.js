// Name: Maksym Kholodenko, 05/31/2026, used GitHub Copilot to make minimal punctuation corrections
// Lab 7

export async function onRequestPost(context) {
  const apiKey = context.env.LINKPREVIEW_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ message: 'Missing LinkPreview API key on server.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  let requestBody;

  try {
    requestBody = await context.request.json();
  } catch {
    return new Response(
      JSON.stringify({ message: 'Invalid JSON body.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const url = requestBody?.q?.trim();

  if (!url) {
    return new Response(
      JSON.stringify({ message: 'Missing required URL.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const upstreamResponse = await fetch('https://api.linkpreview.net', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
      'X-Linkpreview-Api-Key': apiKey
    },
    body: JSON.stringify({ q: url })
  });

  const responseText = await upstreamResponse.text();

  return new Response(responseText, {
    status: upstreamResponse.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}


