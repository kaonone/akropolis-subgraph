import { Address } from "@graphprotocol/graph-ts";

import { BasisVaultState } from "../../../generated/schema";

export function loadBasisVaultState(
  basisVaultAddress: Address
): BasisVaultState | null {
  return BasisVaultState.load(basisVaultAddress.toHex());
}
