import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type AdPlacement = 'home' | 'job-detail';
export type AdFormat = 'auto' | 'fluid' | 'rectangle';

export interface AdSettings {
  enabled: boolean;
  showOnHome: boolean;
  showOnJobDetail: boolean;
  slotId: string;
  format: AdFormat;
  label: string;
}

export const DEFAULT_AD_SETTINGS: AdSettings = {
  enabled: true,
  showOnHome: true,
  showOnJobDetail: true,
  slotId: '1234567890',
  format: 'auto',
  label: 'إعلان تجاري مدعوم',
};

function normalize(value: unknown): AdSettings {
  const input = (value && typeof value === 'object' ? value : {}) as Partial<AdSettings>;
  return {
    enabled: input.enabled !== false,
    showOnHome: input.showOnHome !== false,
    showOnJobDetail: input.showOnJobDetail !== false,
    slotId: typeof input.slotId === 'string' && input.slotId.trim() ? input.slotId.trim() : DEFAULT_AD_SETTINGS.slotId,
    format: input.format === 'fluid' || input.format === 'rectangle' ? input.format : 'auto',
    label: typeof input.label === 'string' && input.label.trim() ? input.label.trim().slice(0, 80) : DEFAULT_AD_SETTINGS.label,
  };
}

export async function getAdSettings(): Promise<AdSettings> {
  if (!isSupabaseConfigured || !supabase) return DEFAULT_AD_SETTINGS;
  try {
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'ads').maybeSingle();
    if (error || !data) return DEFAULT_AD_SETTINGS;
    return normalize(data.value);
  } catch {
    return DEFAULT_AD_SETTINGS;
  }
}

export function normalizeAdSettings(value: unknown) {
  return normalize(value);
}
