import { Address, ethereum } from "@graphprotocol/graph-ts";
import { createToken, loadSubgraphConfig } from "..";
import { BasisVaultContract } from "../../../generated/Contracts/BasisVaultContract";
import { BasisVault } from "../../../generated/schema";

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
    basisVault.lpToken = createToken(contract.want()).id;
    basisVault.depositToken = createToken(contract.want()).id;
    basisVault.createdAt = block.timestamp;
  }

  basisVault.isActive = isActive;
  basisVault.save();

  return basisVault as BasisVault;
}
