import { log } from "@graphprotocol/graph-ts";
import { SPoolApr } from "../../../generated/schema";

export function loadSPoolApr(id: string): SPoolApr {
  let balance = SPoolApr.load(id);

  if (!balance) {
    log.error("Savings Pool APR with id {} not found", [id]);
    throw new Error("Savings Pool APR not found");
  }

  return balance as SPoolApr;
}
