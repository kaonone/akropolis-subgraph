import {
  Deposit,
  VaultActivated,
  VaultDisabled,
  VaultRegistered,
} from "../../generated/VaultSavings/VaultSavings";
import { Modules } from "../utils";
import * as handlers from "./vaultHandlers/vaultSavings";

export function handleVaultRegistered(event: VaultRegistered): void {
  handlers.handleVaultRegistered(event, Modules.ethVaultsV2);
}

export function handleVaultDisabled(event: VaultDisabled): void {
  handlers.handleVaultDisabled(event);
}

export function handleVaultActivated(event: VaultActivated): void {
  handlers.handleVaultActivated(event);
}

export function handleDeposit(event: Deposit): void {
  handlers.handleDeposit(event, Modules.ethVaultsV2);
}
