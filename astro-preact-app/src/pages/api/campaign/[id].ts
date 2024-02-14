import type { APIRoute } from "astro";

export const campaigns = {
  campaign_1: {
    id: "campaign_1",
    gender: "F",
    income: {
      min: 30000,
      max: 40000,
    },
  },
  campaign_2: {
    id: "campaign_2",
    gender: "F",
    income: {
      min: 40000,
      max: 50000,
    },
  },
};

export const GET: APIRoute = ({ params, request }) => {
  const id = params.id as "campaign_1" | "campaign_2";
  return new Response(
    JSON.stringify({
      data: campaigns[id],
    })
  );
};

export function getStaticPaths() {
  return [
    { params: { id: "campaign_1" } },
    { params: { id: "campaign_2" } },
  ];
}
