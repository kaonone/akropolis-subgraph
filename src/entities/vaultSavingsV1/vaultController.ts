import { Address } from "@graphprotocol/graph-ts";
import { VaultControllerV1 } from "../../../generated/schema";

export function loadOrCreateVaultControllerV1(address: Address): VaultControllerV1 {
  let controller = VaultControllerV1.load(address.toHex());

  if (!controller) {
    controller = new VaultControllerV1(address.toHex());
    controller.save();
  }

  return controller as VaultControllerV1;
}
