import { SubgraphConfig } from "../../generated/schema";
import { SUBGRAPH_CONFIG_ID } from "../utils";

export function loadSubgraphConfig(): SubgraphConfig {
  let config = SubgraphConfig.load(SUBGRAPH_CONFIG_ID);

  if (!config) {
    config = new SubgraphConfig(SUBGRAPH_CONFIG_ID);

    config.aprDecimals = 8;
    config.save();
  }

  return config as SubgraphConfig;
}
