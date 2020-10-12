import { log } from "@graphprotocol/graph-ts";
import { VPoolApr } from "../../../generated/schema";

export function loadVPoolApr(id: string): VPoolApr {
  let balance = VPoolApr.load(id);

  if (!balance) {
    log.error("Vault Pool APR with id {} not found", [id]);
    throw new Error("Vault Pool APR not found");
  }

  return balance as VPoolApr;
}
