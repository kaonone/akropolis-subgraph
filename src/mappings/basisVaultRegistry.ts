import { VaultDeactivated, VaultRegistered } from "../../generated/BasisVaultRegistry/BasisVaultRegistry";
import { BasisVault } from "../../generated/templates";
import { createOrUpdateBasisVault } from "../entities/basisVaults/createOrUpdateBasisVault";

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