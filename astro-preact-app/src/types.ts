export interface LocationData {
  counties: Location[];
}

export interface Location {
  zipcode: string;
  name: string;
  fips: string;
  state: string;
}
