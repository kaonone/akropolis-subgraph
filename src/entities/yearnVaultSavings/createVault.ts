import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";

import { YearnVault } from "../../../generated/schema";

import { loadSubgraphConfig, createToken } from "../shared";

export function createVault(
  block: ethereum.Block,
  vaultAddress: Address,
  underlyingTokenAddress: Address
): YearnVault {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let vault = YearnVault.load(vaultAddress.toHex());

  if (!vault) {
    vault = new YearnVault(vaultAddress.toHex());
    vault.totalTVL = BigInt.fromI32(0);
    vault.isActive = true;
    vault.createdAt = block.timestamp;
  } else {
    log.warning("Vault {} already exist.", [vault.id]);
  }

  vault.lpToken = createToken(vaultAddress).id;
  vault.depositToken = createToken(underlyingTokenAddress).id;
  vault.save();

  return vault as YearnVault;
}
