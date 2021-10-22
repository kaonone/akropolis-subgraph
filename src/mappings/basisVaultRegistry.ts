import { VaultDeactivated, VaultRegistered } from "../../generated/BasisVaultRegistry/BasisVaultRegistry";
import { createOrUpdateBasisVault } from "../entities/basisVaults/createOrUpdateBasisVault";

export function handleVaultRegistered(
  event: VaultRegistered,
): void {
  createOrUpdateBasisVault(event.params.vault, true);
}

export function handleBasisVaultDeactivated(
  event: VaultDeactivated,
): void {
  createOrUpdateBasisVault(event.params.vault, false);
}