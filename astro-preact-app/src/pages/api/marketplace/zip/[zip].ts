const MARKETPLACE_API_KEY = import.meta.env.MARKETPLACE_API_KEY;
const MARKETPLACE_BASE_URL = import.meta.env.MARKETPLACE_BASE_URL;
const MARKETPLACE_ENDPOINT = "/counties/by/zip";

export async function GET({ params, request }) {
  const response = await fetch(
    `${MARKETPLACE_BASE_URL}${MARKETPLACE_ENDPOINT}/${params.zip}?apikey=${MARKETPLACE_API_KEY}`
  );
  const data = await response.json();
  return new Response(JSON.stringify(data));
}
