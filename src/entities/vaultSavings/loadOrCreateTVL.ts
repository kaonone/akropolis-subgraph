import { Address, BigInt } from "@graphprotocol/graph-ts";
import { DepositedBalance } from "../../../generated/schema";
import { createOrUpdateDepositedBalance } from "../createOrUpdateDepositedBalance";

export function loadOrCreateTVL(
  vaultAddress: Address,
  userAddress: Address,
  module: string
): DepositedBalance {
  return createOrUpdateDepositedBalance(
    userAddress,
    vaultAddress,
    BigInt.fromI32(0),
    module
  );
}
