import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { CamapignCreated as CamapignCreatedEvent } from "../generated/HyperclusterFactory/HyperclusterFactory";
import { Campaign, Referral, Reward, User } from "../generated/schema";

export function handleCamapignCreated(event: CamapignCreatedEvent): void {
  let campaign=Campaign.load(event.params.campaign.toHexString());
  if(campaign==null){
    campaign = new Campaign(event.params.campaign.toHexString());
    campaign.campaign= event.params.campaign;
    campaign.availableRewards=event.params.tokenAmount;
    campaign.rewardTokenAddress=event.params.rewardTokenAddress;
    campaign.rewardPercentPerMilestone=event.params.rewardPercentPerMilestone;
    campaign.totalRewards=event.params.tokenAmount;
    campaign.availableRewards=event.params.tokenAmount;
    campaign.claimedRewards=BigInt.fromI32(0);
    campaign.milestonesReached=BigInt.fromI32(0);
    campaign.botCheckFails=BigInt.fromI32(0);
    campaign.startTimestamp=event.params.startTimestamp;
    campaign.endTimestamp=event.params.endTimestamp;
    campaign.metadata=event.params.metadata;
    campaign.totalReferrals=BigInt.fromI32(0);
    campaign.transactionHash=event.transaction.hash;
  }

  let reward=Reward.load(event.params.campaign.concat(Bytes.fromI32(1)).toHexString()); // campaign + tier
  if(reward==null)
  {
    reward = new Reward(event.params.campaign.concat(Bytes.fromI32(1)).toHexString());
    reward.tier=BigInt.fromI32(1);
    reward.amount=BigInt.fromI32(0);
  }
  reward.save();

  let user=User.load(event.params.campaign.concat(event.params.rootReferral).toHexString());
  if(user==null)
  {
    user=new User(event.params.campaign.concat(event.params.rootReferral).toHexString());
    user.user=event.params.rootReferral;
    user.campaigns=[]
    user.rewards=[]
    user.totalClaimmableRewards=BigInt.fromI32(0);
  }

  let referral = new Referral(event.params.campaign.concat(event.params.rootReferral).toHexString());
  if(referral==null)
  {
    referral=new Referral(event.params.campaign.concat(event.params.rootReferral).toHexString());
    referral.campaign=campaign.id;
    referral.user=event.params.rootReferral;
  }

  referral.campaign=campaign.id;



  campaign.rootReferral = ???
  campaign.save();
}
