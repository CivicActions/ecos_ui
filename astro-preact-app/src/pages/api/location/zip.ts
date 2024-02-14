import type { APIRoute } from "astro";

export const GET: APIRoute = ({ params, request }) => {
  const requestUrl = new URL(request.url);
  const latitude = requestUrl.searchParams.get("latitude");
  const longitude = requestUrl.searchParams.get("longitude");
  if (!latitude || !longitude) {
    return new Response(
      JSON.stringify({
        error: "Latitude and longitude are required",
      }),
      {
        status: 400,
      }
    );
  }
  return new Response(
    JSON.stringify({
      counties: [
        {
          zipcode: "73301",
          name: "Travis County",
          fips: "48453",
          state: "TX",
        },
        {
          zipcode: "73344",
          name: "Travis County",
          fips: "48453",
          state: "TX",
        },
      ],
    })
  );
};
