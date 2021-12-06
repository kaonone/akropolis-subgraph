import { Address, ethereum } from "@graphprotocol/graph-ts";

import { EventLog } from "../../../generated/schema";
import { getUniqId } from "../../utils";

export function createEventLog(
  event: ethereum.Event,
  contract: Address,
  userAddress: Address,
  type: string
): EventLog {
  let eventLog = new EventLog(getUniqId(event));

  eventLog.type = type;
  eventLog.contract = contract;
  eventLog.createdAtBlock = event.block.number;
  eventLog.createdAtDate = event.block.timestamp;
  eventLog.txHash = event.transaction.hash;
  eventLog.user = userAddress.toHex();
  eventLog.data = getEventData(event.parameters);
  eventLog.save();

  return eventLog;
}

function getEventData(params: ethereum.EventParam[]): string {
  let dataItems: string[] = [];

  for (let i = 0; i < params.length; i++) {
    dataItems.push(valueToString(params[i].value));
  }

  return dataItems.join(",");
}

function valueToString(value: ethereum.Value): string {
  switch (value.kind) {
    case ethereum.ValueKind.ADDRESS:
      return value.toAddress().toHex();
    case ethereum.ValueKind.BOOL:
      return value.toBoolean() ? "1" : "0";
    case ethereum.ValueKind.BYTES:
    case ethereum.ValueKind.FIXED_BYTES:
      return value.toBytes().toHex();
    case ethereum.ValueKind.INT:
    case ethereum.ValueKind.UINT:
      return value.toBigInt().toString();
    case ethereum.ValueKind.STRING:
      return value.toString();
    case ethereum.ValueKind.ARRAY:
    case ethereum.ValueKind.FIXED_ARRAY: {
      let values = value.toArray();
      let stringValues: string[] = [];

      for (let i = 0; i < values.length; i++) {
        stringValues.push(valueToString(values[i]));
      }

      return "[" + stringValues.join(",") + "]";
    }
    case ethereum.ValueKind.TUPLE: {
      let values = value.toTuple();
      let stringValues: string[] = [];

      for (let i = 0; i < values.length; i++) {
        stringValues.push(valueToString(values[i]));
      }

      return "[" + stringValues.join(",") + "]";
    }
    default: {
      throw new Error("EventLog: Unknown value king");
    }
  }
}
