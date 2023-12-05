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
} from "../generated/schema";

export function handleReferralAdded(event: ReferralAddedEvent): void {}
export function handleRewardsClaimed(event: RewardsClaimedEvent): void {}
export function handleMilestoneReached(event: MilestoneReachedEvent): void {}
export function handleBotCheckFailed(event: BotCheckFailedEvent): void {}
