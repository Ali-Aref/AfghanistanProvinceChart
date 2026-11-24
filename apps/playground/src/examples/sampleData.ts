import type { ProvinceNumericData } from "afghanistan-province-chart";

/**
 * Illustrative values only. These numbers were invented for the demo and must
 * never be presented as official statistics.
 */
export const SAMPLE_DATA: ProvinceNumericData = {
  "AF-BAL": 68,
  "AF-BAM": 28,
  "AF-BDG": null,
  "AF-BDS": 35,
  "AF-BGL": 33,
  "AF-DAY": 18,
  "AF-FRA": 21,
  "AF-FYB": 31,
  "AF-GHA": 34,
  "AF-GHO": 24,
  "AF-HEL": 38,
  "AF-HER": 72,
  "AF-JOW": 29,
  "AF-KAB": 96,
  "AF-KAN": 64,
  "AF-KAP": 22,
  "AF-KDZ": 44,
  "AF-KHO": 30,
  "AF-KNR": 20,
  "AF-LAG": 23,
  "AF-LOG": 32,
  "AF-NAN": 61,
  "AF-NIM": null,
  "AF-NUR": null,
  "AF-PAN": 0,
  "AF-PAR": 41,
  "AF-PIA": 27,
  "AF-PKA": null,
  "AF-SAM": 26,
  "AF-SAR": 30,
  "AF-TAK": 39,
  "AF-URU": null,
  "AF-WAR": 25,
  "AF-ZAB": null,
};

export const SAMPLE_TOP_VALUES = [
  { code: "AF-KAB", value: 96 },
  { code: "AF-HER", value: 72 },
  { code: "AF-BAL", value: 68 },
  { code: "AF-KAN", value: 64 },
  { code: "AF-NAN", value: 61 },
] as const;
