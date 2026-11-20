import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface HomeStatsSettings {
  total: boolean;
  active: boolean;
  expiringSoon: boolean;
  totalViews: boolean;
}

export const DEFAULT_HOME_STATS_SETTINGS: HomeStatsSettings = {
  total: true,
  active: true,
  expiringSoon: true,
  totalViews: true,
};

export function normalizeHomeStatsSettings(value: unknown): HomeStatsSettings {
  const input = (value && typeof value === 'object' ? value : {}) as Partial<HomeStatsSettings>;
  return {
    total: input.total !== false,
    active: input.active !== false,
    expiringSoon: input.expiringSoon !== false,
    totalViews: input.totalViews !== false,
  };
}

export async function getHomeStatsSettings(): Promise<HomeStatsSettings> {
  if (!isSupabaseConfigured || !supabase) return DEFAULT_HOME_STATS_SETTINGS;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'home_stats')
      .maybeSingle();
    if (error || !data) return DEFAULT_HOME_STATS_SETTINGS;
    return normalizeHomeStatsSettings(data.value);
  } catch {
    return DEFAULT_HOME_STATS_SETTINGS;
  }
}
