
import { useUser } from '@clerk/clerk-react';

export interface UserSubscription {
  plan: 'free' | 'pro';
  maxIdeasPerGeneration: number;
  canGenerateCodingPrompts: boolean;
}

export function useUserSubscription(): UserSubscription {
  const { user } = useUser();
  
  // In a real app, this would check the user's subscription status from your database
  // For now, we'll simulate that all users are on the free plan
  const userPlan = user?.publicMetadata?.plan as string || 'free';
  
  if (userPlan === 'pro') {
    return {
      plan: 'pro',
      maxIdeasPerGeneration: 20,
      canGenerateCodingPrompts: true,
    };
  }
  
  return {
    plan: 'free',
    maxIdeasPerGeneration: 3,
    canGenerateCodingPrompts: false,
  };
}
