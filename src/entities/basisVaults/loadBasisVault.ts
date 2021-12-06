import { Address, log } from "@graphprotocol/graph-ts";

import { BasisVault } from "../../../generated/schema";
import { loadSubgraphConfig } from "../shared";

export function loadBasisVault(
  basisVaultAddress: Address
): BasisVault {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let basisVault = BasisVault.load(basisVaultAddress.toHex());

  if (!basisVault) {
    log.error("Basis Vault with address {} not found", [basisVaultAddress.toHex()]);
    throw new Error("Basis Vault not found");
  }

  return basisVault as BasisVault;
}
