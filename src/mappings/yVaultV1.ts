import { Transfer } from "../../generated/templates/YVaultV1/ERC20Detailed";
import { Modules } from "../utils";
import * as handlers from "./vaultHandlers/vault";

export function handleTransfer(event: Transfer): void {
  handlers.handleTransfer(event, Modules.ethVaultsV1);
}
