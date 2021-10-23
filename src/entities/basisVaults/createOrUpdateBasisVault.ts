import { Address, ethereum } from "@graphprotocol/graph-ts";

import { BasisVault } from "../../../generated/schema";
import { BasisVault as BasisVaultContract } from "../../../generated/templates/BasisVault/BasisVault";
import { createToken, loadSubgraphConfig } from "../shared";

export function createOrUpdateBasisVault(
  block: ethereum.Block,
  basisVaultAddress: Address,
  isActive: boolean
): BasisVault {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let basisVault = BasisVault.load(basisVaultAddress.toHex());
  let contract = BasisVaultContract.bind(basisVaultAddress);

  if (!basisVault) {
    basisVault = new BasisVault(basisVaultAddress.toHex());
    basisVault.lpToken = createToken(basisVaultAddress).id;
    basisVault.depositToken = createToken(contract.want()).id;
    basisVault.createdAt = block.timestamp;
  }

  basisVault.isActive = isActive;
  basisVault.save();

  return basisVault as BasisVault;
}