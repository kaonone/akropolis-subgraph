import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { VaultStrategy } from "../../../generated/schema";
import { YVaultStrategy as YVaultStrategyTemplate } from "../../../generated/templates";
import { YVaultController } from "../../../generated/VaultSavingsModule/YVaultController";
import { YVaultStrategy } from "../../../generated/VaultSavingsModule/YVaultStrategy";

export function getStrategyAddress(
  controller: Address,
  underlyingToken: Address
): Address {
  let controllerContract = YVaultController.bind(controller);

  return controllerContract.strategies(underlyingToken);
}

export function loadOrCreateVaultStrategy(address: Address): VaultStrategy {
  let strategy = VaultStrategy.load(address.toHex());

  if (!strategy) {
    strategy = new VaultStrategy(address.toHex());

    updateStrategyFields(strategy as VaultStrategy);
    strategy.save();

    YVaultStrategyTemplate.create(address);
  }

  return strategy as VaultStrategy;
}

export function updateStrategy(address: Address): void {
  let strategy = VaultStrategy.load(address.toHex());

  if (!strategy) {
    throw new Error("Strategy does not exist");
  }

  updateStrategyFields(strategy as VaultStrategy);
  strategy.save();
}

function updateStrategyFields(strategy: VaultStrategy): void {
  let contract = YVaultStrategy.bind(Address.fromString(strategy.id));

  let withdrawFee = contract.try_withdrawalFee();
  let withdrawalMax = contract.try_withdrawalMax();
  let feeDenominator = contract.try_FEE_DENOMINATOR();

  strategy.withdrawFee = withdrawFee.reverted
    ? BigInt.fromI32(0)
    : withdrawFee.value;
  strategy.withdrawFeeDenominator = !feeDenominator.reverted
    ? feeDenominator.value
    : !withdrawalMax.reverted
    ? withdrawalMax.value
    : BigInt.fromI32(10000);

  if (withdrawFee.reverted) {
    log.warning('strategy.withdrawFee is reverted', []);
  }
  if (feeDenominator.reverted && withdrawalMax.reverted) {
    log.warning('strategy.withdrawFeeDenominator is reverted', []);
  }
}
