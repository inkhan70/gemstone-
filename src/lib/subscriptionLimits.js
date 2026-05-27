// Subscription tier enforcement engine
export const TIER_LIMITS = {
  free: {
    inventoryLimit: 9,
    imagesPerItem:  1,
    liveAuctions:   0,
    voiceCalling:   true,
    price:          0,
    label:          'Free',
    storageGB:      0.018,
  },
  starter: {
    inventoryLimit: 50,
    imagesPerItem:  3,
    liveAuctions:   1,
    voiceCalling:   true,
    price:          14.99,
    label:          'Starter',
    storageGB:      0.5,
  },
  medium: {
    inventoryLimit: 100,
    imagesPerItem:  5,
    liveAuctions:   2,
    voiceCalling:   true,
    price:          29.99,
    label:          'Medium',
    storageGB:      2,
  },
  ultimate: {
    inventoryLimit: Infinity,
    imagesPerItem:  10,
    liveAuctions:   10,
    voiceCalling:   true,
    price:          79.99,
    label:          'Ultimate',
    storageGB:      25,
  },
};

export function canCreateListing(tier, currentCount) {
  const limit = TIER_LIMITS[tier]?.inventoryLimit ?? 9;
  if (limit === Infinity) return { allowed: true };
  if (currentCount >= limit) {
    return { allowed: false, reason: `Your ${tier} plan allows a maximum of ${limit} listings. Upgrade to add more.` };
  }
  return { allowed: true };
}

export function canCreateAuction(tier, currentLiveCount) {
  const limit = TIER_LIMITS[tier]?.liveAuctions ?? 0;
  if (limit === 0) return { allowed: false, reason: 'Live auctions require a Starter plan or above.' };
  if (currentLiveCount >= limit) {
    return { allowed: false, reason: `Your ${tier} plan allows ${limit} concurrent live auction(s). Upgrade to run more.` };
  }
  return { allowed: true };
}

export function maxImagesForTier(tier) {
  return TIER_LIMITS[tier]?.imagesPerItem ?? 1;
}

export function enforceImageLimit(tier, images = []) {
  const max = maxImagesForTier(tier);
  return images.slice(0, max);
}
