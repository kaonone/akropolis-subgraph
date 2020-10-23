import { Address, BigInt, ethereum, dataSource } from "@graphprotocol/graph-ts";

import {
  Deposit,
  VaultRegistered,
  RewardDistribution,
  VaultSavingsModule,
  YieldDistribution,
} from "../../generated/VaultSavingsModule/VaultSavingsModule";
import { VaultProtocol } from "../../generated/VaultSavingsModule/VaultProtocol";
import {
  createOrUpdateVaultPool,
  loadVaultPool,
  createVPoolBalance,
  loadVPoolBalance,
  loadSubgraphConfig,
  createVPoolApr,
  createVReward,
  loadUser,
  loadVPoolApr,
} from "../entities";
import { calcAPY, addUniq } from "../utils";

export function handleVaultRegistered(event: VaultRegistered): void {
  createOrUpdateVaultPool(event, event.params.protocol, event.params.poolToken);
}

export function handleRewardDistribution(event: RewardDistribution): void {
  let savingsModuleAddress = dataSource.address();
  let contract = VaultSavingsModule.bind(savingsModuleAddress);
  let savingsPoolAddress = contract.protocolByPoolToken(event.params.poolToken);
  createVReward(event, savingsPoolAddress);
}

export function handleYieldDistribution(event: YieldDistribution): void {
  let savingsModuleAddress = dataSource.address();
  let contract = VaultSavingsModule.bind(savingsModuleAddress);
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
  user.vaultPools = addUniq(user.vaultPools, event.params.protocol.toHex());
  user.save();
}

function createSPoolAprOnYieldDistribution(
  event: ethereum.Event,
  poolAddress: Address,
  yieldAmount: BigInt
): void {
  let config = loadSubgraphConfig();

  let pool = loadVaultPool(poolAddress);
  let prevAPR = loadVPoolApr(pool.apr);

  let duration = event.block.timestamp
    .minus(prevAPR.date)
    .plus(BigInt.fromI32(1));

  let isSecondDistributionEvent = prevAPR.txHash.equals(event.transaction.hash);

  let initialBalance = isSecondDistributionEvent
    ? loadVPoolBalance(pool.balance).amount.minus(yieldAmount)
    : loadVPoolBalance(pool.prevBalance).amount;

  let apy =
    !initialBalance.isZero() && !yieldAmount.isZero()
      ? calcAPY(
          duration,
          initialBalance,
          initialBalance.plus(yieldAmount),
          config.aprDecimals
        )
      : BigInt.fromI32(0);

  pool.apr = createVPoolApr(event, duration, apy, pool.id).id;
  pool.save();
}

function updatePoolBalances(event: ethereum.Event, poolAddress: Address): void {
  let pool = loadVaultPool(poolAddress);
  let poolBalance = loadVPoolBalance(pool.balance);

  if (poolBalance.date.equals(event.block.timestamp)) {
    return;
  }

  let contract = VaultProtocol.bind(poolAddress);

  let currentBalance = createVPoolBalance(
    event,
    contract.normalizedBalance().plus(contract.normalizedVaultBalance()),
    pool.id
  );

  pool.prevBalance = pool.balance;
  pool.balance = currentBalance.id;

  pool.save();
}
