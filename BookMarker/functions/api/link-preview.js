// Name: Maksym Kholodenko, 05/31/2026, used GitHub Copilot to make minimal punctuation corrections
// Lab 7

export async function onRequestPost(context) {
  const appId = context.env.OPENGRAPH_APP_ID;

  if (!appId) {
    return new Response(
      JSON.stringify({ message: 'Missing OpenGraph.io App ID on server.' }),
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

  const encodedUrl = encodeURIComponent(url);
  const apiUrl = `https://opengraph.io/api/3.0/site/${encodedUrl}?app_id=${appId}`;

  const upstreamResponse = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'
    }
  });

  const payload = await upstreamResponse.json();

  if (!upstreamResponse.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      'OpenGraph.io preview request failed.';

    return new Response(
      JSON.stringify({ message }),
      {
        status: upstreamResponse.status || 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }

  const graph = payload?.hybridGraph || {};
  const openGraphImage = payload?.openGraph?.image?.url || '';

  return new Response(
    JSON.stringify({
      title: graph.title || url,
      description: graph.description || '',
      image: graph.image || openGraphImage || '',
      url: graph.url || url
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    }
  );
}


