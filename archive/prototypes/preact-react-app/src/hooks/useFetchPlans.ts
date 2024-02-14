import { useEffect, useState } from "preact/hooks";

export default function useFetchPlans() {
  const apiKey = "d687412e7b53146b2631dc01974ad0a4";
  const planYear = "2024";

  const [plans, setPlans] = useState(null);
  useEffect(() => {
    fetch(
      `https://marketplace.api.healthcare.gov/api/v1/plans/search?apikey=${apiKey}&year=${planYear}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          household: {
            income: 42000,
            people: [
              {
                aptc_eligible: true,
                dob: "1992-01-01",
                has_mec: false,
                is_pregnant: false,
                is_parent: false,
                uses_tobacco: false,
                gender: "Male",
                utilization_level: "Low",
              },
            ],
            has_married_couple: false,
          },
          market: "Individual",
          place: {
            countyfips: "17031",
            state: "IL",
            zipcode: "60647",
          },
          limit: 10,
          offset: 0,
          order: "asc",
          year: 2020,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPlans(data);
      });
  }, []);

  return [plans, setPlans] as const;
}
