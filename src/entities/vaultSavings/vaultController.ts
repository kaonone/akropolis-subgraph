import { Address } from "@graphprotocol/graph-ts";
import { VaultController, VaultPool } from "../../../generated/schema";

export function loadOrCreateVaultController(address: Address): VaultController {
  let controller = VaultController.load(address.toHex());

  if (!controller) {
    controller = new VaultController(address.toHex());
    controller.save();
  }

  return controller as VaultController;
}
