import { CamapignCreated as CamapignCreatedEvent } from "../generated/HyperclusterFactory/HyperclusterFactory"
import { CamapignCreated } from "../generated/schema"

export function handleCamapignCreated(event: CamapignCreatedEvent): void {
  let entity = new CamapignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaign = event.params.campaign
  entity.safeAddress = event.params.safeAddress
  entity.rewardTokenAddress = event.params.rewardTokenAddress
  entity.rootReferral = event.params.rootReferral
  entity.rewardPercentPerMilestone = event.params.rewardPercentPerMilestone
  entity.tokenAmount = event.params.tokenAmount
  entity.startTimestamp = event.params.startTimestamp
  entity.endTimestamp = event.params.endTimestamp
  entity.metadata = event.params.metadata

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
