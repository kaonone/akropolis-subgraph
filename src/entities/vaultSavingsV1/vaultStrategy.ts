import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { VaultStrategyV1 } from "../../../generated/schema";
import { YVaultStrategyV1 as YVaultStrategyV1Template } from "../../../generated/templates";
import { YVaultControllerV1 } from "../../../generated/VaultSavingsV1/YVaultControllerV1";
import { YVaultStrategyV1 } from "../../../generated/VaultSavingsV1/YVaultStrategyV1";

export function getStrategyV1Address(
  controller: Address,
  underlyingToken: Address
): Address {
  let controllerContract = YVaultControllerV1.bind(controller);

  return controllerContract.strategies(underlyingToken);
}

export function loadOrCreateVaultStrategyV1(address: Address): VaultStrategyV1 {
  let strategy = VaultStrategyV1.load(address.toHex());

  if (!strategy) {
    strategy = new VaultStrategyV1(address.toHex());

    updateStrategyFields(strategy as VaultStrategyV1);
    strategy.save();

    YVaultStrategyV1Template.create(address);
  }

  return strategy as VaultStrategyV1;
}

export function updateStrategyV1(address: Address): void {
  let strategy = VaultStrategyV1.load(address.toHex());

  if (!strategy) {
    throw new Error("Strategy does not exist");
  }

  updateStrategyFields(strategy as VaultStrategyV1);
  strategy.save();
}

function updateStrategyFields(strategy: VaultStrategyV1): void {
  let contract = YVaultStrategyV1.bind(Address.fromString(strategy.id));

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
