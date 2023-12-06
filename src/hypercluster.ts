import {
  ReferralAdded as ReferralAddedEvent,
  RewardsClaimed as RewardsClaimedEvent,
  MilestoneReached as MilestoneReachedEvent,
  BotCheckFailed as BotCheckFailedEvent,
} from "../generated/templates/Hypercluster/Hypercluster";
import {
  campaign as Campaign,
  referral as Referral,
  reward as Reward,
  user as User,
  tier as Tier,
  milestone as Milestone,
} from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleReferralAdded(event: ReferralAddedEvent): void {
  let campaign = Campaign.load(event.address.toHexString());
  if (campaign != null) {
    campaign.totalReferrals = campaign.totalReferrals.plus(BigInt.fromI32(1));
    campaign.save();

    let user = User.load(event.params.referral.toHexString());
    if (user == null) {
      user = new User(event.params.referral.toHexString());
      user.user = event.params.referral;
      user.totalClaimmableRewards = BigInt.fromI32(0);
      user.childrenReferrals = [];
    }
    user.parentReferrals.push(event.params.sender.toHexString());
    user.campaigns.push(event.address.toHexString());
    user.save();

    let milestone = Milestone.load(
      event.address
        .concat(
          Bytes.fromByteArray(Bytes.fromBigInt(campaign.milestonesReached))
        )
        .toHexString()
    );
    if (milestone != null) {
      milestone.claimEligibleUsers.push(user.id);
    }
    let senderUser = User.load(event.params.sender.toHexString());
    if (senderUser != null) {
      senderUser.childrenReferrals.push(event.params.referral.toHexString());
      senderUser.save();
    }

    let tierNumber = BigInt.fromI32(0);
    let senderReferral = Referral.load(
      event.address.concat(event.params.sender).toHexString()
    );
    if (senderReferral != null) {
      let senderReward = Reward.load(senderReferral.reward);
      if (senderReward != null) {
        let senderTier = Tier.load(senderReward.tier);
        if (senderTier != null)
          tierNumber = senderTier.tierNumber.plus(BigInt.fromI32(1));
      }
    }

    let tier = Tier.load(
      event.address
        .concat(Bytes.fromByteArray(Bytes.fromBigInt(tierNumber)))
        .toHexString()
    );
    if (tier == null) {
      tier = new Tier(
        event.address
          .concat(Bytes.fromByteArray(Bytes.fromBigInt(tierNumber)))
          .toHexString()
      );
      tier.tierNumber = tierNumber;
      tier.amount = BigInt.fromI32(0);
    }
    tier.save();

    let reward = Reward.load(
      event.address.concat(event.params.referral).toHexString()
    );
    if (reward == null) {
      reward = new Reward(
        event.address.concat(event.params.referral).toHexString()
      );
      reward.tier = tier.id;
      reward.claimedAmount = BigInt.fromI32(0);
      reward.user = user.id;
    }
    reward.save();

    //   let reward = Reward.load(event.address
    let referral = new Referral(
      event.address.concat(event.params.referral).toHexString()
    );
    referral.user = user.id;
    referral.reward = reward.id;
    referral.campaign = event.address.toHexString();
    referral.parentReferral = event.params.sender.toHexString();
    referral.transactionHash = event.transaction.hash;
    referral.save();
  }
}
export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let campaign = Campaign.load(event.address.toHexString());
  if (campaign != null) {
    campaign.claimedRewards = campaign.claimedRewards.plus(event.params.amount);
    if (event.params.amount < campaign.availableRewards) {
      campaign.availableRewards = campaign.availableRewards.minus(
        event.params.amount
      );
    } else campaign.availableRewards = BigInt.fromI32(0);
    campaign.save();
  }

  let reward = Reward.load(
    event.address.concat(event.params.claimer).toHexString()
  );
  if (reward != null) {
    reward.claimedAmount = reward.claimedAmount.plus(event.params.amount);
    reward.save();
  }

  let user = User.load(event.params.claimer.toHexString());
  if (user != null) {
    if (event.params.amount < user.totalClaimmableRewards) {
      user.totalClaimmableRewards = user.totalClaimmableRewards.minus(
        event.params.amount
      );
    } else user.totalClaimmableRewards = BigInt.fromI32(0);
    user.save();
  }
}
export function handleMilestoneReached(event: MilestoneReachedEvent): void {
  let campaign = Campaign.load(event.address.toHexString());
  if (campaign != null) {
    campaign.milestonesReached = campaign.milestonesReached.plus(
      BigInt.fromI32(1)
    );
    campaign.totalMilestoneSupply = campaign.totalMilestoneSupply.minus(
      campaign.totalMilestoneSupply
        .times(campaign.rewardPercentPerMilestone)
        .div(BigInt.fromI32(100))
    );
    campaign.save();

    let prevUsers: string[] = [];
    let prevMilestone = Milestone.load(
      event.address
        .concat(
          Bytes.fromByteArray(
            Bytes.fromBigInt(
              campaign.milestonesReached.minus(BigInt.fromI32(1))
            )
          )
        )
        .toHexString()
    );
    if (prevMilestone != null) {
      if (prevMilestone.claimEligibleUsers != null) {
        prevUsers = prevMilestone.claimEligibleUsers;
      }
    }

    let milestone = new Milestone(
      event.address
        .concat(
          Bytes.fromByteArray(Bytes.fromBigInt(campaign.milestonesReached))
        )
        .toHexString()
    );
    milestone.campaign = campaign.id;
    milestone.milestoneNumber = campaign.milestonesReached;
    milestone.milestoneRewards = campaign.totalMilestoneSupply
      .times(campaign.rewardPercentPerMilestone)
      .div(BigInt.fromI32(100));
    milestone.claimEligibleUsers = prevUsers;
    milestone.save();

    let tier = 1;
    while (true) {
      let tierEntity = Tier.load(
        event.address.concat(Bytes.fromI32(tier)).toHexString()
      );
      if (tierEntity == null) break;
      if (tier < 3) {
        tierEntity.amount = tierEntity.amount.plus(
          milestone.milestoneRewards
            .times(BigInt.fromI32(11).minus(tierEntity.tierNumber))
            .div(BigInt.fromI32(100))
        );
      } else if (tier < 10) {
        tierEntity.amount = tierEntity.amount.plus(
          milestone.milestoneRewards
            .times(BigInt.fromI32(10).minus(tierEntity.tierNumber))
            .div(BigInt.fromI32(100))
        );
      } else {
        tierEntity.amount = tierEntity.amount.plus(
          milestone.milestoneRewards
            .times(
              BigInt.fromI32(5).pow(
                tierEntity.tierNumber.minus(BigInt.fromI32(9)).toU32() as u8
              )
            )
            .div(
              BigInt.fromI32(10).times(
                tierEntity.tierNumber.minus(BigInt.fromI32(8))
              )
            )
        );
      }
    }
  }
}
export function handleBotCheckFailed(event: BotCheckFailedEvent): void {
  let campaign = Campaign.load(event.address.toHexString());
  if (campaign != null) {
    campaign.botCheckFails = campaign.botCheckFails.plus(BigInt.fromI32(1));
    campaign.save();
  }
}
