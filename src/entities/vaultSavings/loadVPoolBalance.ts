import { log } from "@graphprotocol/graph-ts";
import { VPoolBalance } from "../../../generated/schema";

export function loadVPoolBalance(id: string): VPoolBalance {
  let balance = VPoolBalance.load(id);

  if (!balance) {
    log.error("Savings Pool Balance with id {} not found", [id]);
    throw new Error("Savings Pool balance not found");
  }

  return balance as VPoolBalance;
}
