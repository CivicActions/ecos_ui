import { signal, effect } from "@preact/signals";
import type { Location } from "../../types";
import type { Signal } from "@preact/signals";

const data = signal(null);
const shouldFetchPlans = signal<boolean>(false);
const isLoading = signal<boolean>(false);
const isError = signal<boolean>(false);
const error = signal<string | null>(null);

export function usePlanQuery(
  location: Signal<Location | null>,
  campaign: string
) {
  effect(() => {
    if ((location.value && !data.value) || shouldFetchPlans.value) {
      shouldFetchPlans.value = false;
      isLoading.value = true;
      console.log('fetching plans...');
      fetch(`${import.meta.env.BASE_URL}api/marketplace/plans/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign,
          place: location.value,
        }),
      }).then((response) => response.json()).then((json) => {
        data.value = json;
        isLoading.value = false;
      });
    }
  });

  return {
    data,
    shouldFetchPlans,
    isLoading,
    isError,
    error,
  };
}
