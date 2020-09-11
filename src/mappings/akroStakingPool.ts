import { loadUser } from "../entities";
import { Staked } from "../../generated/AKROStakingPool/StakingPool";

export function handleStaked(event: Staked): void {
  loadUser(event.params.user);
}
