import { Address } from "@graphprotocol/graph-ts";
import { VaultControllerV2 } from "../../../generated/schema";

export function loadOrCreateVaultControllerV2(address: Address): VaultControllerV2 {
  let controller = VaultControllerV2.load(address.toHex());

  if (!controller) {
    controller = new VaultControllerV2(address.toHex());
    controller.save();
  }

  return controller as VaultControllerV2;
}
