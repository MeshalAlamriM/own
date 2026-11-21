import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type AuditAction = 'create_job' | 'update_job' | 'delete_job' | 'upload_logo' | 'publish_telegram' | 'seed_jobs' | 'update_settings' | 'update_contact_message';

export async function recordAuditLog(action: AuditAction, resourceId?: string, details: Record<string, unknown> = {}) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('admin_audit_logs').insert({
      action,
      resource_id: resourceId || null,
      details,
    });
    if (error) console.warn('Audit log insert failed:', error.message);
  } catch (error) {
    console.warn('Audit log request failed:', error);
  }
}
