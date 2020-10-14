import { Address, BigInt, ethereum, dataSource } from "@graphprotocol/graph-ts";

import {
  Deposit,
  ProtocolRegistered,
  RewardDistribution,
  SavingsModule,
  YieldDistribution,
} from "../../generated/SavingsModule/SavingsModule";
import { DefiProtocol } from "../../generated/SavingsModule/DefiProtocol";
import {
  createOrUpdateSavingsPool,
  loadSavingsPool,
  createSPoolBalance,
  loadSPoolBalance,
  loadSubgraphConfig,
  createSPoolApr,
  createSReward,
  loadUser,
  loadSPoolApr,
} from "../entities";
import { calcAPY, addUniq } from "../utils";

export function handleProtocolRegistered(event: ProtocolRegistered): void {
  createOrUpdateSavingsPool(
    event,
    event.params.protocol,
    event.params.poolToken
  );
}

export function handleRewardDistribution(event: RewardDistribution): void {
  let savingsModuleAddress = dataSource.address();
  let contract = SavingsModule.bind(savingsModuleAddress);
  let savingsPoolAddress = contract.protocolByPoolToken(event.params.poolToken);

  updateRewardDistributionDates(event, savingsPoolAddress);
  createSReward(event, savingsPoolAddress);
}

export function handleYieldDistribution(event: YieldDistribution): void {
  let savingsModuleAddress = dataSource.address();
  let contract = SavingsModule.bind(savingsModuleAddress);
  let savingsPoolAddress = contract.protocolByPoolToken(event.params.poolToken);

  updatePoolBalances(event, savingsPoolAddress);
  createSPoolAprOnYieldDistribution(
    event,
    savingsPoolAddress,
    event.params.amount
  );
}

export function handleDeposit(event: Deposit): void {
  let user = loadUser(event.params.user);
  user.savingsPools = addUniq(user.savingsPools, event.params.protocol.toHex());
  user.save();
}

function createSPoolAprOnYieldDistribution(
  event: ethereum.Event,
  poolAddress: Address,
  yieldAmount: BigInt
): void {
  let config = loadSubgraphConfig();

  let pool = loadSavingsPool(poolAddress);
  let prevAPR = loadSPoolApr(pool.apr);

  let duration = event.block.timestamp
    .minus(prevAPR.date)
    .plus(BigInt.fromI32(1));

  let isSecondDistributionEvent = prevAPR.txHash.equals(event.transaction.hash);

  let initialBalance = isSecondDistributionEvent
    ? loadSPoolBalance(pool.balance).amount.minus(yieldAmount)
    : loadSPoolBalance(pool.prevBalance).amount;

  let apy =
    !initialBalance.isZero() && !yieldAmount.isZero()
      ? calcAPY(
          duration,
          initialBalance,
          initialBalance.plus(yieldAmount),
          config.aprDecimals
        )
      : BigInt.fromI32(0);

  pool.apr = createSPoolApr(event, duration, apy, pool.id).id;
  pool.save();
}

function updatePoolBalances(event: ethereum.Event, poolAddress: Address): void {
  let pool = loadSavingsPool(poolAddress);
  let poolBalance = loadSPoolBalance(pool.balance);

  if (poolBalance.date.equals(event.block.timestamp)) {
    return;
  }

  let contract = DefiProtocol.bind(poolAddress);

  let currentBalance = createSPoolBalance(
    event,
    contract.normalizedBalance(),
    pool.id
  );

  pool.prevBalance = pool.balance;
  pool.balance = currentBalance.id;

  pool.save();
}

function updateRewardDistributionDates(event: ethereum.Event, poolAddress: Address): void {
  let pool = loadSavingsPool(poolAddress);

  if (pool.lastRewardDistributionDate.equals(event.block.timestamp)) {
    return;
  }

  pool.prevRewardDistributionDate = pool.lastRewardDistributionDate;
  pool.lastRewardDistributionDate = event.block.timestamp;

  pool.save();
}
