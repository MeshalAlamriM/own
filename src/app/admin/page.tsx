'use client';

import { useState, useEffect } from 'react';
import { Job, JobSector, GenderType, JobStatus } from '@/types/job';
import { formatTelegramMessage, formatWhatsAppMessage } from '@/lib/broadcast';
import { AdSettings, DEFAULT_AD_SETTINGS } from '@/lib/ad-settings';
import {
  PlusCircle,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  Lock,
  Unlock,
  Sparkles,
  TrendingUp,
  Search,
  ExternalLink,
  RotateCcw,
  Send,
  MessageCircle,
  Copy,
  Check,
  Settings,
  Radio,
  Share2,
  Database
  ,Download
  ,RefreshCw
  ,CheckSquare
  ,Square
  ,BarChart3
  ,MousePointerClick
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<{ totalViews?: number; expiringSoon?: number; topViewed?: { id: string; slug: string; title: string; viewsCount: number }[] }>({});
  const [auditLogs, setAuditLogs] = useState<{ id: number; action: string; resource_id?: string | null; details?: Record<string, unknown>; created_at: string }[]>([]);
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState<'all' | JobSector>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | JobStatus>('all');
  const [filterCity, setFilterCity] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'views'>('newest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pageSize = 10;

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Broadcast & Publishing State
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastJob, setBroadcastJob] = useState<Job | null>(null);
  const [broadcastTab, setBroadcastTab] = useState<'telegram' | 'whatsapp'>('telegram');
  const [publishingTelegram, setPublishingTelegram] = useState(false);
  const [publishResult, setPublishResult] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [copiedType, setCopiedType] = useState<'telegram' | 'whatsapp' | null>(null);

  // Channel Settings State
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [telegramChannelId, setTelegramChannelId] = useState('');
  const [autoPublishTelegram, setAutoPublishTelegram] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [adSettings, setAdSettings] = useState<AdSettings>(DEFAULT_AD_SETTINGS);
  const [savingAdSettings, setSavingAdSettings] = useState(false);
  const [adSettingsMessage, setAdSettingsMessage] = useState('');
  const [adStatsDays, setAdStatsDays] = useState<7 | 30 | 90>(30);
  const [adStats, setAdStats] = useState<{ days: number; totals: { impressions: number; clicks: number; ctr: number }; rows: { unit: string; slotId: string; placement: string; impressions: number; clicks: number; ctr: number }[] }>({ days: 30, totals: { impressions: 0, clicks: 0, ctr: 0 }, rows: [] });

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    sector: 'corporate' as JobSector,
    sectorLabel: 'وظائف شركات كبرى',
    gender: 'both' as GenderType,
    genderLabel: 'للجنسين (رجال ونساء)',
    qualifications: 'بكالوريوس',
    location: 'الرياض',
    city: 'الرياض',
    status: 'active' as JobStatus,
    startDate: '',
    endDate: '',
    experience: 'لا يشترط خبرة سابقة',
    salary: 'رواتب وبدلات مجزية',
    summary: '',
    description: '',
    requirements: '',
    benefits: '',
    applicationUrl: 'https://',
    sourceUrl: 'https://',
    featured: false,
    urgent: false,
  });

  const [seeding, setSeeding] = useState(false);

  const loadAdSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/ads');
      const data = await res.json();
      if (data.success) setAdSettings(data.data);
    } catch {
      // Keep the safe defaults if the settings request is unavailable.
    }
  };

  const saveAdSettings = async () => {
    setSavingAdSettings(true);
    setAdSettingsMessage('');
    try {
      const res = await fetch('/api/admin/settings/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'تعذر حفظ إعدادات الإعلانات');
      setAdSettings(data.data);
      setAdSettingsMessage('تم حفظ إعدادات الإعلانات بنجاح');
      await loadAuditLogs();
    } catch (error) {
      setAdSettingsMessage(error instanceof Error ? error.message : 'تعذر حفظ الإعدادات');
    } finally {
      setSavingAdSettings(false);
    }
  };

  const loadAdStats = async (days = adStatsDays) => {
    try {
      const res = await fetch(`/api/admin/ads/stats?days=${days}`);
      const data = await res.json();
      if (data.success) setAdStats(data.data);
    } catch {
      // Statistics are informational and must not block the dashboard.
    }
  };

  const handleSeedJobs = async () => {
    try {
      setSeeding(true);
      const res = await fetch('/api/seed');
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'تمت مزامنة كافة الوظائف بنجاح!');
        loadJobs();
      } else {
        alert('حدث خطأ أثناء المزامنة: ' + (data.error || 'فشلت المزامنة'));
      }
    } catch (e: any) {
      alert('خطأ أثناء المزامنة: ' + e?.message);
    } finally {
      setSeeding(false);
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success) setAuditLogs(data.data || []);
    } catch {
      // Audit history is informational and must not block the dashboard.
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    try {
      const statsRequest = fetch('/api/stats').then(res => res.json());
      await Promise.all([
        loadJobs(),
        loadAuditLogs(),
        statsRequest.then(data => { if (data.success) setDashboardStats(data.data); }),
      ]);
      setLastUpdated(new Date());
    } finally {
      setRefreshing(false);
    }
  };

  const exportJobsCsv = () => {
    const headers = ['العنوان', 'الجهة', 'القطاع', 'المدينة', 'الحالة', 'تاريخ النشر', 'تاريخ الانتهاء', 'المشاهدات', 'رابط التقديم'];
    const rows = filtered.map(job => [job.title, job.company, job.sectorLabel, job.city, job.status, job.publishDate, job.endDate, String(job.viewsCount || 0), job.applicationUrl]);
    const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jobs-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  };

  const togglePageSelection = () => {
    const pageIds = paginatedJobs.map(job => job.id);
    const allSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id));
    setSelectedIds(current => allSelected ? current.filter(id => !pageIds.includes(id)) : Array.from(new Set([...current, ...pageIds])));
  };

  const deleteSelectedJobs = async () => {
    if (!selectedIds.length || !confirm(`سيتم حذف ${selectedIds.length} إعلان نهائيًا. هل تريد المتابعة؟`)) return;
    const results = await Promise.all(selectedIds.map(id => fetch(`/api/jobs/${id}`, { method: 'DELETE' })));
    const failed = results.filter(result => !result.ok).length;
    setSelectedIds([]);
    await refreshDashboard();
    alert(failed ? `تم حذف بعض الإعلانات، وفشل حذف ${failed}.` : 'تم حذف الإعلانات المحددة بنجاح.');
  };

  useEffect(() => {
    // Load Telegram Settings from local storage
    const savedChannel = localStorage.getItem('tg_channel_id') || '';
    setTelegramChannelId(savedChannel);
    fetch('/api/admin/session')
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          loadAdSettings();
          loadAdStats();
        }
      })
      .catch(() => setIsAuthenticated(false));
    fetch('/api/stats').then(res => res.json()).then(data => {
      if (data.success) setDashboardStats(data.data);
    }).catch(() => undefined);
    loadAuditLogs();
    loadJobs();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pin }),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'رمز الدخول غير صحيح');
      setIsAuthenticated(true);
      loadAdSettings();
      loadAdStats();
      setPin('');
      setPinError(false);
    }).catch(() => setPinError(true));
  };

  const handleLogout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tg_channel_id', telegramChannelId.trim());
    setSettingsModalOpen(false);
    alert('تم حفظ إعدادات التيليجرام بنجاح! 💾');
  };

  const openAddModal = () => {
    setEditingJob(null);
    setLogoFile(null);
    setFormData({
      title: '',
      company: '',
      companyLogo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=128&auto=format&fit=crop&q=80',
      sector: 'corporate',
      sectorLabel: 'وظائف شركات كبرى',
      gender: 'both',
      genderLabel: 'للجنسين (رجال ونساء)',
      qualifications: 'ثانوية عامة، دبلوم، بكالوريوس',
      location: 'كافة المناطق',
      city: 'الرياض',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      experience: 'حديثي التخرج وخبرات سابقة',
      salary: 'رواتب وبدلات مجزية',
      summary: '',
      description: '<p>تعلن الجهة عن فتح باب التوظيف لشغل عدد من الوظائف الشاغرة...</p>',
      requirements: 'أن يكون المتقدم سعودي الجنسية\nحسن السيرة والسلوك\nالحصول على المؤهل المطلوب',
      benefits: 'تأمين طبي شامل\nبدل سكن وبدل مواصلات\nحوافز سنوية',
      applicationUrl: 'https://',
      sourceUrl: 'https://',
      featured: false,
      urgent: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setLogoFile(null);
    setFormData({
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo || '',
      sector: job.sector,
      sectorLabel: job.sectorLabel,
      gender: job.gender,
      genderLabel: job.genderLabel,
      qualifications: job.qualifications.join('، '),
      location: job.location,
      city: job.city,
      status: job.status,
      startDate: job.startDate,
      endDate: job.endDate,
      experience: job.experience,
      salary: job.salary || '',
      summary: job.summary,
      description: job.description,
      requirements: job.requirements?.join('\n') || '',
      benefits: job.benefits?.join('\n') || '',
      applicationUrl: job.applicationUrl,
      sourceUrl: job.sourceUrl || '',
      featured: Boolean(job.featured),
      urgent: Boolean(job.urgent),
    });
    setModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const quals = formData.qualifications.split(/[,،]+/).map(q => q.trim()).filter(Boolean);
    const reqs = formData.requirements.split('\n').map(r => r.trim()).filter(Boolean);
    const bens = formData.benefits.split('\n').map(b => b.trim()).filter(Boolean);

    let sectorLabel = 'وظائف شركات كبرى';
    if (formData.sector === 'government') sectorLabel = 'وظائف حكومية';
    if (formData.sector === 'military') sectorLabel = 'وظائف عسكرية';
    if (formData.sector === 'training') sectorLabel = 'تدريب منتهي بالتوظيف';
    if (formData.sector === 'results') sectorLabel = 'نتائج القبول والترشيح';
    if (formData.sector === 'remote') sectorLabel = 'وظائف عن بُعد';

    let genderLabel = 'للجنسين (رجال ونساء)';
    if (formData.gender === 'male') genderLabel = 'رجال فقط';
    if (formData.gender === 'female') genderLabel = 'نساء فقط';

    try {
      let companyLogo = formData.companyLogo;
    if (logoFile) {
      setUploadingLogo(true);
      const uploadData = new FormData();
      uploadData.append('file', logoFile);
      const uploadRes = await fetch('/api/admin/upload-logo', { method: 'POST', body: uploadData });
      const result = await uploadRes.json().catch(() => ({}));
      setUploadingLogo(false);
      if (!uploadRes.ok || !result.success) throw new Error(result.error || 'فشل رفع الشعار');
      companyLogo = result.url;
    }
      const payload = {
      ...formData,
      companyLogo,
      sectorLabel,
      genderLabel,
      qualifications: quals,
      requirements: reqs,
      benefits: bens,
    };

      let savedJob: Job | null = null;
      if (editingJob) {
        const res = await fetch(`/api/jobs/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'فشل حفظ الإعلان في قاعدة البيانات');
        }
        savedJob = data.data;

      } else {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'فشل حفظ الإعلان في قاعدة البيانات');
        }
        savedJob = data.data;

      }

      setLogoFile(null);
      await loadJobs();
      await loadAuditLogs();
      setModalOpen(false);

      // Auto-publish to Telegram if option checked and settings present
      if (autoPublishTelegram && savedJob) {
        await executeTelegramPublish(savedJob);
      } else if (savedJob) {
        // Open broadcast modal to offer instant broadcast
        openBroadcastModal(savedJob);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الإعلان');
    }

  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الإعلان الوظيفي نهائياً؟')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل حذف الإعلان من قاعدة البيانات');
      }
      setJobs(jobs.filter(j => j.id !== id));
      await loadAuditLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف');
    }
  };

  // Broadcast Modal Trigger
  const openBroadcastModal = (job: Job) => {
    setBroadcastJob(job);
    setPublishResult({ type: 'idle', message: '' });
    setBroadcastModalOpen(true);
  };

  // Direct Telegram Dispatch
  const executeTelegramPublish = async (job: Job) => {
    setPublishingTelegram(true);
    setPublishResult({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/publish/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          siteUrl: typeof window !== 'undefined' ? window.location.origin : 'https://wadhaef-alyoum.sa',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPublishResult({
          type: 'success',
          message: 'تم نشر الإعلان بنجاح وفوراً في قناتك على التيليجرام! 🎉',
        });
      } else {
        setPublishResult({
          type: 'error',
          message: data.error || 'فشل النشر، يرجى التأكد من صلاحية البوت كمسؤول في القناة.',
        });
      }
    } catch (err: any) {
      setPublishResult({
        type: 'error',
        message: 'حدث خطأ في الاتصال بالخادم.',
      });
    } finally {
      setPublishingTelegram(false);
    }
  };

  // WhatsApp 1-Click Share
  const openWhatsAppBroadcast = (job: Job) => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wadhaef-alyoum.sa';
    const text = formatWhatsAppMessage(job, siteUrl);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Copy Formatted Text
  const copyFormatted = async (text: string, type: 'telegram' | 'whatsapp') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200/80 shadow-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">لوحة التحكم الإدارية</h1>
            <p className="text-xs text-gray-500 mt-1">أدخل رمز الدخول السريع لإدارة الإعلانات الوظيفية وقنوات النشر</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="أدخل كلمة مرور الإدارة"
              className="w-full text-center text-lg font-bold tracking-widest py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {pinError && <p className="text-xs text-rose-600 font-semibold">رمز الدخول غير صحيح أو لم يتم إعداد كلمة مرور الإدارة.</p>}
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-xs"
            >
              دخول لوحة التحكم
            </button>
          </form>

          <p className="text-[11px] text-gray-400">يتم تحديد كلمة المرور من متغير <code>ADMIN_PASSWORD</code> في إعدادات الخادم.</p>
        </div>
      </div>
    );
  }

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase().trim();
    return (!q || [j.title, j.company, j.city, j.summary].some(v => v.toLowerCase().includes(q))) &&
      (filterSector === 'all' || j.sector === filterSector) &&
      (filterStatus === 'all' || j.status === filterStatus) &&
      (!filterCity || j.city.toLowerCase().includes(filterCity.toLowerCase()));
  }).sort((a, b) => sortBy === 'views'
    ? (b.viewsCount || 0) - (a.viewsCount || 0)
    : new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedJobs = filtered.slice((page - 1) * pageSize, page * pageSize);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://wadhaef-alyoum.sa';

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
              <span>لوحة التحكم الإدارية والنشر الآلي</span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">مدير النظام</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              إدارة الإعلانات، والنشر الفوري بنقرة واحدة في قنوات التيليجرام والواتساب بتنسيق احترافي
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 hover:border-emerald-400 text-gray-700 rounded-xl text-xs font-bold shadow-2xs transition disabled:opacity-60"
              title="تحديث بيانات لوحة التحكم"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'جاري التحديث' : 'تحديث'}</span>
            </button>
            <button
              onClick={exportJobsCsv}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 hover:border-violet-400 text-gray-700 rounded-xl text-xs font-bold shadow-2xs transition"
              title="تصدير النتائج الحالية إلى CSV"
            >
              <Download className="w-4 h-4 text-violet-600" />
              <span>تصدير CSV</span>
            </button>
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-sky-400 text-gray-700 rounded-xl text-xs font-bold shadow-2xs hover:bg-sky-50 transition"
              title="إعدادات بوت التيليجرام"
            >
              <Settings className="w-4 h-4 text-sky-600" />
              <span>إعدادات قنوات النشر</span>
            </button>

            <button
              onClick={handleSeedJobs}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold shadow-2xs transition disabled:opacity-50"
              title="مزامنة الوظائف التأسيسية لكافة الأقسام إلى قاعدة البيانات السحابية"
            >
              <Database className="w-4 h-4 text-indigo-600" />
              <span>{seeding ? 'جاري المزامنة...' : 'مزامنة أقسام الوظائف'}</span>
            </button>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة إعلان جديد</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs font-bold transition"
              title="تسجيل الخروج"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telegram Auto-Publish Status Badge Banner */}
        <div className="bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <strong className="text-gray-900 block text-sm">ميزة النشر الآلي عبر البوت مفعلة:</strong>
              <span className="text-gray-600">
                {telegramChannelId ? (
                  <>القناة المتصلة حالياً: <strong className="text-sky-700 dir-ltr">{telegramChannelId}</strong></>
                ) : (
                  <span className="text-amber-700 font-bold">لم يتم ربط القناة بعد. انقر على «إعدادات قنوات النشر» لإدخال التوكن واسم القناة.</span>
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSettingsModalOpen(true)}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 underline shrink-0"
          >
            تعديل بيانات القناة والبوت ←
          </button>
        </div>

        {/* Ads Control Center */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-gray-900">إدارة الإعلانات</h2>
                <p className="text-xs text-gray-500 mt-0.5">تحكم بظهور إعلانات AdSense من دون تعديل الكود</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-bold ${adSettings.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
              <span className={`w-2 h-2 rounded-full ${adSettings.enabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {adSettings.enabled ? 'الإعلانات مفعلة' : 'الإعلانات متوقفة'}
            </span>
          </div>
          <div className="p-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3 cursor-pointer">
                <span><strong className="block text-sm text-gray-800">تفعيل الإعلانات</strong><span className="text-[11px] text-gray-500">إظهار أو إخفاء جميع الوحدات الإعلانية</span></span>
                <input type="checkbox" checked={adSettings.enabled} onChange={e => setAdSettings({ ...adSettings, enabled: e.target.checked })} className="h-5 w-5 accent-emerald-600" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-gray-200 p-3 cursor-pointer text-xs font-bold text-gray-700">
                  <input type="checkbox" checked={adSettings.showOnHome} onChange={e => setAdSettings({ ...adSettings, showOnHome: e.target.checked })} className="h-4 w-4 accent-emerald-600" />
                  الرئيسية
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-gray-200 p-3 cursor-pointer text-xs font-bold text-gray-700">
                  <input type="checkbox" checked={adSettings.showOnJobDetail} onChange={e => setAdSettings({ ...adSettings, showOnJobDetail: e.target.checked })} className="h-4 w-4 accent-emerald-600" />
                  تفاصيل الوظيفة
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700">رقم الوحدة الإعلانية (Ad Slot)
                <input value={adSettings.slotId} onChange={e => setAdSettings({ ...adSettings, slotId: e.target.value })} placeholder="مثال: 1234567890" className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-gray-700">نوع العرض
                  <select value={adSettings.format} onChange={e => setAdSettings({ ...adSettings, format: e.target.value as AdSettings['format'] })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs">
                    <option value="auto">متجاوب تلقائيًا</option><option value="fluid">Fluid</option><option value="rectangle">مستطيل</option>
                  </select>
                </label>
                <label className="block text-xs font-bold text-gray-700">النص فوق الإعلان
                  <input value={adSettings.label} onChange={e => setAdSettings({ ...adSettings, label: e.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs" />
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-3">
            <p className={`text-xs font-bold ${adSettingsMessage.includes('بنجاح') ? 'text-emerald-700' : 'text-gray-500'}`}>{adSettingsMessage || 'يتطلب ظهور الإعلانات الفعلية ضبط NEXT_PUBLIC_ADSENSE_ID في Vercel.'}</p>
            <button onClick={saveAdSettings} disabled={savingAdSettings} className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-60">{savingAdSettings ? 'جاري الحفظ...' : 'حفظ إعدادات الإعلانات'}</button>
          </div>
        </section>

        {/* Ad Analytics */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
              <div><h2 className="font-black text-gray-900">إحصائيات الوحدات الإعلانية</h2><p className="text-xs text-gray-500 mt-0.5">ظهور ونقرات كل وحدة خلال الفترة المحددة</p></div>
            </div>
            <div className="flex items-center gap-2">
              <select value={adStatsDays} onChange={e => { const days = Number(e.target.value) as 7 | 30 | 90; setAdStatsDays(days); loadAdStats(days); }} className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs font-bold">
                <option value={7}>آخر 7 أيام</option><option value={30}>آخر 30 يومًا</option><option value={90}>آخر 90 يومًا</option>
              </select>
              <button onClick={() => loadAdStats()} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"><RefreshCw className="w-3.5 h-3.5" /> تحديث</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5">
            <div className="rounded-xl bg-sky-50 p-4"><span className="text-xs text-sky-700 font-bold">مرات الظهور</span><strong className="block mt-1 text-2xl font-black text-sky-900">{adStats.totals.impressions.toLocaleString('ar-SA')}</strong></div>
            <div className="rounded-xl bg-violet-50 p-4"><span className="text-xs text-violet-700 font-bold inline-flex items-center gap-1"><MousePointerClick className="w-3.5 h-3.5" /> النقرات الملتقطة</span><strong className="block mt-1 text-2xl font-black text-violet-900">{adStats.totals.clicks.toLocaleString('ar-SA')}</strong></div>
            <div className="rounded-xl bg-emerald-50 p-4"><span className="text-xs text-emerald-700 font-bold">معدل التفاعل CTR</span><strong className="block mt-1 text-2xl font-black text-emerald-900">{adStats.totals.ctr.toFixed(2)}%</strong></div>
          </div>
          {adStats.rows.length > 0 ? (
            <div className="overflow-x-auto px-5 pb-5"><table className="w-full min-w-[620px] text-right text-xs"><thead className="bg-gray-50 text-gray-600"><tr><th className="p-3">الوحدة / الموضع</th><th className="p-3">الظهور</th><th className="p-3">النقرات</th><th className="p-3">CTR</th></tr></thead><tbody className="divide-y divide-gray-100">{adStats.rows.map(row => <tr key={row.unit}><td className="p-3 font-bold text-gray-800"><span className="block font-mono text-[11px]">{row.slotId}</span><span className="text-gray-500">{row.placement === 'home' ? 'الرئيسية' : 'تفاصيل الوظيفة'}</span></td><td className="p-3 font-bold text-sky-700">{row.impressions.toLocaleString('ar-SA')}</td><td className="p-3 font-bold text-violet-700">{row.clicks.toLocaleString('ar-SA')}</td><td className="p-3 font-bold text-emerald-700">{row.ctr.toFixed(2)}%</td></tr>)}</tbody></table></div>
          ) : <p className="px-5 pb-5 text-xs text-gray-500">لا توجد بيانات لهذه الفترة. ستظهر الإحصائيات بعد تشغيل الإعلانات وزيارة مواضعها.</p>}
          <p className="border-t border-gray-100 bg-amber-50 px-5 py-3 text-[11px] leading-5 text-amber-800">ملاحظة: الظهور والنقرات هنا قياسات داخلية للتشخيص. نقرات AdSense الفعلية قد لا تصل للصفحة بسبب iframe وسياسات Google، ويظل تقرير AdSense هو المرجع النهائي للأرباح والنقرات المدفوعة.</p>
        </section>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 block mb-1">إجمالي الإعلانات</span>
            <span className="text-2xl font-black text-gray-900">{jobs.length}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 block mb-1">الإعلانات النشطة</span>
            <span className="text-2xl font-black text-emerald-600">
              {jobs.filter(j => j.status === 'active' || j.status === 'expiring_soon').length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 block mb-1">إعلانات النتائج</span>
            <span className="text-2xl font-black text-rose-600">
              {jobs.filter(j => j.sector === 'results').length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 block mb-1">إجمالي المشاهدات</span>
            <span className="text-2xl font-black text-sky-600">
              {jobs.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs"><span className="text-xs text-gray-500 block mb-1">تنتهي خلال 7 أيام</span><span className="text-2xl font-black text-amber-600">{dashboardStats.expiringSoon ?? 0}</span></div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs"><span className="text-xs text-gray-500 block mb-1">المشاهدات السحابية</span><span className="text-2xl font-black text-violet-600">{(dashboardStats.totalViews ?? 0).toLocaleString()}</span></div>
        </div>
        {dashboardStats.topViewed && dashboardStats.topViewed.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
            <h3 className="font-black text-gray-900 mb-3">الأكثر مشاهدة</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {dashboardStats.topViewed.map((job) => <a key={job.id} href={`/jobs/${job.slug}`} target="_blank" rel="noreferrer" className="rounded-xl bg-slate-50 p-3 text-xs hover:bg-emerald-50"><span className="block truncate font-bold">{job.title}</span><span className="text-sky-600">{job.viewsCount.toLocaleString()} مشاهدة</span></a>)}
            </div>
          </div>
        )}
        {auditLogs.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-gray-900">آخر العمليات الإدارية</h3>
              <span className="text-[11px] text-gray-500">آخر 30 عملية</span>
            </div>
            <div className="divide-y divide-gray-100">
              {auditLogs.slice(0, 8).map((log) => {
                const labels: Record<string, string> = { create_job: 'إضافة وظيفة', update_job: 'تعديل وظيفة', delete_job: 'حذف وظيفة', upload_logo: 'رفع شعار', publish_telegram: 'نشر في Telegram', seed_jobs: 'مزامنة وظائف' };
                return <div key={log.id} className="flex items-center justify-between gap-3 py-2 text-xs"><span className="font-bold text-gray-700">{labels[log.action] || log.action}</span><span className="text-gray-400">{new Date(log.created_at).toLocaleString('ar-SA')}</span></div>;
              })}
            </div>
          </div>
        )}

        {/* Search & Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="ابحث في الإعلانات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select value={filterSector} onChange={(e) => { setFilterSector(e.target.value as 'all' | JobSector); setPage(1); }} className="px-2 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg">
              <option value="all">كل القطاعات</option><option value="government">حكومية</option><option value="military">عسكرية</option><option value="corporate">شركات</option><option value="training">تدريب</option><option value="results">نتائج</option><option value="remote">عن بُعد</option>
            </select>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value as 'all' | JobStatus); setPage(1); }} className="px-2 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg">
              <option value="all">كل الحالات</option><option value="active">متاحة</option><option value="expiring_soon">تنتهي قريبًا</option><option value="upcoming">قادمة</option><option value="results">نتائج</option><option value="expired">منتهية</option>
            </select>
            <input value={filterCity} onChange={(e) => { setFilterCity(e.target.value); setPage(1); }} placeholder="المدينة" className="w-20 px-2 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'newest' | 'views')} className="px-2 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg">
              <option value="newest">الأحدث</option><option value="views">الأكثر مشاهدة</option>
            </select>
            <span className="text-xs text-gray-500 font-medium">{filtered.length} إعلان</span>
          </div>
          {selectedIds.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 bg-amber-50 px-4 py-3 text-xs">
              <span className="font-bold text-amber-900">تم تحديد {selectedIds.length} إعلان</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedIds([])} className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 font-bold text-gray-700">إلغاء التحديد</button>
                <button onClick={deleteSelectedJobs} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 font-bold text-white hover:bg-rose-700"><Trash2 className="w-3.5 h-3.5" /> حذف المحدد</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <button onClick={togglePageSelection} title="تحديد وظائف الصفحة" className="text-gray-500 hover:text-emerald-600">
                      {paginatedJobs.length > 0 && paginatedJobs.every(job => selectedIds.includes(job.id)) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">الإعلان الوظيفي</th>
                  <th className="py-3.5 px-4">الجهة</th>
                  <th className="py-3.5 px-4">القطاع</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4 text-center">النشر في القنوات</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleSelection(job.id)} title="تحديد الإعلان" className="text-gray-400 hover:text-emerald-600">
                        {selectedIds.includes(job.id) ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 max-w-xs truncate">
                      <a href={`/jobs/${job.slug}`} target="_blank" className="hover:text-emerald-700 flex items-center gap-1.5">
                        <span>{job.title}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{job.company}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700">
                        {job.sectorLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${job.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        job.status === 'results' ? 'bg-rose-100 text-rose-800' :
                          job.status === 'expiring_soon' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {job.status === 'active' ? 'متاح' : job.status === 'results' ? 'نتائج' : job.status === 'expiring_soon' ? 'ينتهي قريباً' : job.status}
                      </span>
                    </td>

                    {/* Broadcast Action Cell */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openBroadcastModal(job)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-emerald-600 hover:from-sky-600 hover:to-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-2xs hover:scale-105 active:scale-95"
                        title="نشر الإعلان في قنوات التيليجرام والواتساب بتنسيق احترافي"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>نشر بالقنوات</span>
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(job)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 p-3 text-xs">
            <span className="text-gray-500">صفحة {page} من {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">السابق</button>
              <button disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">التالي</button>
            </div>
          </div>
        </div>

        {/* Modal 1: Broadcast & Publish Preview Modal */}
        {broadcastModalOpen && broadcastJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900">
                      نشر الإعلان في قنوات التيليجرام والواتساب
                    </h3>
                    <p className="text-xs text-gray-500">معاينة التنسيق الجاهز للنشر المباشر</p>
                  </div>
                </div>

                <button
                  onClick={() => setBroadcastModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Channel Selector Tabs */}
              <div className="flex items-center gap-2 border-b border-gray-200">
                <button
                  onClick={() => setBroadcastTab('telegram')}
                  className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition ${broadcastTab === 'telegram'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                >
                  <Send className="w-4 h-4 text-sky-500" />
                  <span>تنسيق قناة التيليجرام</span>
                </button>

                <button
                  onClick={() => setBroadcastTab('whatsapp')}
                  className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition ${broadcastTab === 'whatsapp'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>تنسيق قناة ومجموعات الواتساب</span>
                </button>
              </div>

              {/* Status alerts */}
              {publishResult.type === 'success' && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{publishResult.message}</span>
                </div>
              )}

              {publishResult.type === 'error' && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{publishResult.message}</span>
                </div>
              )}

              {/* Message Box Preview */}
              <div className="relative">
                <div className="text-[11px] font-bold text-gray-500 mb-1.5 flex items-center justify-between">
                  <span>معاينة المنشور قبل الإرسال:</span>
                  <span className="text-gray-400">جاهز ومخصص بمؤثرات ورموز تعبيرية</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto border border-slate-800 selection:bg-emerald-500 selection:text-white">
                  {broadcastTab === 'telegram'
                    ? formatTelegramMessage(broadcastJob, currentOrigin)
                    : formatWhatsAppMessage(broadcastJob, currentOrigin)}
                </div>
              </div>

              {/* Actions Grid */}
              <div className="pt-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Action 1: Telegram Publish via Bot */}
                  <button
                    onClick={() => executeTelegramPublish(broadcastJob)}
                    disabled={publishingTelegram}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-xs transition hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {publishingTelegram
                        ? 'جاري النشر في القناة...'
                        : 'نشر فوري في قناة التيليجرام'}
                    </span>
                  </button>

                  {/* Action 2: WhatsApp 1-Click Broadcast */}
                  <button
                    onClick={() => openWhatsAppBroadcast(broadcastJob)}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition hover:scale-[1.01]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>إرسال عبر الواتساب (قنوات ومجموعات)</span>
                  </button>
                </div>

                {/* Action 3: Copy Formatted text button */}
                <button
                  onClick={() =>
                    copyFormatted(
                      broadcastTab === 'telegram'
                        ? formatTelegramMessage(broadcastJob, currentOrigin)
                        : formatWhatsAppMessage(broadcastJob, currentOrigin),
                      broadcastTab
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
                >
                  {copiedType === broadcastTab ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">تم نسخ المنشور بنجاح إلى الحافظة!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ النص المنسق لنشره في أي منصة يدوياً</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bot Guide Callout */}
              <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 text-[11px] text-sky-900 space-y-1">
                <strong>💡 كيف يعمل النشر المباشر؟</strong>
                <p className="text-sky-800 leading-relaxed">
                  يقوم الموقع بإرسال المنشور إلى قناتك فوراً عبر Telegram Bot API مع كافة التنسيقات والروابط، كما يفتح لك تطبيق واتساب لإرسال الإعلان إلى قناتك أو مجموعاتك بنقرة واحدة.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Settings for Telegram Bot & Channel */}
        {settingsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">إعدادات النشر على التيليجرام</h3>
                    <p className="text-xs text-gray-500">اربط قناتك بالبوت للنشر التلقائي والمباشر</p>
                  </div>
                </div>

                <button
                  onClick={() => setSettingsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={saveSettings} className="space-y-4 text-xs">
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[10px] text-amber-800">
                  لأمان الموقع، يتم حفظ توكن البوت في متغير <code>TELEGRAM_BOT_TOKEN</code> على Vercel فقط، ولا يتم تخزينه في المتصفح.
                  احصل عليه من <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="font-bold underline">@BotFather</a>.
                </div>

                {/* Channel ID */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    معرف القناة (Channel ID / Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={telegramChannelId}
                    onChange={(e) => setTelegramChannelId(e.target.value)}
                    placeholder="مثال: @my_job_channel أو -100123456789"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white dir-ltr text-right"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    تأكد من إضافة البوت كـ <strong>مسؤول (Admin)</strong> في قناتك مع صلاحية نشر الرسائل (Post Messages).
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSettingsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    حفظ الإعدادات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Add / Edit Job Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-gray-900">
                  {editingJob ? 'تعديل الإعلان الوظيفي' : 'إضافة إعلان وظيفي جديد'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">عنوان الإعلان الوظيفي *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: شركة أرامكو تعلن فتح باب التسجيل في..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">جهة العمل / الشركة / الوزارة *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="مثال: وزارة الحرس الوطني"
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                  </div>

                  {/* Logo URL / Upload */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">رابط الشعار أو رفعه</label>
                    <input
                      type="text"
                      value={formData.companyLogo}
                      onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                    <label className="mt-2 flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-2.5 text-[11px] font-bold text-emerald-700">
                      <span>{logoFile ? `تم اختيار: ${logoFile.name}` : 'أو ارفع شعارًا (حتى 2MB)'}</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                      <span className="rounded-lg bg-emerald-600 px-2 py-1 text-white">اختيار</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Sector */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">القطاع</label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value as JobSector })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    >
                      <option value="government">وظائف حكومية</option>
                      <option value="military">وظائف عسكرية</option>
                      <option value="corporate">وظائف شركات كبرى</option>
                      <option value="training">تدريب منتهي بالتوظيف</option>
                      <option value="results">نتائج القبول والترشيح</option>
                      <option value="remote">وظائف عن بُعد</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">الجنس</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    >
                      <option value="both">للجنسين (رجال ونساء)</option>
                      <option value="male">رجال فقط</option>
                      <option value="female">نساء فقط</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">حالة التقديم</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    >
                      <option value="active">متاح الآن للتقديم</option>
                      <option value="expiring_soon">ينتهي قريباً (عاجل)</option>
                      <option value="upcoming">يبدأ قريباً</option>
                      <option value="results">أعلنت نتائج القبول</option>
                      <option value="expired">منتهي التقديم</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">المدينة / المقر</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="الرياض، جدة، كافة المناطق..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">تاريخ بداية التقديم</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">تاريخ نهاية التقديم</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">المؤهلات المطلوبة (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="ثانوية عامة، دبلوم، بكالوريوس"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">رابط التقديم المباشر *</label>
                    <input
                      type="url"
                      required
                      value={formData.applicationUrl}
                      onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">رابط المصدر الرسمي</label>
                    <input
                      type="url"
                      value={formData.sourceUrl}
                      onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">نبذة سريعة (للبطاقة ومحركات البحث SEO)</label>
                  <textarea
                    rows={2}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="موجز جذاب في جملتين..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">تفاصيل الإعلان والشواغر</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الشروط والمتطلبات (كل شرط في سطر مستقل)</label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                {/* Checkboxes & Auto-publish option */}
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>إعلان مميز (يظهر في أعلى الصفحة)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-700">
                      <input
                        type="checkbox"
                        checked={formData.urgent}
                        onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                        className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span>إعلان عاجل (ينتهي قريباً)</span>
                    </label>
                  </div>

                  {/* Auto publish on Telegram checkbox */}
                  <div className="bg-sky-50 p-3 rounded-xl border border-sky-200">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-sky-950">
                      <input
                        type="checkbox"
                        checked={autoPublishTelegram}
                        onChange={(e) => setAutoPublishTelegram(e.target.checked)}
                        className="w-4 h-4 text-sky-600 rounded"
                      />
                      <span className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-sky-600" />
                        نشر الإعلان تلقائياً في قناة التيليجرام فور النقر على حفظ
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    {editingJob ? 'حفظ التعديلات' : 'نشر الإعلان الآن'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
