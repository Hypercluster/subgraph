import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { CamapignCreated as CamapignCreatedEvent } from "../generated/HyperclusterFactory/HyperclusterFactory";
import {
  campaign as Campaign,
  referral as Referral,
  reward as Reward,
  user as User,
  tier as Tier,
  milestone as Milestone,
} from "../generated/schema";

import { Hypercluster } from "../generated/templates";

export function handleCamapignCreated(event: CamapignCreatedEvent): void {
  Hypercluster.create(event.params.campaign);

  let campaign = Campaign.load(event.params.campaign.toHexString());
  if (campaign == null) {
    campaign = new Campaign(event.params.campaign.toHexString());
    campaign.campaign = event.params.campaign;
    campaign.safeAddress = event.params.safeAddress;
    campaign.rewardTokenAddress = event.params.rewardTokenAddress;
    campaign.rewardPercentPerMilestone = event.params.rewardPercentPerMilestone;
    campaign.totalSupply = event.params.tokenAmount;
    campaign.totalMilestoneSupply = event.params.tokenAmount;
    campaign.availableRewards = event.params.tokenAmount;
    campaign.claimedRewards = BigInt.fromI32(0);
    campaign.milestonesReached = BigInt.fromI32(0);
    campaign.botCheckFails = BigInt.fromI32(0);
    campaign.startTimestamp = event.params.startTimestamp;
    campaign.endTimestamp = event.params.endTimestamp;
    campaign.metadata = event.params.metadata;
    campaign.totalReferrals = BigInt.fromI32(0);
    campaign.transactionHash = event.transaction.hash;
  }

  let tier = Tier.load(
    event.params.campaign.concat(Bytes.fromI32(1)).toHexString()
  ); // campaign + tier
  if (tier == null) {
    tier = new Tier(
      event.params.campaign.concat(Bytes.fromI32(1)).toHexString()
    );
    tier.tierNumber = BigInt.fromI32(1);
    tier.amount = BigInt.fromI32(0);
  }
  tier.save();

  let user = User.load(event.params.rootReferral.toHexString()); // referreal
  if (user == null) {
    user = new User(
      event.params.campaign.concat(event.params.rootReferral).toHexString()
    );
    user.user = event.params.rootReferral;
    user.childrenReferrals = [];
    user.totalClaimmableRewards = BigInt.fromI32(0);
    user.childrenReferrals = [];
    user.parentReferrals = [];
    user.campaigns = [];
  }
  user.campaigns.push(campaign.id);
  user.save();

  let milestone = new Milestone(
    event.params.campaign.concat(Bytes.fromI32(0)).toHexString()
  );
  milestone.claimEligibleUsers = [user.id];
  milestone.milestoneNumber = BigInt.fromI32(0);
  milestone.milestoneRewards = BigInt.fromI32(0);
  milestone.campaign = campaign.id;
  milestone.save();

  let reward = Reward.load(
    event.params.campaign.concat(event.params.rootReferral).toHexString()
  ); // campaign + referral + tier
  if (reward == null) {
    reward = new Reward(
      event.params.campaign.concat(Bytes.fromI32(1)).toHexString()
    );
    reward.tier = tier.id;
    reward.claimedAmount = BigInt.fromI32(0);
    reward.user = user.id;
  }
  reward.save();

  let referral = new Referral(
    event.params.campaign.concat(event.params.rootReferral).toHexString()
  );
  if (referral == null) {
    referral = new Referral(
      event.params.campaign.concat(event.params.rootReferral).toHexString()
    );
    referral.user = user.id;
    referral.reward = reward.id;
    referral.campaign = campaign.id;
    referral.parentReferral = null;
    referral.transactionHash = event.transaction.hash;
  }
  referral.campaign = campaign.id;
  referral.save();

  campaign.rootReferral = referral.id;
  campaign.save();
}
