import { Address, ethereum } from "@graphprotocol/graph-ts";

import { BasisVaultState } from "../../../generated/schema";
import { BasisVault as BasisVaultContract } from "../../../generated/templates/BasisVault/BasisVault";
import { loadSubgraphConfig } from "../shared";
import { loadBasisVaultState } from "./loadBasisVaultState";

export function createOrUpdateBasisVaultState(
  block: ethereum.Block,
  basisVaultAddress: Address
): BasisVaultState {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let basisVaultState = loadBasisVaultState(basisVaultAddress);
  let contract = BasisVaultContract.bind(basisVaultAddress);

  if (!basisVaultState) {
    basisVaultState = new BasisVaultState(basisVaultAddress.toHex());
  }

  basisVaultState.updatedAtBlock = block.number;
  basisVaultState.updatedAtDate = block.timestamp;
  basisVaultState.totalShares = contract.totalSupply();
  basisVaultState.totalAssets = contract.totalAssets();
  basisVaultState.save();

  return basisVaultState as BasisVaultState;
}
