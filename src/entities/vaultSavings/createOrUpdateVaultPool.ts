import { Address, BigInt } from "@graphprotocol/graph-ts";

import { Vault } from "../../../generated/schema";

import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { createToken } from "../createToken";

export function createOrUpdateVault(
  vaultAddress: Address,
  underlyingTokenAddress: Address,
  module: string,
): Vault {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let vault = Vault.load(vaultAddress.toHex());

  if (!vault) {
    vault = new Vault(vaultAddress.toHex());
    vault.totalTVL = BigInt.fromI32(0);
    vault.isActive = true;
    vault.module = module;
  }

  vault.lpToken = createToken(vaultAddress).id;
  vault.depositToken = createToken(underlyingTokenAddress).id;
  vault.save();

  return vault as Vault;
}
