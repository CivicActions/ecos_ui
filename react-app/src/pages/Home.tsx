import PageHeader from "../components/PageHeader";
import useFetchPlans from "../hooks/useFetchPlans";

export default function Home() {
  const [plans] = useFetchPlans();
  return (
    <>
      <PageHeader>App Home</PageHeader>
      <div className="ds-u-margin-y--2">
        <p className="ds-u-margin-bottom--4">Browse Available plans below</p>
        {plans &&
          plans?.plans.map((plan: any) => {
            return (
              <div key={plan?.id} className="ds-u-fill--secondary-lightest ds-u-margin-y--2 ds-u-padding--4 ds-u-border--1">
                <h2 className="ds-text-heading--md">Name: {plan?.name}</h2>
                <p>Type: {plan?.type}</p>
                <p>
                  <a href={plan?.benefits_url}>View Plan Benefits</a> |{" "}
                  <a href={plan?.brochure_url}>View Plan Brochure</a>
                </p>
              </div>
            );
          })}
      </div>
    </>
  );
}
