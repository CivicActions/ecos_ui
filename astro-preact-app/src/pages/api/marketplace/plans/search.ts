import type { APIRoute } from "astro";
import { campaigns } from "../../campaign/[id]";

const MARKETPLACE_API_KEY = import.meta.env.MARKETPLACE_API_KEY;
const MARKETPLACE_BASE_URL = import.meta.env.MARKETPLACE_BASE_URL;
const MARKETPLACE_ENDPOINT = "/plans/search";

const defaultCampaignFactors = {
  gender: "F",
  income: { min: 65000, max: 75000 },
};

export const POST: APIRoute = async ({ params, request }) => {
  const { campaign: campaignId, place } = await request.json();
  const { gender, income } = campaigns[campaignId] ?? defaultCampaignFactors;

  const searchBody = {
    household: {
      income: (income.min + income.max) / 2,
      people: [
        {
          aptc_eligible: true,
          dob: "1987-01-01",
          has_mec: false,
          is_pregnant: true,
          is_parent: true,
          uses_tobacco: false,
          gender: gender === "F" ? "Female" : "Male",
          utilization_level: "Low",
        },
      ],
      has_married_couple: false,
    },
    market: "Individual",
    place: {
      zipcode: place.zipcode,
      countyfips: place.fips,
      state: place.state,
    },
    limit: 10,
    offset: 0,
    order: "asc",
  };

  const response = await fetch(
    `${MARKETPLACE_BASE_URL}${MARKETPLACE_ENDPOINT}?apikey=${MARKETPLACE_API_KEY}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(searchBody),
    }
  );
  const responseJson = await response.json();
  const mergedResponse = {
    ...responseJson,
    search_factors: searchBody,
  };
  return new Response(JSON.stringify(mergedResponse));
};
