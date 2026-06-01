// Name: Maksym Kholodenko, 05/31/2026, used GitHub Copilot to make minimal punctuation corrections
// Lab 7

export async function onRequestPost(context) {
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

  const apiUrl = new URL('https://api.microlink.io');
  apiUrl.searchParams.set('url', url);

  const upstreamResponse = await fetch(apiUrl.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'
    }
  });

  const microlinkPayload = await upstreamResponse.json();

  if (!upstreamResponse.ok || microlinkPayload?.status !== 'success') {
    const message =
      microlinkPayload?.data?.message ||
      microlinkPayload?.message ||
      'Microlink preview request failed.';

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

  const data = microlinkPayload.data || {};

  return new Response(
    JSON.stringify({
      title: data.title || url,
      description: data.description || '',
      image: data.image?.url || '',
      url: data.url || url
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


