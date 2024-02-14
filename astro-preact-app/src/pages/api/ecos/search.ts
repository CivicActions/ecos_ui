import type { APIRoute } from "astro";

const MARKETPLACE_API_KEY = import.meta.env.MARKETPLACE_API_KEY;
const MARKETPLACE_BASE_URL = import.meta.env.MARKETPLACE_BASE_URL;
const MARKETPLACE_ENDPOINT_PLANS = "/plans/search";
const MARKETPLACE_ENDPOINT_ZIP = "/counties/by/zip";
const MARKETPLACE_ENDPOINT_ESTIMATES = "/households/eligibility/estimates";

interface SearchBodyType {
  market: string;
  place: {
    zipcode: string;
    countyfips: string;
    state: string;
  };
  household: {
    income: number;
    people: {
      aptc_eligible?: boolean;
      age?: number;
      has_mec?: boolean;
      is_pregnant?: boolean;
      is_parent?: boolean;
      uses_tobacco?: boolean;
    }[];
  };
  aptc_override?: number;
}

export const campaigns = {
  campaign_1: {
    id: "campaign_1",
    zipcode: "73301",
    income_range: {
      min: 30000,
      max: 40000,
    },
    age_range: {
      min: 35,
      max: 45,
    },
    is_parent: true
  },
  campaign_2: {
    id: "campaign_2",
    zipcode: "73301",
    gender: "Female",
    income_range: {
      min: 60000,
      max: 70000,
    },
    age_range: {
      min: 40,
      max: 50,
    },
  },
};

export const POST: APIRoute = async ({ params, request }) => {
  const {
    campaignId,
    place,
    household: { income, people },
    market,
  } = await request.json();
  const { zipcode: target_zip, income_range, age_range } = campaigns[campaignId] ?? {
    target_zip: null,
    age_range: null,
    income_range: null,
  };

  let searchPlace = { countyfips: null, state: null, zipcode: null };
  // If we have a full place object, use it
  if (place.zipcode && place.countyfips && place.state) {
    searchPlace = place;
    // User updated their zip code or we have a campaign zip code, so we need to look up the fips and state
  } else if (place.zipcode || target_zip) {
    const searchZipCode = place.zipcode ?? target_zip;
    const response = await fetch(
      `${MARKETPLACE_BASE_URL}${MARKETPLACE_ENDPOINT_ZIP}/${searchZipCode}?apikey=${MARKETPLACE_API_KEY}`
    );
    const data = await response.json();
    // TODO - handle multiple counties
    searchPlace.countyfips = data.counties[0].fips;
    searchPlace.state = data.counties[0].state;
    searchPlace.zipcode = searchZipCode;
    // No place object, so we need to look up the fips and state from campaign data
  }
  // Error state
  else {
    return new Response("No location data available", { status: 400 });
  }

  const mergedSearchValues: SearchBodyType = {
    market: market ?? "Individual",
    place: searchPlace,
    household: {
      income: income ?? (income_range.min + income_range.max) / 2,
      people: [
        {
          aptc_eligible: false,
          age: people[0].age ?? (age_range.min + age_range.max) / 2,
          has_mec: people[0].has_mec ?? false,
          is_pregnant: people[0].is_pregnant ?? false,
          is_parent: people[0].is_parent ?? false,
          uses_tobacco: people[0].uses_tobacco ?? false,
        }
      ],
    },
  };
  
  // Add an empty array for the dependent if the first person is a parent
  if (people[0].is_parent) {
    mergedSearchValues.household.people.push({});
  }

  const estimatesResponse = await fetch(
    `${MARKETPLACE_BASE_URL}${MARKETPLACE_ENDPOINT_ESTIMATES}?apikey=${MARKETPLACE_API_KEY}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(mergedSearchValues),
    }
  );
  const estimatesResponseJson = await estimatesResponse.json();
  console.log(estimatesResponseJson);

  if (estimatesResponseJson.estimates[0].aptc > 0) {
    mergedSearchValues.household.people[0].aptc_eligible = true;
    mergedSearchValues.aptc_override = estimatesResponseJson.estimates[0].aptc;
  }

  if (estimatesResponseJson.estimates[1]?.is_medicaid_chip) {
    mergedSearchValues.household.people[1] = {has_mec: true};
  }

  console.log(estimatesResponseJson);
  const response = await fetch(
    `${MARKETPLACE_BASE_URL}${MARKETPLACE_ENDPOINT_PLANS}?apikey=${MARKETPLACE_API_KEY}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(mergedSearchValues),
    }
  );
  const responseJson = await response.json();
  return new Response(JSON.stringify({
    campaignId,
    search: mergedSearchValues,
    data: responseJson,
  }));
};
