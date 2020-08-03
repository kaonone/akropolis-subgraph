import { Address } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";

export function loadUser(address: Address): User {
  let id = address.toHex();
  let user = User.load(id);

  if (!user) {
    user = new User(id);
    user.savingsPools = [];
    user.save();
  }

  return user as User;
}
