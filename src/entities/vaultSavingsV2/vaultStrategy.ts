import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { VaultStrategyV2 } from "../../../generated/schema";
import { YVaultStrategyV2 as YVaultStrategyV2Template } from "../../../generated/templates";
import { YVaultControllerV2 } from "../../../generated/VaultSavingsV2/YVaultControllerV2";
import { YVaultStrategyV2 } from "../../../generated/VaultSavingsV2/YVaultStrategyV2";

export function getStrategyV2Address(
  controller: Address,
  underlyingToken: Address
): Address {
  let controllerContract = YVaultControllerV2.bind(controller);

  return controllerContract.strategies(underlyingToken);
}

export function loadOrCreateVaultStrategyV2(address: Address): VaultStrategyV2 {
  let strategy = VaultStrategyV2.load(address.toHex());

  if (!strategy) {
    strategy = new VaultStrategyV2(address.toHex());

    updateStrategyFields(strategy as VaultStrategyV2);
    strategy.save();

    YVaultStrategyV2Template.create(address);
  }

  return strategy as VaultStrategyV2;
}

export function updateStrategyV2(address: Address): void {
  let strategy = VaultStrategyV2.load(address.toHex());

  if (!strategy) {
    throw new Error("Strategy does not exist");
  }

  updateStrategyFields(strategy as VaultStrategyV2);
  strategy.save();
}

function updateStrategyFields(strategy: VaultStrategyV2): void {
  let contract = YVaultStrategyV2.bind(Address.fromString(strategy.id));

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
