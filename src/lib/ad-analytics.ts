export type AdEventType = 'impression' | 'click';
export type AdEventPlacement = 'home' | 'job-detail';

export interface AdStatsRow {
  unit: string;
  slotId: string;
  placement: AdEventPlacement;
  impressions: number;
  clicks: number;
  ctr: number;
}

export function isValidAdEvent(value: unknown): value is { eventType: AdEventType; placement: AdEventPlacement; slotId: string; pagePath?: string } {
  if (!value || typeof value !== 'object') return false;
  const input = value as Record<string, unknown>;
  return (input.eventType === 'impression' || input.eventType === 'click')
    && (input.placement === 'home' || input.placement === 'job-detail')
    && typeof input.slotId === 'string'
    && /^[a-zA-Z0-9_-]{3,80}$/.test(input.slotId);
}
