import { Address } from "@graphprotocol/graph-ts";
import { loadOrCreateStakingPool } from "./loadOrCreateStakingPool";

export function increaseStakingUsersCount(poolAddress: Address): void {
  let pool = loadOrCreateStakingPool(poolAddress);
  pool.usersCount += 1;
  pool.save();
}

export function decreaseStakingUsersCount(poolAddress: Address): void {
  let pool = loadOrCreateStakingPool(poolAddress);
  pool.usersCount -= 1;
  pool.save();
}
