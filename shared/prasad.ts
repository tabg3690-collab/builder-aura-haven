export type PrasadPacket = "Pouch" | "Small Box" | "Big Box";

export interface PrasadRecord {
  mandal: string;
  pouch: number;
  smallBox: number;
  bigBox: number;
}
