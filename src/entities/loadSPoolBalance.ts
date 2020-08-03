import { log } from "@graphprotocol/graph-ts";
import { SPoolBalance } from "../../generated/schema";

export function loadSPoolBalance(id: string): SPoolBalance {
  let balance = SPoolBalance.load(id);

  if (!balance) {
    log.error("Savings Pool Balance with id {} not found", [id]);
    throw new Error("Savings Pool balance not found");
  }

  return balance as SPoolBalance;
}
