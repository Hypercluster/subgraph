import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CamapignCreated } from "../generated/schema"
import { CamapignCreated as CamapignCreatedEvent } from "../generated/HyperclusterFactory/HyperclusterFactory"
import { handleCamapignCreated } from "../src/hypercluster-factory"
import { createCamapignCreatedEvent } from "./hypercluster-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let campaign = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let safeAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let rewardTokenAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let rootReferral = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let rewardPercentPerMilestone = BigInt.fromI32(234)
    let tokenAmount = BigInt.fromI32(234)
    let startTimestamp = BigInt.fromI32(234)
    let endTimestamp = BigInt.fromI32(234)
    let metadata = "Example string value"
    let newCamapignCreatedEvent = createCamapignCreatedEvent(
      campaign,
      safeAddress,
      rewardTokenAddress,
      rootReferral,
      rewardPercentPerMilestone,
      tokenAmount,
      startTimestamp,
      endTimestamp,
      metadata
    )
    handleCamapignCreated(newCamapignCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CamapignCreated created and stored", () => {
    assert.entityCount("CamapignCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "campaign",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "safeAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rewardTokenAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rootReferral",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rewardPercentPerMilestone",
      "234"
    )
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenAmount",
      "234"
    )
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "startTimestamp",
      "234"
    )
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "endTimestamp",
      "234"
    )
    assert.fieldEquals(
      "CamapignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadata",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
