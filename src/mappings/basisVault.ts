import { Address, BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";

import { ERC20Detailed } from "../../generated/Contracts/ERC20Detailed";
import { User } from "../../generated/schema";
import {
  Deposit,
  StrategyUpdate,
  Withdraw,
} from "../../generated/templates/BasisVault/BasisVault";

import { loadOrCreateUser, loadUser } from "../entities/shared";
import {
  activateUser,
  deactivateUserIfZeroBalance,
} from "../entities/globalStats";
import {
  loadBasisVault,
  createOrUpdateSharePrice,
} from "../entities/basisVaults";
import { createEventLog } from "../entities/logs";
import { addUniq, EventType, exclude } from "../utils";

export function handleDeposit(event: Deposit): void {
  let basisVaultAddress = dataSource.address();
  let user = loadOrCreateUser(event.params.user);
  user.basisVaults = addUniq(user.basisVaults, basisVaultAddress.toHex());
  activateUser(user);
  user.save();

  createEventLog(
    event,
    basisVaultAddress,
    event.params.user,
    EventType.BASIS_VAULT_DEPOSIT
  );
}

export function handleWithdraw(event: Withdraw): void {
  let basisVaultAddress = dataSource.address();
  let userAddress = event.params.user;
  let user = loadUser(userAddress);

  updateVaultSharePrice(event.block, basisVaultAddress);

  if (!user || !user.basisVaults.includes(basisVaultAddress.toHex())) {
    return;
  }

  let contract = ERC20Detailed.bind(basisVaultAddress);
  let userBalance = contract.balanceOf(userAddress);

  if (userBalance.le(BigInt.fromI32(0))) {
    user.basisVaults = exclude(user.basisVaults, basisVaultAddress.toHex());
    deactivateUserIfZeroBalance(user as User);
    user.save();
  }

  createEventLog(
    event,
    basisVaultAddress,
    event.params.user,
    EventType.BASIS_VAULT_WITHDRAW
  );
}

export function handleStrategyUpdate(event: StrategyUpdate): void {
  let basisVaultAddress = dataSource.address();
  updateVaultSharePrice(event.block, basisVaultAddress);
  updateTotalEarnings(
    basisVaultAddress,
    event.params.profitOrLoss,
    event.params.isLoss
  );
}

function updateTotalEarnings(
  vaultAddress: Address,
  profitOrLoss: BigInt,
  isLoss: boolean
): void {
  let vault = loadBasisVault(vaultAddress);

  let amount = isLoss ? profitOrLoss.neg() : profitOrLoss;
  vault.totalEarnings = vault.totalEarnings.plus(amount);

  vault.save();
}

function updateVaultSharePrice(block: ethereum.Block, vaultAddress: Address): void {
  let vault = loadBasisVault(vaultAddress);
  let newPrice = createOrUpdateSharePrice(vaultAddress, block.timestamp);
  vault.currentSharePrice = newPrice.id;
  vault.save();
}
