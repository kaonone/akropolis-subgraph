import { loadUser } from "../entities";
import { Staked, Unstaked } from "../../generated/StakingPool/StakingPool";
import { log } from "@graphprotocol/graph-ts";

export function handleStaked(event: Staked): void {
  loadUser(event.params.user);
}
