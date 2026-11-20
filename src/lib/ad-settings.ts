import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type AdPlacement =
  | 'home-top'
  | 'home-infeed'
  | 'home-bottom'
  | 'job-detail-top'
  | 'job-detail-content'
  | 'job-detail-before-apply'
  | 'job-detail-bottom'
  | 'sector-top'
  | 'sector-infeed'
  | 'sidebar-sticky'
  // Legacy compatibility:
  | 'home'
  | 'job-detail';

export type AdFormat = 'auto' | 'fluid' | 'rectangle';

export interface AdSettings {
  enabled: boolean;
  slotId: string;
  format: AdFormat;
  label: string;

  // Placements across the site (100% Google AdSense Compliant):
  homeTop: boolean;
  homeInFeed: boolean;
  homeBottom: boolean;
  jobDetailTop: boolean;
  jobDetailInArticle: boolean;
  jobDetailBeforeApply: boolean;
  jobDetailBottom: boolean;
  sectorPagesTop: boolean;
  sectorPagesInFeed: boolean;
  sidebarSticky: boolean;

  // Legacy compatibility
  showOnHome?: boolean;
  showOnJobDetail?: boolean;
}

export const DEFAULT_AD_SETTINGS: AdSettings = {
  enabled: true,
  slotId: '1234567890',
  format: 'auto',
  label: 'إعلان تجاري مدعوم',

  homeTop: true,
  homeInFeed: true,
  homeBottom: true,
  jobDetailTop: true,
  jobDetailInArticle: true,
  jobDetailBeforeApply: true,
  jobDetailBottom: true,
  sectorPagesTop: true,
  sectorPagesInFeed: true,
  sidebarSticky: true,

  showOnHome: true,
  showOnJobDetail: true,
};

function normalize(value: unknown): AdSettings {
  const input = (value && typeof value === 'object' ? value : {}) as Partial<AdSettings>;
  const enabled = input.enabled !== false;
  const legacyHome = input.showOnHome !== false;
  const legacyJob = input.showOnJobDetail !== false;

  return {
    enabled,
    slotId: typeof input.slotId === 'string' && input.slotId.trim() ? input.slotId.trim() : DEFAULT_AD_SETTINGS.slotId,
    format: input.format === 'fluid' || input.format === 'rectangle' ? input.format : 'auto',
    label: typeof input.label === 'string' && input.label.trim() ? input.label.trim().slice(0, 80) : DEFAULT_AD_SETTINGS.label,

    homeTop: input.homeTop !== undefined ? Boolean(input.homeTop) : legacyHome,
    homeInFeed: input.homeInFeed !== undefined ? Boolean(input.homeInFeed) : legacyHome,
    homeBottom: input.homeBottom !== undefined ? Boolean(input.homeBottom) : legacyHome,

    jobDetailTop: input.jobDetailTop !== undefined ? Boolean(input.jobDetailTop) : legacyJob,
    jobDetailInArticle: input.jobDetailInArticle !== undefined ? Boolean(input.jobDetailInArticle) : legacyJob,
    jobDetailBeforeApply: input.jobDetailBeforeApply !== undefined ? Boolean(input.jobDetailBeforeApply) : legacyJob,
    jobDetailBottom: input.jobDetailBottom !== undefined ? Boolean(input.jobDetailBottom) : legacyJob,

    sectorPagesTop: input.sectorPagesTop !== undefined ? Boolean(input.sectorPagesTop) : true,
    sectorPagesInFeed: input.sectorPagesInFeed !== undefined ? Boolean(input.sectorPagesInFeed) : true,
    sidebarSticky: input.sidebarSticky !== undefined ? Boolean(input.sidebarSticky) : true,

    showOnHome: legacyHome,
    showOnJobDetail: legacyJob,
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
