import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts";

import { VaultPool } from "../../../generated/schema";
import { VaultProtocol } from "../../../generated/VaultSavingsModule/VaultProtocol";

import { createVPoolBalance } from "./createVPoolBalance";
import { loadToken } from "../loadToken";
import { createVPoolApr } from "./createVPoolApr";
import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { createPoolToken } from "../createPoolToken";

export function createOrUpdateVaultPool(
  event: ethereum.Event,
  poolAddress: Address,
  tokenAddress: Address
): VaultPool {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let pool = VaultPool.load(poolAddress.toHex());

  if (!pool) {
    pool = new VaultPool(poolAddress.toHex());
    pool.apr = createVPoolApr(
      event,
      BigInt.fromI32(0),
      BigInt.fromI32(0),
      pool.id
    ).id;
    pool.balance = createVPoolBalance(event, BigInt.fromI32(0), pool.id).id;
    pool.prevBalance = pool.balance;
  }

  pool.poolToken = createPoolToken(tokenAddress, null, pool.id).id;
  pool.tokens = loadSupportedTokens(poolAddress);

  pool.save();

  return pool as VaultPool;
}

function loadSupportedTokens(poolAddress: Address): string[] {
  let contract = VaultProtocol.bind(poolAddress);

  let ids: string[] = [];
  let tokens = contract.supportedTokens();

  for (let i = 0; i < tokens.length; i++) {
    let token = loadToken(tokens[i]);
    ids.push(token.id);
  }

  return ids;
}
