import { VaultDeactivated, VaultRegistered } from "../../generated/BasisVaultsRegistry/BasisVaultsRegistry";
import { BasisVault } from "../../generated/templates";
import { createOrUpdateBasisVault } from "../entities/basisVaults";

export function handleVaultRegistered(
  event: VaultRegistered,
): void {
  createOrUpdateBasisVault(event.block, event.params.vault, true);
  BasisVault.create(event.params.vault);
}

export function handleBasisVaultDeactivated(
  event: VaultDeactivated,
): void {
  createOrUpdateBasisVault(event.block, event.params.vault, false);
}