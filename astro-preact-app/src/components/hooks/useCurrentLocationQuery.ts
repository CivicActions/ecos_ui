import { signal, effect } from "@preact/signals";
import type { LocationData, Location } from "../../types";

const data = signal<LocationData | null>(null);
const latitude = signal<number | null>(null);
const longitude = signal<number | null>(null);
const shouldFetchCurrentLocations = signal<boolean>(false);
const isLoading = signal<boolean>(false);
const isError = signal<boolean>(false);
const error = signal<string | null>(null);

export function useCurrentLocationQuery() {
  effect(() => {
    if (shouldFetchCurrentLocations.value && "geolocation" in navigator) {
      if (!latitude.value || !longitude.value) {
        navigator.geolocation.getCurrentPosition((position) => {
          latitude.value = position.coords.latitude;
          longitude.value = position.coords.longitude;
        });
      }
    }
  });

  effect(() => {
    if (shouldFetchCurrentLocations.value) {
      shouldFetchCurrentLocations.value = false;
      isLoading.value = true;
      fetch(
        `${import.meta.env.BASE_URL}api/location/zip?latitude=${
          latitude.value
        }&longitude=${longitude.value}`
      )
        .then((response) => response.json())
        .then((json) => {
          isLoading.value = false;
          data.value = json;
        });
    }
  });

  return {
    data,
    latitude,
    longitude,
    shouldFetchCurrentLocations,
    isLoading,
    isError,
  };
}
