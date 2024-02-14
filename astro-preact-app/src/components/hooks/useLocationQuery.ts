import { signal, effect } from "@preact/signals";
import type { LocationData, Location } from "../../types";

const data = signal<LocationData | null>(null);
const zip = signal<string | null>(null);
const shouldFetchLocations = signal<boolean>(false);
const hasMultipleCounties = signal<boolean>(false);
const isLoading = signal<boolean>(false);
const isError = signal<boolean>(false);
const error = signal<string | null>(null);

export function useLocationQuery() {

  effect(() => {
    if (shouldFetchLocations.value && !isLoading.value && zip.value) {
      isLoading.value = true;
      fetch(`${import.meta.env.BASE_URL}api/marketplace/zip/${zip.value}`)
        .then((response) => response.json())
        .then((json) => {
          data.value = json;
          if (json.counties.length > 1) {
            hasMultipleCounties.value = true;
          } 
          isLoading.value = false;
          shouldFetchLocations.value = false;
        });
    }
  });

  return {
    data,
    zip,
    shouldFetchLocations,
    isLoading,
    isError,
    error,
  };
}
