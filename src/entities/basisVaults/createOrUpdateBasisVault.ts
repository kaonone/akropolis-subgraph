import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

import { BasisVault } from "../../../generated/schema";
import { BasisVault as BasisVaultContract } from "../../../generated/templates/BasisVault/BasisVault";
import { createToken, loadSubgraphConfig } from "../shared";
import { createOrUpdateSharePrice } from "./createOrUpdateSharePrice";

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
    basisVault.name = contract.name();
    basisVault.lpToken = createToken(basisVaultAddress).id;
    basisVault.depositToken = createToken(contract.want()).id;
    basisVault.createdAt = block.timestamp;
    basisVault.createdBlock = block.number;
    basisVault.totalEarnings = BigInt.fromI32(0 as i32);
    basisVault.firstSharePrice = createOrUpdateSharePrice(
      basisVaultAddress,
      block.timestamp
    ).id;
    basisVault.currentSharePrice = basisVault.firstSharePrice;
  }

  basisVault.isActive = isActive;
  basisVault.save();

  return basisVault as BasisVault;
}
