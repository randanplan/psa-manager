export interface PsaReportItem {
  index?: number;
  itemDescription: string;
  enNorm: string;
  itemSN: string;
  baujahr: number;
  zustand: string;
  ergebnis: "GUT" | "BEOBACHTEN" | "REPARIEREN" | "AUSSONDERN";
  naechstePruefung: string | Date;
}

export interface PsaReport {
  id: string;
  anwender: string;
  prueferName?: string;
  ort?: string;
  datum: string | Date;
  items: PsaReportItem[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  updatedBy?: string;
}

export type ErgebnisType = "GUT" | "BEOBACHTEN" | "REPARIEREN" | "AUSSONDERN";