import { Address } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";
import { loadGlobalStat } from "./loadGlobalStats";

export function loadOrCreateUser(address: Address): User {
  let id = address.toHex();
  let user = User.load(id);

  if (!user) {
    user = new User(id);
    user.savingsPools = [];
    user.vaultPools = [];
    user.stakingPools = [];
    user.save();

    let stats = loadGlobalStat();
    stats.activeMembersCount = stats.activeMembersCount + 1;
    stats.save();
  }

  return user as User;
}

export function loadUser(address: Address): User | null {
  let id = address.toHex();
  let user = User.load(id);

  return user;
}
