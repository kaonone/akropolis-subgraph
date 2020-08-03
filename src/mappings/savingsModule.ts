import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";

import {
  Withdraw,
  Deposit,
  ProtocolRegistered,
} from "../../generated/SavingsModule/SavingsModule";
import {
  createSavingsPool,
  loadSavingsPool,
  createSPoolBalance,
  loadSPoolBalance,
  loadSubgraphConfig,
  createSPoolApr,
  loadUser,
} from "../entities";
import { DefiProtocol } from "../../generated/SavingsModule/DefiProtocol";
import { calcAPY, addUniq } from "../utils";

export function handleProtocolRegistered(event: ProtocolRegistered): void {
  createSavingsPool(event, event.params.protocol, event.params.poolToken);
}
export function handleWithdraw(event: Withdraw): void {
  // TODO check user balance and exclude the protocol if balance is zero

  updatePoolBalanceAndAPY(
    event,
    event.params.protocol,
    event.params.nAmount.times(BigInt.fromI32(-1))
  );
}
export function handleDeposit(event: Deposit): void {
  let user = loadUser(event.params.user);
  user.savingsPools = addUniq(user.savingsPools, event.params.protocol.toHex());
  user.save();

  updatePoolBalanceAndAPY(
    event,
    event.params.protocol,
    event.params.nAmount.minus(event.params.nFee)
  );
}

function updatePoolBalanceAndAPY(
  event: ethereum.Event,
  poolAddress: Address,
  currentBalanceCorrection: BigInt = BigInt.fromI32(0)
): void {
  let contract = DefiProtocol.bind(poolAddress);
  let config = loadSubgraphConfig();

  let pool = loadSavingsPool(poolAddress);
  let prevBalance = loadSPoolBalance(pool.balance);

  let currentBalance = createSPoolBalance(
    event,
    contract.normalizedBalance(),
    pool.id
  );
  let accumulatedYield = currentBalance.amount
    .minus(currentBalanceCorrection)
    .minus(prevBalance.amount);

  if (!prevBalance.amount.isZero() || !accumulatedYield.isZero()) {
    let duration = currentBalance.date.minus(prevBalance.date);
    let apy = calcAPY(
      duration,
      prevBalance.amount,
      currentBalance.amount.minus(currentBalanceCorrection),
      config.aprDecimals
    );

    if (apy.gt(BigInt.fromI32(0))) {
      pool.apr = createSPoolApr(event, duration, apy, pool.id).id;
    }
  }
  pool.balance = currentBalance.id;

  pool.save();
}
