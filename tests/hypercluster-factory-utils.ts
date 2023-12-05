import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { CamapignCreated } from "../generated/HyperclusterFactory/HyperclusterFactory"

export function createCamapignCreatedEvent(
  campaign: Address,
  safeAddress: Address,
  rewardTokenAddress: Address,
  rootReferral: Address,
  rewardPercentPerMilestone: BigInt,
  tokenAmount: BigInt,
  startTimestamp: BigInt,
  endTimestamp: BigInt,
  metadata: string
): CamapignCreated {
  let camapignCreatedEvent = changetype<CamapignCreated>(newMockEvent())

  camapignCreatedEvent.parameters = new Array()

  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam("campaign", ethereum.Value.fromAddress(campaign))
  )
  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "safeAddress",
      ethereum.Value.fromAddress(safeAddress)
    )
  )
  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardTokenAddress",
      ethereum.Value.fromAddress(rewardTokenAddress)
    )
  )
  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rootReferral",
      ethereum.Value.fromAddress(rootReferral)
    )
  )
  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardPercentPerMilestone",
      ethereum.Value.fromUnsignedBigInt(rewardPercentPerMilestone)
    )
  )
  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAmount",
      ethereum.Value.fromUnsignedBigInt(tokenAmount)
    )
  )
  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startTimestamp",
      ethereum.Value.fromUnsignedBigInt(startTimestamp)
    )
  )
  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTimestamp",
      ethereum.Value.fromUnsignedBigInt(endTimestamp)
    )
  )
  camapignCreatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )

  return camapignCreatedEvent
}
