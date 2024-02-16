import { signal, effect } from "@preact/signals";
import {
  Accordion,
  AccordionItem,
  Alert,
  ChoiceList,
  Drawer,
  DrawerToggle,
  Dropdown,
  TextField,
  Button,
  StarIcon,
} from "@cmsgov/ds-healthcare-gov/preact";
import Layout from "./Layout";
import type { EcosPlanSearchResponseType } from "../pages/api/ecos/search";

// const location = signal<Location | null>(null);
const data = signal<EcosPlanSearchResponseType | null>(null);
const isLoading = signal<boolean>(false);
const shouldFetchPlans = signal<boolean>(false);
const fetchCount = signal<number>(0);

const shouldUpdateFormData = signal<boolean>(false);
const shouldShowPlans = signal<boolean>(false);

const isHelpDrawerOpen = signal<boolean>(false);
const zipCode = signal<string | null>(null);
const fipsCode = signal<string | null>(null);
const state = signal<string | null>(null);
const income = signal<string | null>(null);
const age = signal<string | null>(null);
const coverageType = signal<string | null>(null);
const hasDependent = signal<boolean>(false);
const isPregnant = signal<boolean>(false);
const isTobaccoUser = signal<boolean>(false);
const isCoverageEligible = signal<boolean>(false);

interface SearchValuesType {
  campaignId: string;
  place?: {
    zipcode: string;
    countyfips: string;
    state: string;
  };
  market?: string;
  household?: {
    income?: number;
    people: {
      age?: number;
      is_pregnant?: boolean;
      is_parent?: boolean;
      uses_tobacco?: boolean;
      has_mec?: boolean;
    }[];
  };
}

