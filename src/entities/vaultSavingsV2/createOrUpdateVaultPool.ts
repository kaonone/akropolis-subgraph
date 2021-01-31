import { Address, BigInt } from "@graphprotocol/graph-ts";

import { VaultPoolV2 } from "../../../generated/schema";

import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { createPoolToken } from "../createPoolToken";
import { createToken } from "../createToken";

export function createOrUpdateVaultPoolV2(
  vaultAddress: Address,
  underlyingTokenAddress: Address
): VaultPoolV2 {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let pool = VaultPoolV2.load(vaultAddress.toHex());

  if (!pool) {
    pool = new VaultPoolV2(vaultAddress.toHex());
    pool.totalTVL = BigInt.fromI32(0);
  }

  pool.poolToken = createPoolToken(vaultAddress, null, null, pool.id).id;
  pool.underlyingToken = createToken(underlyingTokenAddress).id;
  pool.save();

  return pool as VaultPoolV2;
}
