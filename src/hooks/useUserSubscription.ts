
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { getUserGenerations } from '@/lib/supabase';

export interface UserSubscription {
  plan: 'free' | 'pro';
  maxIdeasPerGeneration: number;
  canGenerateCodingPrompts: boolean;
  generationsUsed: number;
  maxGenerationsPerDay: number;
  canGenerate: boolean;
}

export function useUserSubscription(): UserSubscription {
  const { user } = useUser();
  
  const { data: generationData } = useQuery({
    queryKey: ['user-generations', user?.id],
    queryFn: () => getUserGenerations(user?.id || ''),
    enabled: !!user?.id,
  });

  const userPlan = user?.publicMetadata?.plan as string || 'free';
  
  // Check if it's a new day (reset generations)
  const today = new Date().toISOString().split('T')[0];
  const isNewDay = generationData?.last_generation_date !== today;
  const generationsUsed = isNewDay ? 0 : (generationData?.generations_used || 0);
  
  if (userPlan === 'pro') {
    return {
      plan: 'pro',
      maxIdeasPerGeneration: 20,
      canGenerateCodingPrompts: true,
      generationsUsed,
      maxGenerationsPerDay: -1, // unlimited
      canGenerate: true,
    };
  }
  
  return {
    plan: 'free',
    maxIdeasPerGeneration: 3,
    canGenerateCodingPrompts: false,
    generationsUsed,
    maxGenerationsPerDay: 1, // only 1 generation per day for free users
    canGenerate: generationsUsed < 1,
  };
}
