import { Address } from "@graphprotocol/graph-ts";

import { StakingPool } from "../../../generated/schema";

import { loadToken } from "../loadToken";
import { loadSubgraphConfig } from "../loadSubgraphConfig";
import { StakingPool as PoolContract } from "../../../generated/Contracts/StakingPool";

export function loadOrCreateStakingPool(poolAddress: Address): StakingPool {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist
  let pool = StakingPool.load(poolAddress.toHex());

  if (!pool) {
    pool = new StakingPool(poolAddress.toHex());
    pool.usersCount = 0;
    pool.depositToken = loadDepositToken(poolAddress);
    pool.save();
  }

  return pool as StakingPool;
}

function loadDepositToken(poolAddress: Address): string {
  let contract = PoolContract.bind(poolAddress);

  let token = loadToken(contract.token());

  return token.id;
}
