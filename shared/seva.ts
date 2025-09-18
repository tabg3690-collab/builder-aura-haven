export type SevaType =
  | "Uttaryan Jholi"
  | "Dasans - Visans"
  | "Shravan Padramani"
  | "GuruPurnima"
  | "Annakut"
  | "Prarthana Mandir Seva"
  | "others";

export interface SevaEntry {
  amount: number;
  date: string; // ISO date string or ''
  note: string;
}

export type SevaRecord = Record<SevaType, SevaEntry>;

export const SEVA_TYPES: SevaType[] = [
  "Uttaryan Jholi",
  "Dasans - Visans",
  "Shravan Padramani",
  "GuruPurnima",
  "Annakut",
  "Prarthana Mandir Seva",
  "others",
];
