import { Address, BigInt } from "@graphprotocol/graph-ts";

import { UserBalance } from "../../generated/schema";
import { loadSubgraphConfig } from "./loadSubgraphConfig";
import { getUserBalanceId } from "../utils";
import { loadUser } from "./loadUser";

export function createOrUpdateUserBalance(
  userAddress: Address,
  poolAddress: Address,
  amountIncrease: BigInt
): void {
  loadSubgraphConfig(); // create config subgraph if it doesn't exist

  let id = getUserBalanceId(userAddress, poolAddress);
  let balance = UserBalance.load(id);
  let user = loadUser(userAddress);

  if (!user) {
    return;
  }

  if (!balance) {
    balance = new UserBalance(id);
    balance.value = BigInt.fromI32(0);
  }

  balance.value = balance.value.plus(amountIncrease);
  balance.pool = poolAddress;
  balance.user = user.id;
  balance.save();
}