export default function WindowShop({ campaignId }: { campaignId: string }) {
  if (campaignId && !data.value) {
    shouldFetchPlans.value = true;
  }

  effect(() => {
    if (shouldUpdateFormData.value) {
      shouldUpdateFormData.value = false;
      zipCode.value = data.value?.search.place.zipcode;
      fipsCode.value = data.value?.search.place.countyfips;
      state.value = data.value?.search.place.state;
      income.value = data.value?.search.household.income.toString();
      age.value = data.value?.search.household.people[0].age.toString();
      coverageType.value = data.value?.search.market;
      hasDependent.value = data.value?.search.household.people[0].is_parent;
      isPregnant.value = data.value?.search.household.people[0].is_pregnant;
      isTobaccoUser.value = data.value?.search.household.people[0].uses_tobacco;
      isCoverageEligible.value = data.value?.search.household.people[0].has_mec;
    }
  });

  effect(() => {
    if (shouldFetchPlans.value) {
      shouldFetchPlans.value = false;
      isLoading.value = true;

      const searchValues: SearchValuesType = {
        campaignId,
        place: {
          zipcode: zipCode.value,
          countyfips: fipsCode.value,
          state: state.value,
        },
        market: coverageType.value,
        household: {
          income: parseInt(income.value),
          people: [
            {
              age: parseInt(age.value),
              is_pregnant: isPregnant.value,
              is_parent: hasDependent.value,
              uses_tobacco: isTobaccoUser.value,
              has_mec: isCoverageEligible.value,
            },
          ],
        },
      };

      if (searchValues.household.people[0].is_parent) {
        searchValues.household.people.push({});
      }

      fetch(`${import.meta.env.BASE_URL}api/ecos/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchValues),
      })
        .then((response) => response.json())
        .then((json) => {
          data.value = json;
          isLoading.value = false;
          shouldUpdateFormData.value = true;
          fetchCount.value++;
        });
    }
  });

  // Unset state and fips if user changes zip code
  const handleZipCodeChange = (zip: string) => {
    zipCode.value = zip;
    state.value = null;
    fipsCode.value = null;
  };

  if (data.value?.data && shouldShowPlans.value == true) {
    const plans = data.value.data;

    return (
      <Layout>
        <h1>Plans</h1>
        <p className="ds-u-font-size--md ds-u-margin-bottom--1">
          <strong>{plans.total} plans</strong> - ZIP Code {zipCode.value}
        </p>
        <Accordion>
          <AccordionItem
            key="1"
            heading="Filter"
            buttonClassName="ds-u-font-size--md ds-u-fill--primary-lightest"
          >
            Filter controls
          </AccordionItem>
          <AccordionItem
            key="2"
            heading="Sort"
            buttonClassName="ds-u-font-size--md ds-u-fill--primary-lightest"
          >
            Sort order controls
          </AccordionItem>
        </Accordion>
        <div>
          {plans.plans.map((plan) => (
            <div>
              <h2 className="ds-u-font-size--lg ds-u-margin-top--4 ds-u-color--primary">
                {plan.name}
              </h2>
              <p className="ds-u-font-size--sm ds-u-font-weight--bold ds-u-margin-top--05">
                {plan.issuer.name}
              </p>
              <p className="ds-u-margin-top--05">
                <strong>Premium:</strong>{" "}
                <span className="ds-u-font-size--sm">
                  ${plan.premium_w_credit} per month
                </span>
              </p>
              <p className="ds-u-margin-top--0">
                <strong>Deductible:</strong>{" "}
                <span className="ds-u-font-size--sm">
                  ${plan.deductibles[0].amount} per year
                </span>
              </p>
              <p className="ds-u-font-size--sm ds-u-margin-y--05">
                {plan.metal_level} | {plan.type} | Plan ID: {plan.id}
              </p>
              <p className="ds-u-font-size--sm ds-u-margin-top--05">
                <strong>Primary care:</strong>{" "}
                {
                  plan.benefits.find(
                    (benefit) =>
                      benefit.type ===
                      "PRIMARY_CARE_VISIT_TO_TREAT_AN_INJURY_OR_ILLNESS"
                  ).cost_sharings[0].display_string
                }
              </p>
              <p className="ds-u-font-size--sm ds-u-margin-top--0">
                <strong>Specialist care:</strong>{" "}
                {
                  plan.benefits.find(
                    (benefit) => benefit.type === "SPECIALIST_VISIT"
                  ).cost_sharings[0].display_string
                }
              </p>
              <p className="ds-u-font-size--sm ds-u-margin-top--0">
                <strong>Rating:</strong>{" "}
                {[1, 2, 3, 4, 5].map((i) => {
                  const filled = plan.quality_rating.global_rating >= i;
                  return (
                    <StarIcon
                      isFilled={filled}
                      style={{ color: "gold" }}
                      className="ds-u-font-size--sm"
                    />
                  );
                })}
              </p>
              <div className="ds-u-margin-top--3 ds-u-margin-bottom--4 ds-u-display--flex ds-u-justify-content--between">
                <Button variation="solid">Plan Details</Button>
                <Button variation="outline">Compare</Button>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <h1>Find affordable health insurance</h1>
        <h2 className="ds-u-margin-top--3">Health Plan Calculator</h2>
        <div className="ds-u-fill--secondary-lightest ds-u-border--1 ds-u-border--success ds-u-padding-x--3 ds-u-padding-y--2">
          <h2 className="ds-u-color--success">
            {isLoading.value
              ? "Loading Plan Data"
              : data.value?.data
              ? `$${data.value?.data.ranges.premiums.min} per month`
              : "Estimate your premium"}
          </h2>
          <p className="ds-u-font-size--sm">
            {fetchCount.value > 1 ? (
              <>This is an updated estimate based on your input.</>
            ) : (
              <>
                This Marketplace estimate is based on campaign data. Personal
                data will not be saved without permission.
              </>
            )}
          </p>
        </div>
        <p>
          Get a more accurate plan payment by updating the information below.
        </p>
        <form>
          <TextField
            label="ZIP code"
            name="zip-code"
            mask="zip"
            inputMode="numeric"
            type="text"
            value={zipCode.value}
            size="medium"
            onInput={(e) => {
              handleZipCodeChange(e.target.value);
            }}
            onBlur={(e) => {
              console.log("hello");
            }}
          />
          <TextField
            hint={
              <DrawerToggle
                className="ds-u-margin-top--0 ds-u-margin-bottom--1"
                onClick={() => {
                  isHelpDrawerOpen.value = !isHelpDrawerOpen.value;
                }}
              >
                See how to estimate your income
              </DrawerToggle>
            }
            mask="currency"
            inputMode="numeric"
            type="text"
            size="medium"
            label="Estimated annual income"
            value={income.value}
            onInput={(e) => {
              income.value = e.target.value;
            }}
          />
          <TextField
            inputMode="numeric"
            type="text"
            size="small"
            label="Age"
            value={age.value}
            onInput={(e) => (age.value = e.target.value)}
          />
          <Accordion>
            <AccordionItem
              key="1"
              heading="Additional information"
              buttonClassName="ds-u-font-size--md ds-u-padding-left--0 ds-u-margin-top--1"
              contentClassName="ds-u-padding-left--3 ds-u-padding-top--0"
            >
              <div>
                <Dropdown
                  labelClassName="ds-u-margin-top--0"
                  label="Who needs coverage?"
                  defaultValue="Individual"
                  name="coverage-type"
                  onChange={(e) => {
                    coverageType.value = e.target.value;
                  }}
                  options={[
                    { value: "Individual", label: "Individual" },
                    { value: "Family", label: "Family" },
                  ]}
                />
                <ChoiceList
                  choices={[
                    {
                      label: "Parent of a child under 19",
                      value: "hasDependent",
                    },
                    {
                      label: "Pregnant",
                      value: "isPregnant",
                    },
                    {
                      label: "Tobacco user",
                      value: "isTobaccoUser",
                    },
                    {
                      label:
                        "Eligible for health coverage through a job, Medicare, Medicaid, or CHIP",
                      value: "hasCoverageEligible",
                    },
                  ]}
                  label="Select all that apply to you."
                  onChange={(e) => {
                    switch (e.target.value) {
                      case "hasDependent":
                        hasDependent.value = !hasDependent.value;
                        break;
                      case "isPregnant":
                        isPregnant.value = !isPregnant.value;
                        break;
                      case "isTobaccoUser":
                        isTobaccoUser.value = !isTobaccoUser.value;
                        break;
                      case "hasCoverageEligible":
                        isCoverageEligible.value = !isCoverageEligible.value;
                        break;
                    }
                  }}
                  type="checkbox"
                />
              </div>
            </AccordionItem>
          </Accordion>
          <div className="ds-u-margin-top--1 ds-u-margin-bottom--3 ds-u-display--flex ds-u-flex-direction--column">
            <Button
              className="ds-u-margin-y--1"
              disabled={isLoading.value}
              variation="solid"
              onClick={() => {
                shouldFetchPlans.value = true;
              }}
            >
              Update price
            </Button>
            <Button
              className="ds-u-margin-y--1"
              disabled={isLoading.value}
              onClick={() => {
                shouldShowPlans.value = true;
              }}
            >
              View plans
            </Button>
          </div>
        </form>
        <Alert
          className="ds-u-padding-top--3 ds-u-padding-bottom--4"
          hideIcon={true}
          heading="You may be eligible for extra savings if you pick a Silver plan"
        >
          <p>
            It appears you qualify for extra savings on other costs, like
            deductibles, copayments, and coinsurance. This can save you hundreds
            or even thousand of dollars if you use a lot of care.
          </p>
          <p>
            <strong>Important</strong>: To get these extra savings you MUST pick
            a plan in the Silver category.
          </p>
        </Alert>
        <Drawer
          heading="Need help?"
          isOpen={isHelpDrawerOpen.value ?? false}
          onCloseClick={() =>
            (isHelpDrawerOpen.value = !isHelpDrawerOpen.value)
          }
        >
          <h3 class="ds-u-margin-top--0 ds-u-font-weight--bold ds-u-font-size--lg">
            How to estimate your income
          </h3>
          <p>Note:</p>
          <ul>
            <li>
              Marketplace savings are based on your{" "}
              <strong>
                expected household income for the year you want coverage, not
                last year's income.
              </strong>
            </li>
            <li>
              Income is counted for you, your spouse, and everyone you'll claim
              as a tax dependent on your federal tax return. Include their
              income even if they don't need health coverage.
            </li>
          </ul>
          <p></p>
          <p>
            <strong>
              Step 1. Start with your household's adjusted gross income (AGI)
            </strong>
            from your most recent federal income tax return. Don't have recent
            AGI? You can start this estimate using your gross income before
            taxes are taken out. Or use “federal taxable wages” from your pay
            stub.
          </p>
          <p>
            <strong>
              Step 2. Add the following kinds of income, if you have any:
            </strong>
          </p>
          <ul class="ds-u-margin-bottom--2">
            <li>Tax-exempt foreign income</li>
            <li>
              Tax-exempt Social Security benefits (including tier 1 railroad
              retirement benefits)
            </li>
            <li>Tax-exempt interest</li>
          </ul>
          <strong>Don't include Supplemental Security Income (SSI).</strong>
          <p></p>
          <p>
            <strong>
              Step 3. Adjust your estimate for any changes you expect.
            </strong>
            <br />
            Consider things like these for all members of your household:
          </p>
          <ul>
            <li>Expected raises</li>
            <li>
              New jobs or other employment changes, including changes to work
              schedule or self-employment income
            </li>
            <li>
              Changes to income from other sources, like Social Security or
              investments
            </li>
            <li>
              Changes in your household, like gaining or losing dependents.
            </li>
          </ul>
          <p></p>
          <h4 class="ds-u-font-weight--bold">
            Estimating unpredictable income
          </h4>
          <p>
            It’s hard to predict your income if you're unemployed,
            self-employed, on commission, or on a work schedule that changes
            regularly.
          </p>
          <p>
            Base your estimate on your past experience, recent trends, what you
            know about possible changes at your workplace, and similar
            information. Just do your best so you get a realistic estimate of
            your Marketplace savings.
          </p>
        </Drawer>
      </Layout>
    );
  }
}
