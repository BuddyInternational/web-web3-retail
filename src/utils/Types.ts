// Define NFT interface for save details in Database
export interface NFTDetails {
  chainName?: string;
  contractAddress?: string;
  tokenId?: any;
  name?: string;
  tokenType?: string;
  tokenUri?: string;
  imageUrl?: string;
  mediaType?: any;
  timeLastUpdated?: string;
  floorPrice?: number | null;
  floorPriceUsd?: number;
  priceCurrency?: string | null;
  lastclaimedAt: Date | null;
  totalClaimedRewardCount: number;
  totalClaimedRewardHash: string[];
}
