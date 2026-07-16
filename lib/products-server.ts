import "server-only";
import coil from "@/models/coils";
import drawn from "@/models/drawns";
import lattice from "@/models/lattices";
import type { ProductType } from "@/lib/domain";

export function getProductModel(type: ProductType) {
  if (type === 1) return lattice;
  if (type === 2) return coil;
  return drawn;
}
