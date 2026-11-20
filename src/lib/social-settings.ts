import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface SocialSettings {
  telegramUrl: string;
  whatsappUrl: string;
  xUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
  snapchatUrl: string;
}

export const DEFAULT_SOCIAL_SETTINGS: SocialSettings = {
  telegramUrl: 'https://t.me/wadhaef_sa',
  whatsappUrl: 'https://whatsapp.com/channel/0029Vaexample',
  xUrl: 'https://x.com/wadhaef_sa',
  tiktokUrl: 'https://tiktok.com/@wadhaef_sa',
  instagramUrl: 'https://instagram.com/wadhaef_sa',
  snapchatUrl: 'https://snapchat.com/add/wadhaef_sa',
};

export function normalizeSocialSettings(value: unknown): SocialSettings {
  const input = (value && typeof value === 'object' ? value : {}) as Partial<SocialSettings>;
  return {
    telegramUrl: typeof input.telegramUrl === 'string' && input.telegramUrl.trim() ? input.telegramUrl.trim() : DEFAULT_SOCIAL_SETTINGS.telegramUrl,
    whatsappUrl: typeof input.whatsappUrl === 'string' && input.whatsappUrl.trim() ? input.whatsappUrl.trim() : DEFAULT_SOCIAL_SETTINGS.whatsappUrl,
    xUrl: typeof input.xUrl === 'string' && input.xUrl.trim() ? input.xUrl.trim() : DEFAULT_SOCIAL_SETTINGS.xUrl,
    tiktokUrl: typeof input.tiktokUrl === 'string' && input.tiktokUrl.trim() ? input.tiktokUrl.trim() : DEFAULT_SOCIAL_SETTINGS.tiktokUrl,
    instagramUrl: typeof input.instagramUrl === 'string' && input.instagramUrl.trim() ? input.instagramUrl.trim() : DEFAULT_SOCIAL_SETTINGS.instagramUrl,
    snapchatUrl: typeof input.snapchatUrl === 'string' && input.snapchatUrl.trim() ? input.snapchatUrl.trim() : DEFAULT_SOCIAL_SETTINGS.snapchatUrl,
  };
}

export async function getSocialSettings(): Promise<SocialSettings> {
  if (!isSupabaseConfigured || !supabase) return DEFAULT_SOCIAL_SETTINGS;
  try {
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'social').maybeSingle();
    if (error || !data) return DEFAULT_SOCIAL_SETTINGS;
    return normalizeSocialSettings(data.value);
  } catch {
    return DEFAULT_SOCIAL_SETTINGS;
  }
}
