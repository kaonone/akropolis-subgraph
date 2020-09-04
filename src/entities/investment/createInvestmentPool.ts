import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts";

import { InvestmentPool } from "../../../generated/schema";
import { DefiProtocol } from "../../../generated/InvestmentModule/DefiProtocol";

import { createToken } from "../createToken";
import { loadToken } from "../loadToken";
import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { createIPoolApr } from "./createIPoolApr";

export function createInvestmentPool(
  event: ethereum.Event,
  poolAddress: Address,
  tokenAddress: Address
): InvestmentPool {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let pool = new InvestmentPool(poolAddress.toHex());

  pool.poolToken = createToken(tokenAddress).id;
  pool.tokens = loadSupportedTokens(poolAddress);
  pool.rewardTokens = loadSupportedRewardTokens(poolAddress);
  pool.apr = createIPoolApr(
    event,
    BigInt.fromI32(0),
    BigInt.fromI32(0),
    pool.id
  ).id;

  pool.save();

  return pool;
}

function loadSupportedTokens(poolAddress: Address): string[] {
  let contract = DefiProtocol.bind(poolAddress);

  let ids: string[] = [];
  let tokens = contract.supportedTokens();

  for (let i = 0; i < tokens.length; i++) {
    let token = loadToken(tokens[i]);
    ids.push(token.id);
  }

  return ids;
}

function loadSupportedRewardTokens(poolAddress: Address): string[] {
  let contract = DefiProtocol.bind(poolAddress);

  let ids: string[] = [];
  let tokens = contract.supportedRewardTokens();

  for (let i = 0; i < tokens.length; i++) {
    let token = loadToken(tokens[i]);
    ids.push(token.id);
  }

  return ids;
}
