import { Address } from "@graphprotocol/graph-ts";
import { loadSubgraphConfig } from "..";
import { BasisVault } from "../../../generated/schema";

export function createOrUpdateBasisVault(
  basisVaultAddress: Address,
  isActive: boolean,
): BasisVault {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let basisVault = BasisVault.load(basisVaultAddress.toHex());

  if (!basisVault) {
    basisVault = new BasisVault(basisVaultAddress.toHex());
  } 

  basisVault.isActive = isActive;
  basisVault.save();

  return basisVault as BasisVault;
}