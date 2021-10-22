import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";

import { Vault } from "../../../generated/schema";

import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { createToken } from "../createToken";

export function createVault(
  block: ethereum.Block,
  vaultAddress: Address,
  underlyingTokenAddress: Address,
): Vault {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let vault = Vault.load(vaultAddress.toHex());

  if (!vault) {
    vault = new Vault(vaultAddress.toHex());
    vault.totalTVL = BigInt.fromI32(0);
    vault.isActive = true;
    vault.createdAt = block.timestamp;
  } else {
    log.warning('Vault {} already exist.', [vault.id]);
  }

  vault.lpToken = createToken(vaultAddress).id;
  vault.depositToken = createToken(underlyingTokenAddress).id;
  vault.save();

  return vault as Vault;
}
