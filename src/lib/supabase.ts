
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfwjpgidmxzhgmqpxihv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmd2pwZ2lkbXh6aGdtcXB4aWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTAzNzEsImV4cCI6MjA2NDAyNjM3MX0.jMki_HtINto7VnsgtXgmQ8GTdKxyVd1exC7oCFJ7Tzo';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface SavedIdea {
  id: string;
  user_id: string;
  business_name: string;
  niche: string;
  description: string;
  hashtags: string[];
  coding_prompt?: string;
  created_at: string;
}

export const saveIdea = async (idea: {
  businessName: string;
  description: string;
  niche: string;
  hashtags: string[];
  codingPrompt?: string;
}, userId: string) => {
  const { data, error } = await supabase
    .from('ideas')
    .insert({
      user_id: userId,
      business_name: idea.businessName,
      niche: idea.niche,
      description: idea.description,
      hashtags: idea.hashtags,
      coding_prompt: idea.codingPrompt || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSavedIdeas = async (userId: string): Promise<SavedIdea[]> => {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteIdea = async (ideaId: string) => {
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', ideaId);

  if (error) throw error;
};
