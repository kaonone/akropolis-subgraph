import { ethereum, Address } from "@graphprotocol/graph-ts";

import { VaultPool } from "../../../generated/schema";

import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { createPoolToken } from "../createPoolToken";
import { createToken } from "../createToken";

export function createOrUpdateVaultPool(
  event: ethereum.Event,
  vaultAddress: Address,
  underlyingTokenAddress: Address
): VaultPool {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let pool = VaultPool.load(vaultAddress.toHex());

  if (!pool) {
    pool = new VaultPool(vaultAddress.toHex());
  }

  pool.poolToken = createPoolToken(vaultAddress, null, pool.id).id;
  pool.underlyingToken = createToken(underlyingTokenAddress).id;

  pool.save();

  return pool as VaultPool;
}
