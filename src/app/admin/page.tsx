'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Job, JobSector, GenderType, JobStatus } from '@/types/job';
import {
  BUILTIN_BROADCAST_TEMPLATES,
  BroadcastTemplate,
  renderTemplate,
} from '@/lib/broadcast';
import { AdSettings, DEFAULT_AD_SETTINGS } from '@/lib/ad-settings';
import { DEFAULT_SOCIAL_SETTINGS, SocialSettings } from '@/lib/social-settings';
import {
  DEFAULT_HOME_STATS_SETTINGS,
  HomeStatsSettings,
} from '@/lib/home-stats-settings';
import {
  PlusCircle,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Sparkles,
  Search,
  ExternalLink,
  RotateCcw,
  Send,
  MessageCircle,
  Copy,
  Check,
  Settings,
  Radio,
  Database,
  Download,
  RefreshCw,
  CheckSquare,
  Square,
  BarChart3,
  MousePointerClick,
  Tag,
  FileText,
  Sliders,
  ShieldCheck,
  Share2,
  Globe,
} from 'lucide-react';

// Quick template presets for rapid job creation
const JOB_TEMPLATES = {
  government: {
    sector: 'government' as JobSector,
    sectorLabel: 'وظائف حكومية',
    gender: 'both' as GenderType,
    genderLabel: 'للجنسين (رجال ونساء)',
    qualifications: 'ثانوية عامة، دبلوم، بكالوريوس',
    salary: 'سلّم رواتب الخدمة المدنية + بدلات',
    experience: 'لا يشترط خبرة سابقة',
    summary: 'تعلن الجهة الحكومية عن توفر وظائف شاغرة للكوادر الوطنية بمختلف التخصصات.',
    description: '<p>تعلن الجهة عن فتح باب القبول والتسجيل لشغل عدد من الوظائف الإدارية والفنية الشاغرة لحملة مختلف المؤهلات، وفقاً للضوابط والشروط الموضحة.</p>',
    requirements: 'أن يكون المتقدم سعودي الجنسية\nحسن السيرة والسلوك وغير محكوم بحد شرعي\nمعادلة الشهادة إن كانت من خارج المملكة\nاجتياز المقابلة واختبارات القبول',
    benefits: 'رواتب مجزية وفق سلم الرواتب الحكومي\nتأمين طبي وبدلات شهرية\nفرص تدريب وتطوير مهني مستمر',
    tags: ['وظائف_حكومية', 'الخدمة_المدنية', 'للجنسين', 'كافة_المناطق'],
  },
  military: {
    sector: 'military' as JobSector,
    sectorLabel: 'وظائف عسكرية',
    gender: 'both' as GenderType,
    genderLabel: 'للجنسين (رجال ونساء)',
    qualifications: 'ثانوية عامة، دبلوم، بكالوريوس',
    salary: 'رواتب مجزية + علاوات وبدلات عسكرية',
    experience: 'لا يشترط خبرة',
    summary: 'فتح باب القبول والتسجيل للالتحاق بالخدمة العسكرية على رتب مختلفة للرجال والنساء.',
    description: '<p>تعلن الإدارة العامة للقبول المركزي عن فتح باب القبول والتسجيل للتعيين على رتب مختلفة للالتحاق بالقطاع العسكري بمختلف مناطق المملكة.</p>',
    requirements: 'أن يكون المتقدم سعودي الأصل والمنشأ\nألا يقل العمر عن 18 عاماً\nتناسب الطول مع الوزن وفق اللائحة الطبية\nاجتياز الفحص الطبي والمقابلة الشخصية',
    benefits: 'علاوات وبدلات عسكرية مميزة\nتأمين طبي شامل بمستشفيات قوى الأمن\nسكن أو بدل سكن مجزي',
    tags: ['وظائف_عسكرية', 'تجنيد_موحد', 'أبشر_توظيف', 'رتب_عسكرية'],
  },
  corporate: {
    sector: 'corporate' as JobSector,
    sectorLabel: 'وظائف شركات كبرى',
    gender: 'both' as GenderType,
    genderLabel: 'للجنسين (رجال ونساء)',
    qualifications: 'دبلوم، بكالوريوس، ماجستير',
    salary: 'رواتب تنافسية وبونص سنوي',
    experience: 'حديثي التخرج وخبرات سابقة',
    summary: 'إعلان توظيف لشغل فرص وظيفية واعدة برواتب ومزايا تنافسية لدى كبرى الشركات.',
    description: '<p>تعلن الشركة عن توفر شواغر وظيفية في مختلف التخصصات الإدارية، التقنية، والهندسية للعمل بمقر الشركة الرئيسي وفروعها.</p>',
    requirements: 'إجادة اللغة الإنجليزية تحدثاً وكتابة\nإتقان استخدام برامج الحاسب الآلي\nمهارات عالية في التواصل والعمل الجماعي',
    benefits: 'تأمين طبي VIP يشمل العائلة\nبدل سكن وبدل مواصلات شهري\nمكافأة سنوية بناءً على الأداء وفرص ترقية',
    tags: ['شركات_كبرى', 'وظائف_الرياض', 'حديثي_التخرج', 'رواتب_مجزية'],
  },
  training: {
    sector: 'training' as JobSector,
    sectorLabel: 'تدريب منتهي بالتوظيف',
    gender: 'both' as GenderType,
    genderLabel: 'للجنسين (رجال ونساء)',
    qualifications: 'ثانوية عامة، دبلوم، بكالوريوس',
    salary: 'مكافأة شهرية أثناء التدريب + راتب كامل بعد التخرج',
    experience: 'لا يشترط خبرة (للخريجين الجدد)',
    summary: 'برنامج تدريب مبتدئ بالتوظيف يقدم مكافأة شهرية وتأميناً طبياً وتعييناً مباشراً بعد الاجتياز.',
    description: '<p>يسر الجهة فتح باب التسجيل في البرنامج التدريبي المؤهل للتوظيف المباشر لدى كبرى الجهات الشريكة، مع تقديم تدريب عملي ونظري مكثف.</p>',
    requirements: 'الحصول على المؤهل المطلوب بمعدل لا يقل عن جيد\nألا يتجاوز العمر 26 عاماً\nالتفرغ التام طوال فترة البرنامج التدريبي',
    benefits: 'مكافأة شهرية مجزية خلال فترة التدريب\nتأمين طبي معتمد للمتدرب\nشهادة معتمدة وتعيين فوري بعد اجتياز التدريب',
    tags: ['تدريب_منتهي_بالتوظيف', 'مكافأة_شهرية', 'خريجي_الثانوية', 'تطوير_مهني'],
  },
  results: {
    sector: 'results' as JobSector,
    sectorLabel: 'نتائج القبول والترشيح',
    gender: 'both' as GenderType,
    genderLabel: 'للجنسين (رجال ونساء)',
    qualifications: 'كافة المؤهلات',
    salary: 'حسب السلم المعتمد للوظيفة',
    experience: 'حسب إعلان التقديم',
    summary: 'إعلان نتائج القبول والترشيح المبدئي/النهائي ومواعيد المطابقة واستكمال الإجراءات.',
    description: '<p>تعلن الجهة عن صدور نتائج القبول المبدئي للمتقدمين والمتقدمات، وتدعو المرشحين لمراجعة البوابة والاستعلام بالهوية الوطنية لمعرفة موعد المطابقة والمستندات المطلوبة.</p>',
    requirements: 'إحضار أصل الهوية الوطنية سارية المفعول\nأصل المؤهل الدراسي والوثائق الرسمية\nالالتزام بالموعد والمقر المحدد للمطابقة',
    benefits: 'استكمال إجراءات التعيين والمباشرة الرسمية فور إنهاء المطابقة والفحص الطبي',
    tags: ['نتائج_القبول', 'القبول_المبدئي', 'أسماء_المرشحين', 'استعلام_بالهوية'],
  },
};

// Popular logo presets for Saudi entities
const PRESET_LOGOS = [
  { name: 'أرامكو', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=128&auto=format&fit=crop&q=80' },
  { name: 'وزارة الدفاع', url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=128&auto=format&fit=crop&q=80' },
  { name: 'الحرس الوطني', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=128&auto=format&fit=crop&q=80' },
  { name: 'نيوم NEOM', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80' },
  { name: 'سابك SABIC', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80' },
  { name: 'وزارة الصحة', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=128&auto=format&fit=crop&q=80' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'jobs' | 'analytics' | 'broadcast' | 'ads' | 'social' | 'messages' | 'maintenance'>('jobs');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [dashboardStats, setDashboardStats] = useState<{
    total?: number;
    active?: number;
    totalViews?: number;
    expiringSoon?: number;
    bySector?: Record<string, number>;
    topViewed?: { id: string; slug: string; title: string; viewsCount: number }[];
  }>({});
  const [auditLogs, setAuditLogs] = useState<{ id: number; action: string; resource_id?: string | null; details?: Record<string, unknown>; created_at: string }[]>([]);
  const [contactMessages, setContactMessages] = useState<Array<{
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    category: 'inquiry' | 'report';
    job_url: string | null;
    status: 'new' | 'in_progress' | 'resolved';
    created_at: string;
  }>>([]);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState<'all' | JobSector>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | JobStatus>('all');
  const [filterCity, setFilterCity] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'views'>('newest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const pageSize = 10;

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [duplicatingJob, setDuplicatingJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoAssetName, setLogoAssetName] = useState('');
  const [logoLibrary, setLogoLibrary] = useState<Array<{ name: string; url: string; path?: string }>>([]);
  const [logoLibrarySearch, setLogoLibrarySearch] = useState('');

  // Tags input state
  const [tagInput, setTagInput] = useState('');

  // Broadcast & Templates State (Innovative Custom Format System)
  const [customTemplates, setCustomTemplates] = useState<BroadcastTemplate[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem('custom_broadcast_templates');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('detailed');
  const [editingTemplateMode, setEditingTemplateMode] = useState<boolean>(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    telegramFormat: '',
    whatsappFormat: '',
  });

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
  const [telegramChannelId, setTelegramChannelId] = useState(() =>
    typeof window === 'undefined' ? '' : window.localStorage.getItem('tg_channel_id') || ''
  );
  const [autoPublishTelegram, setAutoPublishTelegram] = useState(false);

  // Ad Settings State (Expanded with all AdSense compliant placements)
  const [adSettings, setAdSettings] = useState<AdSettings>(DEFAULT_AD_SETTINGS);
  const [savingAdSettings, setSavingAdSettings] = useState(false);
  const [adSettingsMessage, setAdSettingsMessage] = useState('');
  const [adStatsDays, setAdStatsDays] = useState<7 | 30 | 90>(30);
  const [adStats, setAdStats] = useState<{
    days: number;
    totals: { impressions: number; clicks: number; ctr: number };
    rows: { unit: string; slotId: string; placement: string; impressions: number; clicks: number; ctr: number }[];
  }>({ days: 30, totals: { impressions: 0, clicks: 0, ctr: 0 }, rows: [] });

  // Social Media Settings State
  const [socialSettings, setSocialSettings] = useState<SocialSettings>(DEFAULT_SOCIAL_SETTINGS);
  const [savingSocialSettings, setSavingSocialSettings] = useState(false);
  const [socialSettingsMessage, setSocialSettingsMessage] = useState('');
  const [homeStatsSettings, setHomeStatsSettings] = useState<HomeStatsSettings>(DEFAULT_HOME_STATS_SETTINGS);
  const [savingHomeStatsSettings, setSavingHomeStatsSettings] = useState(false);
  const [homeStatsSettingsMessage, setHomeStatsSettingsMessage] = useState('');

  // Dedicated Broadcast Hub selected job
  const [hubSelectedJobId, setHubSelectedJobId] = useState<string>('');

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    sector: 'corporate' as JobSector,
    sectorLabel: 'وظائف شركات كبرى',
    gender: 'both' as GenderType,
    genderLabel: 'للجنسين (رجال ونساء)',
    qualifications: 'ثانوية عامة، دبلوم، بكالوريوس',
    location: 'كافة المناطق',
    city: 'الرياض',
    status: 'active' as JobStatus,
    startDate: '',
    endDate: '',
    experience: 'حديثي التخرج وخبرات سابقة',
    salary: 'رواتب وبدلات مجزية',
    summary: '',
    description: '',
    requirements: '',
    benefits: '',
    applicationUrl: 'https://',
    sourceUrl: 'https://',
    featured: false,
    urgent: false,
    tags: [] as string[],
  });

  const [seeding, setSeeding] = useState(false);

  // All available templates (built-in + user-saved custom templates)
  const allTemplates = useMemo(() => {
    return [...BUILTIN_BROADCAST_TEMPLATES, ...customTemplates];
  }, [customTemplates]);

  const activeTemplate = useMemo(() => {
    return allTemplates.find((t) => t.id === selectedTemplateId) || BUILTIN_BROADCAST_TEMPLATES[0];
  }, [allTemplates, selectedTemplateId]);

  // Save new custom template
  const handleSaveCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.name.trim()) {
      alert('يرجى إدخال اسم للصيغة');
      return;
    }
    const newTemplate: BroadcastTemplate = {
      id: `custom_${Date.now()}`,
      name: templateForm.name.trim(),
      description: templateForm.description.trim() || 'صيغة مخصصة بواسطة مدير النظام',
      telegramFormat: templateForm.telegramFormat.trim() || BUILTIN_BROADCAST_TEMPLATES[0].telegramFormat,
      whatsappFormat: templateForm.whatsappFormat.trim() || BUILTIN_BROADCAST_TEMPLATES[0].whatsappFormat,
    };
    const updated = [...customTemplates, newTemplate];
    setCustomTemplates(updated);
    localStorage.setItem('custom_broadcast_templates', JSON.stringify(updated));
    setSelectedTemplateId(newTemplate.id);
    setEditingTemplateMode(false);
    alert('تم حفظ الصيغة المخصصة بنجاح! يمكنك الآن اختيارها واستخدامها في أي وقت. 🎉');
  };

  const handleDeleteCustomTemplate = (id: string) => {
    if (!confirm('هل تريد حذف هذه الصيغة المخصصة؟')) return;
    const updated = customTemplates.filter((t) => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('custom_broadcast_templates', JSON.stringify(updated));
    setSelectedTemplateId('detailed');
  };

  const insertVariableIntoTemplate = (variableKey: string, target: 'telegram' | 'whatsapp') => {
    const placeholder = `{${variableKey}}`;
    if (target === 'telegram') {
      setTemplateForm((prev) => ({ ...prev, telegramFormat: prev.telegramFormat + ' ' + placeholder }));
    } else {
      setTemplateForm((prev) => ({ ...prev, whatsappFormat: prev.whatsappFormat + ' ' + placeholder }));
    }
  };

  // Load Ad Settings
  const loadAdSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/ads');
      const data = await res.json();
      if (data.success) setAdSettings(data.data);
    } catch {
      // Safe defaults
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
      if (!res.ok || !data.success) throw new Error(data.error || 'تعذر حفظ إعدادات ومواضع الإعلانات');
      setAdSettings(data.data);
      setAdSettingsMessage('تم حفظ إعدادات ومواضع إعلانات AdSense بنجاح! ✅');
      await loadAuditLogs();
    } catch (error) {
      setAdSettingsMessage(error instanceof Error ? error.message : 'تعذر حفظ الإعدادات');
    } finally {
      setSavingAdSettings(false);
    }
  };

  // Load Social Settings
  const loadSocialSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/social');
      const data = await res.json();
      if (data.success) setSocialSettings(data.data);
    } catch {
      // Safe defaults
    }
  };

  const loadLogoLibrary = async () => {
    try {
      const res = await fetch('/api/admin/logo-library');
      const data = await res.json();
      if (data.success) setLogoLibrary(Array.isArray(data.data) ? data.data : []);
    } catch {
      setLogoLibrary([]);
    }
  };

  const renameLogoLibraryItem = async (item: { name: string; url: string; path?: string }) => {
    if (!item.path) return;
    const name = window.prompt('اسم الشعار الجديد', item.name)?.trim();
    if (!name) return;
    const res = await fetch('/api/admin/logo-library', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: item.path, name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      alert(data.error || 'تعذر إعادة تسمية الشعار.');
      return;
    }
    await loadLogoLibrary();
  };

  const deleteLogoLibraryItem = async (item: { name: string; url: string; path?: string }) => {
    if (!item.path) return;
    if (!window.confirm(`حذف الشعار "${item.name}" نهائيًا من قاعدة البيانات؟`)) return;
    const res = await fetch('/api/admin/logo-library', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: item.path }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      alert(data.error || 'تعذر حذف الشعار.');
      return;
    }
    await loadLogoLibrary();
  };

  const loadHomeStatsSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/home-stats');
      const data = await res.json();
      if (data.success) setHomeStatsSettings(data.data);
    } catch {
      // Safe defaults
    }
  };

  const saveHomeStatsSettings = async () => {
    setSavingHomeStatsSettings(true);
    setHomeStatsSettingsMessage('');
    try {
      const res = await fetch('/api/admin/settings/home-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeStatsSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'تعذر حفظ إعدادات الإحصاءات');
      setHomeStatsSettings(data.data);
      setHomeStatsSettingsMessage('تم حفظ ظهور أجزاء الإحصاءات بنجاح');
      await loadAuditLogs();
    } catch (error) {
      setHomeStatsSettingsMessage(error instanceof Error ? error.message : 'تعذر حفظ الإعدادات');
    } finally {
      setSavingHomeStatsSettings(false);
    }
  };

  const saveSocialSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocialSettings(true);
    setSocialSettingsMessage('');
    try {
      const res = await fetch('/api/admin/settings/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'تعذر حفظ روابط التواصل');
      setSocialSettings(data.data);
      setSocialSettingsMessage('تم حفظ روابط حسابات التواصل الاجتماعي بنجاح! 💾');
      await loadAuditLogs();
    } catch (error) {
      setSocialSettingsMessage(error instanceof Error ? error.message : 'فشل الحفظ');
    } finally {
      setSavingSocialSettings(false);
    }
  };

  const loadAdStats = async (days = adStatsDays) => {
    try {
      const res = await fetch(`/api/admin/ads/stats?days=${days}`);
      const data = await res.json();
      if (data.success) setAdStats(data.data);
    } catch {
      // Ignore
    }
  };

  const handleSeedJobs = async () => {
    try {
      setSeeding(true);
      const res = await fetch('/api/seed');
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'تمت مزامنة كافة الوظائف بنجاح!');
        await refreshDashboard();
      } else {
        alert('حدث خطأ أثناء المزامنة: ' + (data.error || 'فشلت المزامنة'));
      }
    } catch (e: unknown) {
      alert('خطأ أثناء المزامنة: ' + (e instanceof Error ? e.message : 'فشلت'));
    } finally {
      setSeeding(false);
    }
  };

  const loadJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
        if (!hubSelectedJobId && data.data.length > 0) {
          setHubSelectedJobId(data.data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      // Loading is represented by the jobs empty state where needed.
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success) setAuditLogs(data.data || []);
    } catch {
      // Ignore
    }
  };

  const loadContactMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.success) setContactMessages(data.data || []);
    } catch {
      // Ignore
    }
  };

  const updateContactMessageStatus = async (id: number, status: 'new' | 'in_progress' | 'resolved') => {
    const res = await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setContactMessages((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    try {
      const statsRequest = fetch('/api/stats').then((res) => res.json());
      await Promise.all([
        loadJobs(),
        loadAuditLogs(),
        loadContactMessages(),
        loadSocialSettings(),
        statsRequest.then((data) => {
          if (data.success) setDashboardStats(data.data);
        }),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const exportJobsCsv = () => {
    const headers = ['العنوان', 'الجهة', 'القطاع', 'المدينة', 'الحالة', 'تاريخ النشر', 'تاريخ الانتهاء', 'المشاهدات', 'الوسوم', 'رابط التقديم'];
    const rows = filtered.map((job) => [
      job.title,
      job.company,
      job.sectorLabel,
      job.city,
      job.status,
      job.publishDate,
      job.endDate,
      String(job.viewsCount || 0),
      (job.tags || []).join('; '),
      job.applicationUrl,
    ]);
    const csv = '\uFEFF' + [headers, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wadhaef-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  const togglePageSelection = () => {
    const pageIds = paginatedJobs.map((job) => job.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => (allSelected ? current.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...current, ...pageIds]))));
  };

  const deleteSelectedJobs = async () => {
    if (!selectedIds.length || !confirm(`سيتم حذف ${selectedIds.length} إعلان نهائيًا. هل تريد المتابعة؟`)) return;
    const results = await Promise.all(selectedIds.map((id) => fetch(`/api/jobs/${id}`, { method: 'DELETE' })));
    const failed = results.filter((result) => !result.ok).length;
    setSelectedIds([]);
    await refreshDashboard();
    alert(failed ? `تم حذف بعض الإعلانات، وفشل حذف ${failed}.` : 'تم حذف الإعلانات المحددة بنجاح.');
  };

  const handleQuickStatusChange = async (jobId: string, newStatus: JobStatus) => {
    setUpdatingStatusId(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)));
      } else {
        alert('تعذر تغيير الحالة مباشرة.');
      }
    } catch {
      alert('خطأ أثناء تحديث الحالة.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  useEffect(() => {
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          loadAdSettings();
          loadAdStats();
          loadSocialSettings();
          loadHomeStatsSettings();
          loadLogoLibrary();
          loadContactMessages();
        }
        loadJobs();
        loadAuditLogs();
        loadContactMessages();
      })
      .catch(() => setIsAuthenticated(false));
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDashboardStats(data.data);
      })
      .catch(() => undefined);
    // Data loaders run through explicit refresh/auth callbacks.
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pin }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.error || 'رمز الدخول غير صحيح');
        setIsAuthenticated(true);
        loadAdSettings();
        loadAdStats();
        loadSocialSettings();
        loadHomeStatsSettings();
        loadLogoLibrary();
        setPin('');
        setPinError(false);
      })
      .catch(() => setPinError(true));
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

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const preview = URL.createObjectURL(file);
      setLogoPreviewUrl(preview);
    }
  };

  const removeLogoFile = () => {
    setLogoFile(null);
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
      setLogoPreviewUrl('');
    }
  };

  const applyTemplate = (key: keyof typeof JOB_TEMPLATES) => {
    const template = JOB_TEMPLATES[key];
    setFormData((prev) => ({
      ...prev,
      sector: template.sector,
      sectorLabel: template.sectorLabel,
      gender: template.gender,
      genderLabel: template.genderLabel,
      qualifications: template.qualifications,
      salary: template.salary,
      experience: template.experience,
      summary: template.summary,
      description: template.description,
      requirements: template.requirements,
      benefits: template.benefits,
      tags: template.tags,
    }));
  };

  const addTag = (text: string) => {
    const clean = text.replace(/^[#\s]+/, '').trim();
    if (!clean) return;
    if (!formData.tags.includes(clean)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, clean] }));
    }
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const setDaysFromToday = (days: number) => {
    const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setFormData((prev) => ({ ...prev, endDate: target.toISOString().split('T')[0] }));
  };

  const openAddModal = () => {
    loadLogoLibrary();
    setLogoAssetName('');
    setEditingJob(null);
    setDuplicatingJob(false);
    removeLogoFile();
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
      tags: ['وظائف_السعودية', 'توظيف_فوري'],
    });
    setModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    loadLogoLibrary();
    setLogoAssetName('');
    setEditingJob(job);
    setDuplicatingJob(false);
    removeLogoFile();
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
      tags: job.tags || [],
    });
    setModalOpen(true);
  };

  const openDuplicateModal = (job: Job) => {
    openEditModal(job);
    setEditingJob(null);
    setDuplicatingJob(true);
    setFormData((prev) => ({
      ...prev,
      title: `${job.title} (نسخة جديدة)`,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'active',
      tags: job.tags || [],
    }));
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingJob) return;
    setSavingJob(true);

    const quals = formData.qualifications.split(/[,،]+/).map((q) => q.trim()).filter(Boolean);
    const reqs = formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean);
    const bens = formData.benefits.split('\n').map((b) => b.trim()).filter(Boolean);

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
        uploadData.append('name', logoAssetName.trim());
        const uploadRes = await fetch('/api/admin/upload-logo', { method: 'POST', body: uploadData });
        const result = await uploadRes.json().catch(() => ({}));
        setUploadingLogo(false);
        if (!uploadRes.ok || !result.success) throw new Error(result.error || 'فشل رفع الشعار');
        companyLogo = result.url;
        await loadLogoLibrary();
        setLogoAssetName('');
      }

      const payload = {
        ...formData,
        companyLogo,
        sectorLabel,
        genderLabel,
        qualifications: quals,
        requirements: reqs,
        benefits: bens,
        tags: formData.tags,
      };

      let savedJob: Job | null = null;
      if (editingJob) {
        const res = await fetch(`/api/jobs/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'فشل حفظ الإعلان');
        savedJob = data.data;
      } else {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'فشل حفظ الإعلان');
        savedJob = data.data;
      }

      removeLogoFile();
      await loadJobs();
      await loadAuditLogs();
      setModalOpen(false);
      setDuplicatingJob(false);

      if (autoPublishTelegram && savedJob) {
        await executeTelegramPublish(savedJob);
      } else if (savedJob) {
        openBroadcastModal(savedJob);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الإعلان');
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الإعلان الوظيفي نهائياً؟')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'فشل حذف الإعلان');
      setJobs(jobs.filter((j) => j.id !== id));
      await loadAuditLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف');
    }
  };

  const openBroadcastModal = (job: Job) => {
    setBroadcastJob(job);
    setPublishResult({ type: 'idle', message: '' });
    setBroadcastModalOpen(true);
  };

  // Execute Telegram Publish using current chosen template
  const executeTelegramPublish = async (job: Job, templateToUse = activeTemplate) => {
    setPublishingTelegram(true);
    setPublishResult({ type: 'idle', message: '' });

    const formattedCustom = renderTemplate(templateToUse.telegramFormat, job, currentOrigin);

    try {
      const res = await fetch('/api/publish/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          siteUrl: currentOrigin,
          customText: formattedCustom,
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
    } catch {
      setPublishResult({
        type: 'error',
        message: 'حدث خطأ في الاتصال بالخادم.',
      });
    } finally {
      setPublishingTelegram(false);
    }
  };

  // Open WhatsApp Broadcast using current chosen template
  const openWhatsAppBroadcast = (job: Job, templateToUse = activeTemplate) => {
    const text = renderTemplate(templateToUse.whatsappFormat, job, currentOrigin);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyFormatted = async (text: string, type: 'telegram' | 'whatsapp') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  // Filter & Pagination logic
  const resetJobFilters = () => {
    setSearch('');
    setFilterSector('all');
    setFilterStatus('all');
    setFilterCity('');
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search.trim() || filterCity.trim() || filterSector !== 'all' || filterStatus !== 'all' || sortBy !== 'newest'
  );

  const filtered = (() => {
    const q = search.toLowerCase().trim();
    return jobs
      .filter((j) => {
        const matchesQuery =
          !q ||
          [j.title, j.company, j.city, j.summary].some((v) => (v || '').toLowerCase().includes(q)) ||
          j.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesSector = filterSector === 'all' || j.sector === filterSector;
        const matchesStatus = filterStatus === 'all' || j.status === filterStatus;
        const matchesCity = !filterCity || (j.city || '').toLowerCase().includes(filterCity.toLowerCase());
        return matchesQuery && matchesSector && matchesStatus && matchesCity;
      })
      .sort((a, b) =>
        sortBy === 'views'
          ? (b.viewsCount || 0) - (a.viewsCount || 0)
          : new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
  })();

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedJobs = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.job2sa.com';

  // Sector breakdown stats for Charts
  const sectorCounts = useMemo(() => {
    const total = jobs.length || 1;
    const sectors = [
      { key: 'government', label: 'وظائف حكومية', color: 'bg-emerald-600', count: jobs.filter((j) => j.sector === 'government').length },
      { key: 'military', label: 'وظائف عسكرية', color: 'bg-amber-500', count: jobs.filter((j) => j.sector === 'military').length },
      { key: 'corporate', label: 'شركات كبرى', color: 'bg-blue-600', count: jobs.filter((j) => j.sector === 'corporate').length },
      { key: 'training', label: 'تدريب وتأهيل', color: 'bg-purple-600', count: jobs.filter((j) => j.sector === 'training').length },
      { key: 'results', label: 'نتائج قبول', color: 'bg-rose-500', count: jobs.filter((j) => j.sector === 'results').length },
      { key: 'remote', label: 'وظائف عن بُعد', color: 'bg-teal-600', count: jobs.filter((j) => j.sector === 'remote').length },
    ];
    return sectors.map((s) => ({ ...s, percentage: Math.round((s.count / total) * 100) }));
  }, [jobs]);

  // Current job for dedicated broadcast hub tab
  const hubJob = useMemo(() => {
    return jobs.find((j) => j.id === hubSelectedJobId) || jobs[0] || null;
  }, [jobs, hubSelectedJobId]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="py-20 bg-paper min-h-screen flex items-center justify-center px-4 selection:bg-saffron-200">
        <div className="max-w-md w-full bg-white rounded-3xl border border-line shadow-lift p-8 text-center space-y-6">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="وظيفتك اليوم" className="w-36 h-auto object-contain" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black text-ink-950">لوحة التحكم الإدارية</h1>
            <p className="text-xs text-ink-500">منظومة النشر الذكي وإدارة محتوى التوظيف السعودي</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="أدخل رمز الدخول (PIN)"
                className="w-full text-center text-lg font-bold tracking-widest py-3 px-4 border border-line bg-paper-2/60 rounded-xl focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-400/20 text-ink-950 transition"
              />
            </div>
            {pinError && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 py-2 rounded-lg">
                رمز الدخول غير صحيح، يرجى المحاولة مجدداً
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 bg-ink-950 hover:bg-ink-900 text-white font-black text-sm rounded-xl transition shadow-soft hover:shadow-lift"
            >
              دخول لوحة الإدارة
            </button>
          </form>

          <div className="border-t border-line/60 pt-4 flex items-center justify-between text-[11px] text-ink-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-saffron-600" />
              منطقة إدارية آمنة ومحمية
            </span>
            <Link href="/" className="hover:text-ink-950 transition font-bold">
              العودة للموقع الرئيسي ←
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED-IN ADMIN DASHBOARD
  return (
    <div className="bg-paper min-h-screen text-ink-900 selection:bg-saffron-200 selection:text-ink-950">
      {/* 1. TOP BRAND STRIP */}
      <div className="bg-ink-950 text-ink-300 text-xs border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-400" />
            </span>
            <span className="font-bold text-white text-[11px]">بوابة إدارة وظيفتك اليوم 2026</span>
            <span className="text-ink-700">|</span>
            <span className="hidden sm:inline text-[11px] text-ink-400">متصل بقاعدة البيانات السحابية Supabase</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[11px] text-saffron-400 hover:text-saffron-300 font-bold transition"
            >
              <span>معاينة الموقع الحي</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-ink-700">|</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-[11px] text-ink-400 hover:text-white transition font-medium"
              title="تسجيل الخروج"
            >
              <Unlock className="w-3 h-3" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & QUICK ACTION BAR */}
      <div className="bg-white/80 backdrop-blur-md border-b border-line sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0" aria-label="وظيفتك اليوم">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-full.png" alt="وظيفتك اليوم" className="w-32 sm:w-36 h-auto object-contain" />
            </Link>
            <div className="hidden sm:block border-r border-line pr-4">
              <span className="text-xs font-bold text-ink-500 block">لوحة التحكم المتطورة</span>
              <span className="text-[11px] text-ink-400">إدارة الإعلانات، تحليلات الزيارات، والنشر الآلي</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-paper-2 hover:bg-line border border-line text-ink-800 rounded-xl text-xs font-bold transition disabled:opacity-60"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-ink-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'جاري التحديث' : 'تحديث'}</span>
            </button>

            <button
              onClick={handleSeedJobs}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 text-saffron-800 rounded-xl text-xs font-bold transition disabled:opacity-50"
              title="مزامنة الوظائف التأسيسية الـ 12 إلى قاعدة البيانات السحابية"
            >
              <Database className="w-3.5 h-3.5 text-saffron-600" />
              <span>{seeding ? 'جاري المزامنة...' : 'مزامنة السحابة'}</span>
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-ink-950 rounded-xl text-xs font-black shadow-soft transition hover:scale-[1.02] active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة إعلان جديد</span>
            </button>
          </div>
        </div>

        {/* 3. MODERN TAB NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 space-x-reverse overflow-x-auto scrollbar-none py-1 border-t border-line/40 text-xs">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 py-2.5 px-4 font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'jobs'
                ? 'border-saffron-500 text-ink-950 font-black'
                : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-paper-2/50 rounded-t-lg'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>إدارة الإعلانات</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-paper-2 text-ink-700 font-bold">
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 py-2.5 px-4 font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'analytics'
                ? 'border-saffron-500 text-ink-950 font-black'
                : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-paper-2/50 rounded-t-lg'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>الإحصاءات والتحليلات</span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`flex items-center gap-2 py-2.5 px-4 font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'broadcast'
                ? 'border-saffron-500 text-ink-950 font-black'
                : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-paper-2/50 rounded-t-lg'
                }`}
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>مركز النشر والبث والصيغ</span>
              <span className="w-2 h-2 rounded-full bg-sky-500" />
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-2 py-2.5 px-4 font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'ads'
                ? 'border-saffron-500 text-ink-950 font-black'
                : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-paper-2/50 rounded-t-lg'
                }`}
            >
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>مواضع إعلانات AdSense</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${adSettings.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-600'
                  }`}
              >
                {adSettings.enabled ? 'مفعلة' : 'متوقفة'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 py-2.5 px-4 font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'social'
                ? 'border-saffron-500 text-ink-950 font-black'
                : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-paper-2/50 rounded-t-lg'
                }`}
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>حسابات التواصل</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 py-2.5 px-4 font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'messages'
                ? 'border-saffron-500 text-ink-950 font-black'
                : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-paper-2/50 rounded-t-lg'
                }`}
            >
              <MessageCircle className="w-4 h-4 text-rose-600" />
              <span>الرسائل والبلاغات</span>
              {contactMessages.filter((item) => item.status === 'new').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-black">
                  {contactMessages.filter((item) => item.status === 'new').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`flex items-center gap-2 py-2.5 px-4 font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'maintenance'
                ? 'border-saffron-500 text-ink-950 font-black'
                : 'border-transparent text-ink-500 hover:text-ink-900 hover:bg-paper-2/50 rounded-t-lg'
                }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>السجل والصيانة</span>
            </button>
          </nav>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: JOBS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Quick KPI summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-line shadow-soft">
                <span className="text-xs text-ink-500 font-bold block mb-1">إجمالي الإعلانات</span>
                <span className="text-2xl sm:text-3xl font-black text-ink-950">{jobs.length}</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-line shadow-soft">
                <span className="text-xs text-emerald-700 font-bold block mb-1">إعلانات نشطة ومتاحة</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {jobs.filter((j) => j.status === 'active' || j.status === 'expiring_soon').length}
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-line shadow-soft">
                <span className="text-xs text-saffron-700 font-bold block mb-1">تنتهي قريباً (عاجل)</span>
                <span className="text-2xl sm:text-3xl font-black text-saffron-600">
                  {jobs.filter((j) => j.status === 'expiring_soon').length}
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-line shadow-soft">
                <span className="text-xs text-ink-500 font-bold block mb-1">إجمالي المشاهدات</span>
                <span className="text-2xl sm:text-3xl font-black text-ink-900">
                  {jobs.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0).toLocaleString('ar-SA')}
                </span>
              </div>
            </div>

            {/* Sector Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <span className="text-xs text-ink-400 font-bold shrink-0 ml-1">القطاع:</span>
              {[
                { key: 'all', label: 'الكل' },
                { key: 'government', label: 'حكومية' },
                { key: 'military', label: 'عسكرية' },
                { key: 'corporate', label: 'شركات' },
                { key: 'training', label: 'تدريب' },
                { key: 'results', label: 'نتائج القبول' },
                { key: 'remote', label: 'عن بُعد' },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    setFilterSector(s.key as 'all' | JobSector);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${filterSector === s.key
                    ? 'bg-ink-950 text-white shadow-soft'
                    : 'bg-white border border-line text-ink-700 hover:bg-paper-2'
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Filter toolbar & Search */}
            <div className="bg-white rounded-2xl border border-line shadow-soft overflow-hidden">
              <div className="p-4 border-b border-line flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:flex-1 sm:min-w-56">
                  <Search className="w-4 h-4 text-ink-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    placeholder="ابحث بالعنوان، الجهة، المدينة، أو الوسم..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pr-9 pl-3 py-2 text-xs bg-paper-2/60 border border-line rounded-xl focus:bg-white focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-300/20 text-ink-950"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as 'all' | JobStatus);
                    setPage(1);
                  }}
                  className="min-w-0 flex-1 sm:flex-none px-3 py-2 text-xs bg-paper-2/60 border border-line rounded-xl font-medium"
                >
                  <option value="all">كل الحالات</option>
                  <option value="active">متاحة للتقديم</option>
                  <option value="expiring_soon">تنتهي قريباً</option>
                  <option value="upcoming">قادمة قريباً</option>
                  <option value="results">نتائج القبول</option>
                  <option value="expired">منتهية</option>
                </select>

                <input
                  value={filterCity}
                  onChange={(e) => {
                    setFilterCity(e.target.value);
                    setPage(1);
                  }}
                  placeholder="تصفية حسب المدينة..."
                  className="min-w-24 flex-1 sm:flex-none sm:w-36 px-3 py-2 text-xs bg-paper-2/60 border border-line rounded-xl"
                />

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as 'newest' | 'views');
                    setPage(1);
                  }}
                  className="min-w-0 flex-1 sm:flex-none px-3 py-2 text-xs bg-paper-2/60 border border-line rounded-xl font-medium"
                >
                  <option value="newest">الأحدث نشرًا</option>
                  <option value="views">الأكثر مشاهدة</option>
                </select>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetJobFilters}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper-2 px-3 py-2 text-xs font-bold text-ink-700 hover:bg-line transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    مسح الفلاتر
                  </button>
                )}

                <div className="mr-auto flex items-center gap-2">
                  <span className="text-xs text-ink-500 font-bold">
                    {filtered.length} من {jobs.length} إعلان
                  </span>
                  <button
                    onClick={exportJobsCsv}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-line text-xs font-bold text-ink-700 hover:bg-paper-2 transition"
                    title="تصدير كملف CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </button>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {selectedIds.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-saffron-200 bg-saffron-50 px-4 py-3 text-xs">
                  <span className="font-bold text-saffron-900">تم تحديد {selectedIds.length} إعلان</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedIds([])}
                      className="rounded-xl border border-saffron-200 bg-white px-3 py-1.5 font-bold text-ink-800 hover:bg-paper-2"
                    >
                      إلغاء التحديد
                    </button>
                    <button
                      onClick={deleteSelectedJobs}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 font-bold text-white hover:bg-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف المحدد نهائياً
                    </button>
                  </div>
                </div>
              )}

              {/* Job Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-paper-2/70 text-ink-700 font-bold border-b border-line">
                    <tr>
                      <th className="py-3 px-4 w-10 text-center">
                        <button
                          onClick={togglePageSelection}
                          title="تحديد الكل في هذه الصفحة"
                          className="text-ink-400 hover:text-ink-950"
                        >
                          {paginatedJobs.length > 0 && paginatedJobs.every((job) => selectedIds.includes(job.id)) ? (
                            <CheckSquare className="w-4 h-4 text-ink-950" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-4">الإعلان والجهة</th>
                      <th className="py-3 px-4">القطاع والمدينة</th>
                      <th className="py-3 px-4">الحالة (تغيير فوري)</th>
                      <th className="py-3 px-4 text-center">المشاهدات</th>
                      <th className="py-3 px-4 text-center">النشر السريع</th>
                      <th className="py-3 px-4 text-center">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {paginatedJobs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-ink-500">
                          <Search className="mx-auto mb-2 h-7 w-7 text-ink-300" />
                          <p className="font-bold">
                            {jobs.length === 0 ? 'لا توجد إعلانات حتى الآن، أضف إعلاناً جديداً' : 'لا توجد نتائج مطابقة للبحث'}
                          </p>
                          {hasActiveFilters && (
                            <button
                              type="button"
                              onClick={resetJobFilters}
                              className="mt-2 text-xs font-bold text-saffron-700 hover:underline"
                            >
                              إعادة ضبط الفلاتر
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                    {paginatedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-paper-2/40 transition">
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleSelection(job.id)}
                            title="تحديد"
                            className="text-ink-400 hover:text-ink-950"
                          >
                            {selectedIds.includes(job.id) ? (
                              <CheckSquare className="w-4 h-4 text-ink-950" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {job.companyLogo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={job.companyLogo}
                                alt={job.company}
                                className="w-9 h-9 rounded-xl object-contain border border-line bg-paper-2 p-1 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl border border-line bg-paper-2 flex items-center justify-center shrink-0 text-ink-400 font-bold text-[10px]">
                                {job.company.slice(0, 2)}
                              </div>
                            )}
                            <div className="min-w-0 max-w-xs">
                              <a
                                href={`/jobs/${job.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-black text-ink-950 hover:text-saffron-700 flex items-center gap-1 truncate"
                              >
                                <span className="truncate">{job.title}</span>
                                <ExternalLink className="w-3 h-3 text-ink-400 shrink-0" />
                              </a>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-ink-500 font-bold">{job.company}</span>
                                {job.tags && job.tags.length > 0 && (
                                  <span className="text-[10px] text-ink-400">
                                    #{job.tags[0]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-paper-2 text-ink-700 border border-line">
                              {job.sectorLabel}
                            </span>
                            <div className="text-[11px] text-ink-500">{job.city}</div>
                          </div>
                        </td>

                        {/* Quick inline status changer */}
                        <td className="py-3 px-4">
                          <select
                            value={job.status}
                            disabled={updatingStatusId === job.id}
                            onChange={(e) => handleQuickStatusChange(job.id, e.target.value as JobStatus)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${job.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : job.status === 'expiring_soon'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : job.status === 'results'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : 'bg-ink-100 text-ink-700 border-ink-200'
                              }`}
                          >
                            <option value="active">متاح الآن</option>
                            <option value="expiring_soon">ينتهي قريباً</option>
                            <option value="upcoming">قادم قريباً</option>
                            <option value="results">نتائج قبول</option>
                            <option value="expired">منتهي</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-center font-bold text-ink-700">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="w-3 h-3 text-ink-400" />
                            {(job.viewsCount || 0).toLocaleString('ar-SA')}
                          </span>
                        </td>

                        {/* Broadcast Button */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => openBroadcastModal(job)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition hover:scale-105 active:scale-95"
                            title="نشر الإعلان في قنوات التيليجرام والواتساب"
                          >
                            <Send className="w-3.5 h-3.5 text-sky-600" />
                            <span>نشر بالقنوات</span>
                          </button>
                        </td>

                        {/* Row Actions */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openDuplicateModal(job)}
                              className="p-1.5 text-ink-600 hover:text-ink-950 hover:bg-paper-2 rounded-lg transition"
                              title="نسخ الإعلان كإعلان جديد"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(job)}
                              className="p-1.5 text-saffron-700 hover:text-saffron-800 hover:bg-saffron-50 rounded-lg transition"
                              title="تعديل الإعلان"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                              title="حذف الإعلان"
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

              {/* Table pagination */}
              <div className="flex items-center justify-between border-t border-line p-3 text-xs bg-paper-2/40">
                <span className="text-ink-500 font-medium">
                  صفحة {currentPage} من {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setPage((v) => Math.max(1, v - 1))}
                    className="rounded-xl border border-line bg-white px-3 py-1.5 font-bold hover:bg-paper-2 disabled:opacity-40 transition"
                  >
                    السابق
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
                    className="rounded-xl border border-line bg-white px-3 py-1.5 font-bold hover:bg-paper-2 disabled:opacity-40 transition"
                  >
                    التالي
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ANALYTICS & CHARTS */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-ink-950">تحكم أجزاء الإحصاءات في الصفحة الرئيسية</h3>
                  <p className="text-xs text-ink-500">اختر الأجزاء الظاهرة؛ يتم ضبط عرض الأعمدة تلقائيًا حسب عدد الأجزاء المفعلة.</p>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-xl bg-paper-2 text-xs font-bold text-ink-700">
                  4 أجزاء
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: 'total', label: 'إعلان في المنصة' },
                  { key: 'active', label: 'مفتوح للتقديم الآن' },
                  { key: 'expiringSoon', label: 'ينتهي خلال أسبوع' },
                  { key: 'totalViews', label: 'مشاهدة للإعلانات' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-line bg-paper/50 cursor-pointer hover:border-saffron-300 transition"
                  >
                    <span className="text-xs font-bold text-ink-800">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={homeStatsSettings[item.key as keyof HomeStatsSettings]}
                      onChange={(e) =>
                        setHomeStatsSettings({
                          ...homeStatsSettings,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="h-5 w-5 accent-saffron-500 rounded"
                    />
                  </label>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line pt-4">
                <p className={`text-xs font-bold ${homeStatsSettingsMessage.includes('بنجاح') ? 'text-emerald-700' : 'text-ink-500'}`}>
                  {homeStatsSettingsMessage || 'التغيير يُطبق على الصفحة الرئيسية فور حفظه.'}
                </p>
                <button
                  onClick={saveHomeStatsSettings}
                  disabled={savingHomeStatsSettings}
                  className="rounded-xl bg-ink-950 px-5 py-2.5 text-xs font-black text-white hover:bg-ink-900 disabled:opacity-60 transition"
                >
                  {savingHomeStatsSettings ? 'جاري الحفظ...' : 'حفظ ظهور الإحصاءات'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-line shadow-soft">
                <span className="text-xs text-ink-500 font-bold block mb-1">المشاهدات السحابية</span>
                <span className="text-2xl font-black text-ink-950">
                  {(dashboardStats.totalViews || jobs.reduce((a, b) => a + (b.viewsCount || 0), 0)).toLocaleString('ar-SA')}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-line shadow-soft">
                <span className="text-xs text-ink-500 font-bold block mb-1">تنتهي خلال 7 أيام</span>
                <span className="text-2xl font-black text-saffron-600">{dashboardStats.expiringSoon || 0}</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-line shadow-soft">
                <span className="text-xs text-ink-500 font-bold block mb-1">متوسط المشاهدات لكل وظيفة</span>
                <span className="text-2xl font-black text-ink-950">
                  {jobs.length ? Math.round(jobs.reduce((a, b) => a + (b.viewsCount || 0), 0) / jobs.length) : 0}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-line shadow-soft">
                <span className="text-xs text-ink-500 font-bold block mb-1">نسبة الوظائف النشطة</span>
                <span className="text-2xl font-black text-emerald-600">
                  {jobs.length
                    ? Math.round((jobs.filter((j) => j.status === 'active' || j.status === 'expiring_soon').length / jobs.length) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-ink-950">توزيع الوظائف حسب القطاع</h3>
                  <p className="text-xs text-ink-500">النسب المئوية وأعداد الإعلانات المنشورة لكل قطاع</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-paper-2 text-xs font-bold text-ink-700">
                  {jobs.length} إعلان كلي
                </span>
              </div>

              <div className="space-y-4">
                {sectorCounts.map((sector) => (
                  <div key={sector.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-ink-900">{sector.label}</span>
                      <span className="text-ink-500 font-bold">
                        {sector.count} إعلان ({sector.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-paper-2 rounded-full h-3.5 overflow-hidden">
                      <div
                        className={`h-full ${sector.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${Math.max(sector.percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-ink-950">الوظائف الأكثر تفاعلاً وزيارة (Leaderboard)</h3>
                  <p className="text-xs text-ink-500">أكثر الإعلانات التي حازت على اهتمام الزوار في المملكة</p>
                </div>
                <span className="text-xs text-ink-400 font-bold">أعلى 5 إعلانات</span>
              </div>

              <div className="space-y-3">
                {[...jobs]
                  .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
                  .slice(0, 5)
                  .map((job, idx) => {
                    const topViews = jobs.length ? Math.max(...jobs.map((j) => j.viewsCount || 0)) : 1;
                    const percent = Math.round(((job.viewsCount || 0) / (topViews || 1)) * 100);
                    return (
                      <div
                        key={job.id}
                        className="p-3.5 rounded-xl border border-line bg-paper/60 hover:bg-paper transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${idx === 0
                              ? 'bg-amber-400 text-ink-950'
                              : idx === 1
                                ? 'bg-slate-300 text-ink-950'
                                : idx === 2
                                  ? 'bg-amber-700 text-white'
                                  : 'bg-paper-2 text-ink-600'
                              }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <a
                              href={`/jobs/${job.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-xs text-ink-950 hover:text-saffron-700 truncate block"
                            >
                              {job.title}
                            </a>
                            <span className="text-[11px] text-ink-500">{job.company}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="w-28 sm:w-36 bg-paper-2 rounded-full h-2 overflow-hidden">
                            <div className="bg-saffron-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="text-xs font-black text-ink-950 min-w-16 text-left">
                            {(job.viewsCount || 0).toLocaleString('ar-SA')} زيارة
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INNOVATIVE BROADCAST STUDIO & TEMPLATES CREATOR */}
        {/* ========================================================================= */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6">
            {/* Telegram Channel Status Banner */}
            <div className="bg-white rounded-2xl border border-line p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-ink-950 text-sm sm:text-base">حالة النشر التلقائي في التيليجرام</h3>
                  <p className="text-xs text-ink-500">
                    {telegramChannelId ? (
                      <>القناة المتصلة حالياً: <strong className="text-sky-700 font-mono dir-ltr">{telegramChannelId}</strong></>
                    ) : (
                      <span className="text-amber-700 font-bold">لم يتم ربط القناة بعد. انقر على الزر لإدخال معرف القناة.</span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSettingsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition self-start md:self-auto"
              >
                تعديل معرف القناة والبوت ←
              </button>
            </div>

            {/* Template Selection & Creation Bar */}
            <div className="bg-white rounded-2xl border border-line shadow-soft p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-ink-950 text-sm sm:text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-saffron-600" />
                    <span>اختيار أو تصميم صيغة النشر (أشكال مبتكرة متعددة)</span>
                  </h3>
                  <p className="text-xs text-ink-500">
                    اختر من الصيغ الجاهزة المبتكرة، أو صمم واحفظ صيغتك المخصصة بأسلوبك الخاص
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingTemplateMode(!editingTemplateMode);
                    if (!editingTemplateMode) {
                      setTemplateForm({
                        name: 'صيغتي المخصصة',
                        description: 'صيغة مخصصة جديدة',
                        telegramFormat: BUILTIN_BROADCAST_TEMPLATES[0].telegramFormat,
                        whatsappFormat: BUILTIN_BROADCAST_TEMPLATES[0].whatsappFormat,
                      });
                    }
                  }}
                  className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-ink-950 text-xs font-black rounded-xl shadow-soft transition self-start sm:self-auto"
                >
                  {editingTemplateMode ? '✕ إغلاق محرر الصيغ' : '✨ إنشاء وحفظ صيغة جديدة من عندك'}
                </button>
              </div>

              {/* Template Chips / Selector */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {allTemplates.map((tmpl) => (
                  <div key={tmpl.id} className="relative group shrink-0">
                    <button
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${selectedTemplateId === tmpl.id
                        ? 'bg-ink-950 text-white shadow-soft'
                        : 'bg-paper-2 border border-line text-ink-700 hover:bg-line'
                        }`}
                    >
                      {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-saffron-400" />}
                      <span>{tmpl.name}</span>
                    </button>
                    {tmpl.id.startsWith('custom_') && (
                      <button
                        onClick={() => handleDeleteCustomTemplate(tmpl.id)}
                        className="absolute -top-1.5 -start-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] opacity-0 group-hover:opacity-100 transition shadow-xs"
                        title="حذف هذه الصيغة المخصصة"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Template Editor Drawer */}
              {editingTemplateMode && (
                <form
                  onSubmit={handleSaveCustomTemplate}
                  className="p-5 rounded-2xl border border-saffron-200 bg-saffron-50/40 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-saffron-200/60 pb-3">
                    <h4 className="font-black text-ink-950 text-xs sm:text-sm">
                      محرر الصيغ المبتكر: اكتب قالباً واحفظه مع المتغيرات الديناميكية
                    </h4>
                    <span className="text-[11px] text-saffron-800 font-bold">يتم الحفظ في جهازك تلقائياً</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink-800 mb-1">اسم الصيغة المخصصة *</label>
                      <input
                        type="text"
                        required
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                        placeholder="مثال: صيغة قنوات التنبيه المسائية..."
                        className="w-full p-2.5 bg-white border border-line rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink-800 mb-1">وصف الصيغة</label>
                      <input
                        type="text"
                        value={templateForm.description}
                        onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                        placeholder="وصف مختصر لمجال استخدام الصيغة..."
                        className="w-full p-2.5 bg-white border border-line rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Insertable variable chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-ink-600 block">
                      انقر على أي متغير لإدراجه في الصيغة تلقائياً:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { key: 'title', label: 'المسمى الوظيفي' },
                        { key: 'company', label: 'الجهة المعلنة' },
                        { key: 'sector', label: 'القطاع' },
                        { key: 'qualifications', label: 'المؤهل' },
                        { key: 'gender', label: 'الجنس' },
                        { key: 'city', label: 'المدينة' },
                        { key: 'salary', label: 'الراتب' },
                        { key: 'experience', label: 'الخبرة' },
                        { key: 'endDate', label: 'تاريخ الانتهاء' },
                        { key: 'summary', label: 'النبذة' },
                        { key: 'url', label: 'رابط التقديم' },
                        { key: 'tags', label: 'الوسوم' },
                      ].map((v) => (
                        <button
                          key={v.key}
                          type="button"
                          onClick={() => insertVariableIntoTemplate(v.key, broadcastTab)}
                          className="px-2 py-1 rounded-lg bg-white border border-saffron-300 hover:bg-saffron-100 text-[10px] font-bold text-saffron-900 transition"
                        >
                          + {v.label} <code className="dir-ltr text-[9px]">({`{${v.key}}`})</code>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ink-800 mb-1">
                        صيغة التيليجرام (يدعم وسوم HTML: &lt;b&gt;, &lt;i&gt;)
                      </label>
                      <textarea
                        rows={8}
                        value={templateForm.telegramFormat}
                        onChange={(e) => setTemplateForm({ ...templateForm, telegramFormat: e.target.value })}
                        className="w-full p-3 bg-white border border-line rounded-xl font-mono text-[11px] leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink-800 mb-1">
                        صيغة الواتساب (يدعم وسوم Markdown: *bold*, _italic_)
                      </label>
                      <textarea
                        rows={8}
                        value={templateForm.whatsappFormat}
                        onChange={(e) => setTemplateForm({ ...templateForm, whatsappFormat: e.target.value })}
                        className="w-full p-3 bg-white border border-line rounded-xl font-mono text-[11px] leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingTemplateMode(false)}
                      className="px-4 py-2 rounded-xl bg-white border border-line text-xs font-bold text-ink-700 hover:bg-paper-2"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-ink-950 text-white text-xs font-black hover:bg-ink-900 shadow-soft"
                    >
                      حفظ الصيغة في قائمتك
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Broadcast Studio: Choose job and preview with chosen template */}
            <div className="bg-white rounded-2xl border border-line shadow-soft p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
                <div>
                  <h3 className="text-base font-black text-ink-950">معاينة البث المباشر بالصيغة المختارة</h3>
                  <p className="text-xs text-ink-500">
                    الصيغة النشطة حالياً: <strong className="text-saffron-700 font-bold">{activeTemplate.name}</strong>
                  </p>
                </div>

                <div className="w-full sm:w-80">
                  <select
                    value={hubSelectedJobId}
                    onChange={(e) => setHubSelectedJobId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-paper-2 border border-line rounded-xl font-bold text-ink-950"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.company})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hubJob ? (
                <div className="space-y-4">
                  {/* Channel preview tabs */}
                  <div className="flex items-center gap-2 border-b border-line pb-2">
                    <button
                      onClick={() => setBroadcastTab('telegram')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${broadcastTab === 'telegram'
                        ? 'bg-sky-50 text-sky-800 border border-sky-300 font-black'
                        : 'text-ink-500 hover:text-ink-950'
                        }`}
                    >
                      <Send className="w-4 h-4 text-sky-600" />
                      <span>معاينة التيليجرام</span>
                    </button>

                    <button
                      onClick={() => setBroadcastTab('whatsapp')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${broadcastTab === 'whatsapp'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-black'
                        : 'text-ink-500 hover:text-ink-950'
                        }`}
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>معاينة الواتساب</span>
                    </button>
                  </div>

                  {/* Message box */}
                  <div className="relative">
                    <div className="bg-ink-950 text-ink-100 p-5 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto border border-ink-800 selection:bg-saffron-500 selection:text-ink-950">
                      {broadcastTab === 'telegram'
                        ? renderTemplate(activeTemplate.telegramFormat, hubJob, currentOrigin)
                        : renderTemplate(activeTemplate.whatsappFormat, hubJob, currentOrigin)}
                    </div>
                  </div>

                  {/* Broadcast Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <button
                      onClick={() => executeTelegramPublish(hubJob, activeTemplate)}
                      disabled={publishingTelegram}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-xl text-xs font-black shadow-soft transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>{publishingTelegram ? 'جاري البث...' : 'نشر فوري في التيليجرام'}</span>
                    </button>

                    <button
                      onClick={() => openWhatsAppBroadcast(hubJob, activeTemplate)}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-soft transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>فتح في الواتساب</span>
                    </button>

                    <button
                      onClick={() =>
                        copyFormatted(
                          broadcastTab === 'telegram'
                            ? renderTemplate(activeTemplate.telegramFormat, hubJob, currentOrigin)
                            : renderTemplate(activeTemplate.whatsappFormat, hubJob, currentOrigin),
                          broadcastTab
                        )
                      }
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-paper-2 hover:bg-line text-ink-950 rounded-xl text-xs font-bold border border-line transition"
                    >
                      {copiedType === broadcastTab ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">تم نسخ النص بنجاح!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>نسخ النص للحافظة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ink-500">لا توجد وظائف متاحة للبث حالياً.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COMPREHENSIVE ADSENSE PLACEMENTS & COMPLIANCE */}
        {/* ========================================================================= */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl border border-line shadow-soft overflow-hidden">
              <div className="p-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-ink-950">مواضع إعلانات Google AdSense المتوافقة رسمياً</h2>
                    <p className="text-xs text-ink-500">
                      حدد بعلامة (✓) المواضع الدقيقة التي تريد ظهور الإعلانات فيها عبر كافة صفحات الموقع
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${adSettings.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-paper-2 text-ink-600'
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${adSettings.enabled ? 'bg-emerald-500' : 'bg-ink-400'}`} />
                  {adSettings.enabled ? 'الإعلانات مفعلة عامة' : 'الإعلانات متوقفة عامة'}
                </span>
              </div>

              <div className="p-5 space-y-6">
                {/* Master Switch */}
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper-2/60 p-4 cursor-pointer">
                  <div>
                    <strong className="block text-sm text-ink-950 font-black">المفتاح الرئيسي لإعلانات الموقع</strong>
                    <span className="text-xs text-ink-500">
                      تشغيل أو إيقاف كافة الوحدات الإعلانية في كامل الموقع فورياً بنقرة واحدة
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adSettings.enabled}
                    onChange={(e) => setAdSettings({ ...adSettings, enabled: e.target.checked })}
                    className="h-6 w-6 accent-saffron-500 rounded cursor-pointer"
                  />
                </label>

                {/* Ad Placements Checkboxes Matrix */}
                <div className="space-y-5">
                  {/* Group 1: Home Page */}
                  <div className="p-4 rounded-2xl border border-line bg-paper/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-ink-950 text-xs sm:text-sm flex items-center gap-2">
                        <span>🏠 مواضع الصفحة الرئيسية (Home Page)</span>
                      </h3>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        متوافق مع سياسات AdSense ✅
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.homeTop}
                          onChange={(e) => setAdSettings({ ...adSettings, homeTop: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">أعلى الرئيسية (تحت الهيدر)</strong>
                          <span className="text-[11px] text-ink-400">إعلان عريض متجاوب (Responsive Banner)</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.homeInFeed}
                          onChange={(e) => setAdSettings({ ...adSettings, homeInFeed: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">بين بطاقات الوظائف (In-Feed)</strong>
                          <span className="text-[11px] text-ink-400">مدمج داخل القائمة كل 3 وظائف لتجربة مستخدم مثالية</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.homeBottom}
                          onChange={(e) => setAdSettings({ ...adSettings, homeBottom: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">أسفل الرئيسية (قبل الفوتر)</strong>
                          <span className="text-[11px] text-ink-400">يظهر بعد تصفح كامل الوظائف</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Group 2: Job Detail Page */}
                  <div className="p-4 rounded-2xl border border-line bg-paper/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-ink-950 text-xs sm:text-sm flex items-center gap-2">
                        <span>📄 مواضع صفحة تفاصيل الوظيفة (Job Detail)</span>
                      </h3>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        أعلى عائد للنقرات المحسوبة ✅
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.jobDetailTop}
                          onChange={(e) => setAdSettings({ ...adSettings, jobDetailTop: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">أعلى تفاصيل الوظيفة</strong>
                          <span className="text-[11px] text-ink-400">فوق البطاقة الرئيسية</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.jobDetailInArticle}
                          onChange={(e) => setAdSettings({ ...adSettings, jobDetailInArticle: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">داخل المقال (In-Article)</strong>
                          <span className="text-[11px] text-ink-400">بين الشروط والمزايا بتنسيق هادئ</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.jobDetailBeforeApply}
                          onChange={(e) => setAdSettings({ ...adSettings, jobDetailBeforeApply: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">قبل التقديم (مسافة أمان)</strong>
                          <span className="text-[11px] text-ink-400">فوق زر التقديم مع عزل لمنع النقرات العرضية</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.jobDetailBottom}
                          onChange={(e) => setAdSettings({ ...adSettings, jobDetailBottom: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">أسفل صفحة الوظيفة</strong>
                          <span className="text-[11px] text-ink-400">بعد بطاقات الوظائف المشابهة</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Group 3: Category & Search Pages */}
                  <div className="p-4 rounded-2xl border border-line bg-paper/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-ink-950 text-xs sm:text-sm flex items-center gap-2">
                        <span>📑 مواضع صفحات الأقسام والبحث (Sectors & Search)</span>
                      </h3>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        متوافق مع صفحات التدريب والنتائج ✅
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.sectorPagesTop}
                          onChange={(e) => setAdSettings({ ...adSettings, sectorPagesTop: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">أعلى صفحات الأقسام والبحث</strong>
                          <span className="text-[11px] text-ink-400">
                            يظهر أعلى صفحات (الحكومية، العسكرية، الشركات، التدريب، نتائج القبول)
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.sectorPagesInFeed}
                          onChange={(e) => setAdSettings({ ...adSettings, sectorPagesInFeed: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">بين بطاقات وظائف الأقسام (In-Feed)</strong>
                          <span className="text-[11px] text-ink-400">إعلان مدمج بعد البطاقة الثالثة في كل تصنيف</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-line cursor-pointer hover:border-saffron-300 transition">
                        <input
                          type="checkbox"
                          checked={adSettings.sidebarSticky ?? true}
                          onChange={(e) => setAdSettings({ ...adSettings, sidebarSticky: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-saffron-500 rounded shrink-0"
                        />
                        <div className="text-xs">
                          <strong className="block text-ink-900">الشريط الجانبي اللاصق (Sticky Sidebar)</strong>
                          <span className="text-[11px] text-ink-400">إعلان ثابت بجانب تفاصيل الوظيفة أثناء التمرير</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Slot ID & Format Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-line">
                  <div>
                    <label className="block text-xs font-bold text-ink-800 mb-1">
                      رقم الوحدة الإعلانية (Slot ID) *
                    </label>
                    <input
                      value={adSettings.slotId}
                      onChange={(e) => setAdSettings({ ...adSettings, slotId: e.target.value })}
                      placeholder="مثال: 1234567890"
                      className="w-full rounded-xl border border-line bg-paper-2/60 px-3 py-2 text-xs font-mono focus:bg-white focus:border-saffron-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-800 mb-1">نوع العرض</label>
                    <select
                      value={adSettings.format}
                      onChange={(e) => setAdSettings({ ...adSettings, format: e.target.value as AdSettings['format'] })}
                      className="w-full rounded-xl border border-line bg-paper-2/60 px-3 py-2 text-xs"
                    >
                      <option value="auto">متجاوب تلقائياً (Responsive)</option>
                      <option value="fluid">Fluid (لإعلانات In-Feed و In-Article)</option>
                      <option value="rectangle">مستطيل ثابت (300x250)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-800 mb-1">نص التمييز التوضيحي</label>
                    <input
                      value={adSettings.label}
                      onChange={(e) => setAdSettings({ ...adSettings, label: e.target.value })}
                      className="w-full rounded-xl border border-line bg-paper-2/60 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line bg-paper-2/40 px-5 py-3">
                <p
                  className={`text-xs font-bold ${adSettingsMessage.includes('بنجاح') ? 'text-emerald-700' : 'text-ink-500'
                    }`}
                >
                  {adSettingsMessage || 'كافة المواضع متوافقة ومفحوصة وفق سياسات Google AdSense الرسمية.'}
                </p>
                <button
                  onClick={saveAdSettings}
                  disabled={savingAdSettings}
                  className="rounded-xl bg-ink-950 px-6 py-2.5 text-xs font-black text-white hover:bg-ink-900 disabled:opacity-60 transition shadow-soft"
                >
                  {savingAdSettings ? 'جاري الحفظ...' : 'حفظ مواضع وإعدادات الإعلانات'}
                </button>
              </div>
            </section>

            {/* Ad Statistics */}
            <section className="bg-white rounded-2xl border border-line shadow-soft overflow-hidden">
              <div className="p-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-paper-2 text-ink-700 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-black text-ink-950">إحصائيات ظهور ونقرات الإعلانات التشخيصية</h2>
                    <p className="text-xs text-ink-500">متابعة الأداء لكل موضع إعلاني على الموقع</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={adStatsDays}
                    onChange={(e) => {
                      const days = Number(e.target.value) as 7 | 30 | 90;
                      setAdStatsDays(days);
                      loadAdStats(days);
                    }}
                    className="rounded-xl border border-line bg-paper-2 px-3 py-2 text-xs font-bold"
                  >
                    <option value={7}>آخر 7 أيام</option>
                    <option value={30}>آخر 30 يومًا</option>
                    <option value={90}>آخر 90 يومًا</option>
                  </select>
                  <button
                    onClick={() => loadAdStats()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-bold text-ink-700 hover:bg-paper-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> تحديث
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5">
                <div className="rounded-xl bg-paper-2/60 p-4 border border-line">
                  <span className="text-xs text-ink-500 font-bold">مرات الظهور (Impressions)</span>
                  <strong className="block mt-1 text-2xl font-black text-ink-950">
                    {adStats.totals.impressions.toLocaleString('ar-SA')}
                  </strong>
                </div>

                <div className="rounded-xl bg-paper-2/60 p-4 border border-line">
                  <span className="text-xs text-ink-500 font-bold inline-flex items-center gap-1">
                    <MousePointerClick className="w-3.5 h-3.5" /> النقرات الملتقطة
                  </span>
                  <strong className="block mt-1 text-2xl font-black text-ink-950">
                    {adStats.totals.clicks.toLocaleString('ar-SA')}
                  </strong>
                </div>

                <div className="rounded-xl bg-paper-2/60 p-4 border border-line">
                  <span className="text-xs text-ink-500 font-bold">معدل التفاعل CTR</span>
                  <strong className="block mt-1 text-2xl font-black text-emerald-700">
                    {adStats.totals.ctr.toFixed(2)}%
                  </strong>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SOCIAL MEDIA ACCOUNTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl border border-line shadow-soft p-6 space-y-6">
              <div className="border-b border-line pb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-black text-ink-950 text-base flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-600" />
                    <span>إدارة روابط حسابات وقنوات التواصل الاجتماعي</span>
                  </h2>
                  <p className="text-xs text-ink-500">
                    الروابط التي تضعها هنا ستظهر تلقائياً في شريط الموقع العلوي، والفوتر، وبانرات الاشتراك
                  </p>
                </div>
                <span className="text-xs text-ink-400 font-bold">تحديث فوري على كامل الموقع</span>
              </div>

              <form onSubmit={saveSocialSettings} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Telegram */}
                  <div className="space-y-1">
                    <label className="font-bold text-ink-900 flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-sky-500" />
                      <span>رابط قناة التيليجرام (Telegram Channel)</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={socialSettings.telegramUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, telegramUrl: e.target.value })}
                      placeholder="https://t.me/your_channel"
                      className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-[11px] dir-ltr text-right"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1">
                    <label className="font-bold text-ink-900 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>رابط قناة أو مجتمع الواتساب (WhatsApp Community/Channel)</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={socialSettings.whatsappUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, whatsappUrl: e.target.value })}
                      placeholder="https://whatsapp.com/channel/..."
                      className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-[11px] dir-ltr text-right"
                    />
                  </div>

                  {/* X (Twitter) */}
                  <div className="space-y-1">
                    <label className="font-bold text-ink-900 flex items-center gap-1.5">
                      <span className="font-mono text-sm font-black">𝕏</span>
                      <span>رابط حساب منصة إكس (Twitter)</span>
                    </label>
                    <input
                      type="url"
                      value={socialSettings.xUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, xUrl: e.target.value })}
                      placeholder="https://x.com/your_account"
                      className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-[11px] dir-ltr text-right"
                    />
                  </div>

                  {/* TikTok */}
                  <div className="space-y-1">
                    <label className="font-bold text-ink-900 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-pink-600" />
                      <span>رابط حساب تيك توك (TikTok)</span>
                    </label>
                    <input
                      type="url"
                      value={socialSettings.tiktokUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, tiktokUrl: e.target.value })}
                      placeholder="https://tiktok.com/@your_account"
                      className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-[11px] dir-ltr text-right"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="space-y-1">
                    <label className="font-bold text-ink-900 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-rose-500" />
                      <span>رابط حساب إنستغرام (Instagram)</span>
                    </label>
                    <input
                      type="url"
                      value={socialSettings.instagramUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/your_account"
                      className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-[11px] dir-ltr text-right"
                    />
                  </div>

                  {/* Snapchat */}
                  <div className="space-y-1">
                    <label className="font-bold text-ink-900 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-amber-500" />
                      <span>رابط حساب سناب شات (Snapchat)</span>
                    </label>
                    <input
                      type="url"
                      value={socialSettings.snapchatUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, snapchatUrl: e.target.value })}
                      placeholder="https://snapchat.com/add/your_account"
                      className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-[11px] dir-ltr text-right"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-line">
                  <p className="text-xs font-bold text-emerald-700">{socialSettingsMessage}</p>
                  <button
                    type="submit"
                    disabled={savingSocialSettings}
                    className="px-6 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-ink-950 font-black rounded-xl shadow-soft transition disabled:opacity-50"
                  >
                    {savingSocialSettings ? 'جاري الحفظ...' : 'حفظ روابط حسابات التواصل'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CONTACT MESSAGES & REPORTS */}
        {/* ========================================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-ink-950">الرسائل والبلاغات</h2>
                <p className="text-xs text-ink-500">متابعة الاستفسارات والبلاغات الواردة من صفحة اتصل بنا</p>
              </div>
              <button
                onClick={loadContactMessages}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-line bg-white text-xs font-bold text-ink-700"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث
              </button>
            </div>

            {contactMessages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-line p-10 text-center text-sm text-ink-500">
                لا توجد رسائل واردة حتى الآن.
              </div>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((item) => (
                  <article key={item.id} className="bg-white rounded-2xl border border-line p-5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black ${item.category === 'report' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                            {item.category === 'report' ? 'بلاغ عن إعلان' : 'استفسار'}
                          </span>
                          <h3 className="font-black text-sm text-ink-950">{item.subject}</h3>
                        </div>
                        <p className="text-xs text-ink-500 mt-1">
                          {item.name} · <span dir="ltr">{item.email}</span>
                        </p>
                      </div>
                      <time className="text-[11px] text-ink-400" dir="ltr">
                        {new Date(item.created_at).toLocaleString('ar-SA')}
                      </time>
                    </div>
                    <p className="text-sm text-ink-700 leading-7 whitespace-pre-wrap">{item.message}</p>
                    {item.job_url && (
                      <a href={item.job_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline">
                        فتح الإعلان المبلغ عنه
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(['new', 'in_progress', 'resolved'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateContactMessageStatus(item.id, status)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${item.status === status ? 'bg-ink-950 text-white border-ink-950' : 'bg-white text-ink-600 border-line'}`}
                        >
                          {status === 'new' ? 'جديدة' : status === 'in_progress' ? 'قيد المتابعة' : 'تمت المعالجة'}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: MAINTENANCE & AUDIT LOGS */}
        {/* ========================================================================= */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-black text-ink-950 text-base flex items-center gap-2">
                  <Database className="w-5 h-5 text-saffron-600" />
                  مزامنة قاعدة البيانات السحابية (Supabase)
                </h3>
                <p className="text-xs text-ink-500 leading-relaxed">
                  تتيح لك إعادة ملء ومزامنة جميع الوظائف التأسيسية الـ 12 المعتمدة في كافة القطاعات (حكومية، عسكرية، شركات، تدريب، نتائج).
                </p>
              </div>

              <button
                onClick={handleSeedJobs}
                disabled={seeding}
                className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-ink-950 font-black text-xs shadow-soft transition disabled:opacity-50 shrink-0"
              >
                {seeding ? 'جاري المزامنة...' : 'مزامنة الوظائف التأسيسية الآن'}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-ink-950 text-base">سجل العمليات الإدارية (Audit Trail)</h3>
                  <p className="text-xs text-ink-500">تدوين كل عملية إضافة أو تعديل أو حذف أو بث تم إجراؤها</p>
                </div>
                <span className="text-xs text-ink-400 font-bold">آخر 30 عملية</span>
              </div>

              {auditLogs.length > 0 ? (
                <div className="divide-y divide-line/60">
                  {auditLogs.slice(0, 15).map((log) => {
                    const labels: Record<string, string> = {
                      create_job: 'إضافة وظيفة جديدة',
                      update_job: 'تعديل بيانات وظيفة',
                      delete_job: 'حذف إعلان وظيفي',
                      upload_logo: 'رفع شعار جهة عمل',
                      publish_telegram: 'بث في قناة التيليجرام',
                      seed_jobs: 'مزامنة البيانات التأسيسية',
                      update_settings: 'تحديث الإعدادات',
                    };
                    return (
                      <div key={log.id} className="flex items-center justify-between gap-3 py-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-saffron-500" />
                          <span className="font-bold text-ink-900">{labels[log.action] || log.action}</span>
                        </div>
                        <span className="text-ink-400 text-[11px] font-mono">
                          {new Date(log.created_at).toLocaleString('ar-SA')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-ink-500 py-4 text-center">لا توجد عمليات مسجلة حتى الآن.</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT / DUPLICATE JOB */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-lift border border-line">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-lg font-black text-ink-950">
                  {editingJob ? 'تعديل الإعلان الوظيفي' : duplicatingJob ? 'نسخ إعلان كإعلان جديد' : 'إضافة إعلان وظيفي جديد'}
                </h3>
                <p className="text-xs text-ink-500">أدخل تفاصيل الوظيفة أو استخدم قالباً سريعاً لملء البيانات فورياً</p>
              </div>
              <button
                onClick={() => {
                  if (!savingJob) setModalOpen(false);
                }}
                disabled={savingJob}
                className="text-ink-400 hover:text-ink-950 text-xl font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates Bar */}
            <div className="bg-paper-2/70 p-3.5 rounded-2xl border border-line space-y-2">
              <span className="text-xs font-bold text-ink-700 block">⚡ تعبئة سريعة بقالب جاهز (توفير الوقت):</span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyTemplate('government')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-line text-xs font-bold text-ink-800 hover:bg-emerald-50 hover:border-emerald-300 transition"
                >
                  🏛️ وظيفة حكومية
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('military')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-line text-xs font-bold text-ink-800 hover:bg-amber-50 hover:border-amber-300 transition"
                >
                  ⚔️ وظيفة عسكرية
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('corporate')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-line text-xs font-bold text-ink-800 hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  🏢 شركات كبرى
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('training')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-line text-xs font-bold text-ink-800 hover:bg-purple-50 hover:border-purple-300 transition"
                >
                  🎓 تدريب منتهي بالتوظيف
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('results')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-line text-xs font-bold text-ink-800 hover:bg-rose-50 hover:border-rose-300 transition"
                >
                  📢 نتائج قبول
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink-800 mb-1">عنوان الإعلان الوظيفي *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: شركة أرامكو السعودية تعلن فتح باب التوظيف لحملة كافة المؤهلات..."
                  className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl focus:bg-white focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-300/20 text-ink-950 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink-800 mb-1">اسم الجهة أو الشركة *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="مثال: وزارة الحرس الوطني"
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl focus:bg-white focus:border-saffron-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-800 mb-1">شعار الجهة (رفع من الجهاز أو رابط)</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      list="saved-logo-name-options"
                      value={logoAssetName}
                      onChange={(e) => {
                        const name = e.target.value;
                        setLogoAssetName(name);
                        const saved = logoLibrary.find(
                          (item) => item.name.toLowerCase() === name.toLowerCase()
                        );
                        if (saved) {
                          removeLogoFile();
                          setFormData((prev) => ({ ...prev, companyLogo: saved.url }));
                        }
                      }}
                      placeholder="اسم الشعار للحفظ وإظهاره لاحقًا، مثال: أرامكو"
                      className="w-full p-2 bg-paper-2/40 border border-line rounded-xl text-[11px]"
                    />
                    <datalist id="saved-logo-name-options">
                      {logoLibrary.map((item) => (
                        <option key={item.url} value={item.name} />
                      ))}
                    </datalist>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-between gap-2 px-3 py-2 border border-dashed border-saffron-300 bg-saffron-50/50 hover:bg-saffron-50 rounded-xl cursor-pointer text-[11px] font-bold text-saffron-900 transition">
                        <span className="truncate">
                          {logoFile ? `ملف مختار: ${logoFile.name}` : '📁 اختر شعاراً من جهازك (JPG/PNG/WEBP)'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleLogoFileSelect}
                        />
                        <span className="px-2 py-0.5 rounded-md bg-saffron-500 text-ink-950 text-[10px] font-black shrink-0">
                          تصفح
                        </span>
                      </label>

                      {logoPreviewUrl && (
                        <div className="relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logoPreviewUrl}
                            alt="Preview"
                            className="w-10 h-10 rounded-xl object-contain border border-line bg-white p-1"
                          />
                          <button
                            type="button"
                            onClick={removeLogoFile}
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]"
                            title="إلغاء الملف"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      value={formData.companyLogo}
                      onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                      placeholder="أو الصق رابط الشعار المباشر: https://..."
                      className="w-full p-2 bg-paper-2/40 border border-line rounded-xl text-[11px]"
                    />

                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
                      <span className="text-[10px] text-ink-400 font-bold shrink-0">شعارات جاهزة:</span>
                      {PRESET_LOGOS.map((pl) => (
                        <button
                          key={pl.name}
                          type="button"
                          onClick={() => {
                            removeLogoFile();
                            setFormData((prev) => ({ ...prev, companyLogo: pl.url }));
                          }}
                          className="px-2 py-0.5 rounded-lg bg-paper-2 hover:bg-line border border-line text-[10px] font-bold text-ink-700 whitespace-nowrap transition"
                        >
                          {pl.name}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-xl border border-line bg-white p-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-ink-500 font-bold shrink-0">مكتبة الشعارات:</span>
                        <input
                          type="search"
                          value={logoLibrarySearch}
                          onChange={(e) => setLogoLibrarySearch(e.target.value)}
                          placeholder="ابحث بالاسم..."
                          className="flex-1 min-w-0 p-1.5 border border-line rounded-lg text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={loadLogoLibrary}
                          className="px-2 py-1.5 rounded-lg bg-paper-2 border border-line text-[10px] font-bold"
                        >
                          تحديث
                        </button>
                      </div>

                      {logoLibrary.length === 0 ? (
                        <p className="text-[10px] text-ink-400 py-2 text-center">لا توجد شعارات مخزنة بعد.</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto">
                          {logoLibrary
                            .filter((item) =>
                              item.name.toLowerCase().includes(logoLibrarySearch.toLowerCase().trim())
                            )
                            .map((item) => (
                              <div
                                key={item.url}
                                className="group min-w-0 p-2 rounded-xl border border-line hover:border-saffron-400 hover:bg-saffron-50/40 transition"
                                title={item.name}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeLogoFile();
                                    setLogoAssetName(item.name);
                                    setFormData((prev) => ({ ...prev, companyLogo: item.url }));
                                  }}
                                  className="block w-full"
                                  title={`استيراد ${item.name} إلى الإعلان`}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-10 h-10 mx-auto object-contain"
                                    loading="lazy"
                                  />
                                  <span className="block mt-1 truncate text-[9px] font-bold text-ink-700">
                                    {item.name}
                                  </span>
                                  <span className="block mt-1 text-[8px] text-saffron-700 font-bold">استيراد إلى الإعلان</span>
                                </button>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => renameLogoLibraryItem(item)}
                                    className="px-1.5 py-0.5 rounded bg-paper-2 text-[8px] font-bold text-ink-600"
                                  >
                                    تسمية
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteLogoLibraryItem(item)}
                                    className="px-1.5 py-0.5 rounded bg-rose-50 text-[8px] font-bold text-rose-700"
                                  >
                                    حذف
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-ink-800 mb-1">القطاع</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value as JobSector })}
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-medium"
                  >
                    <option value="government">وظائف حكومية</option>
                    <option value="military">وظائف عسكرية</option>
                    <option value="corporate">وظائف شركات كبرى</option>
                    <option value="training">تدريب منتهي بالتوظيف</option>
                    <option value="results">نتائج القبول والترشيح</option>
                    <option value="remote">وظائف عن بُعد</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink-800 mb-1">الجنس المستهدف</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-medium"
                  >
                    <option value="both">للجنسين (رجال ونساء)</option>
                    <option value="male">رجال فقط</option>
                    <option value="female">نساء فقط</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink-800 mb-1">حالة الإعلان</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-medium"
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
                <div>
                  <label className="block font-bold text-ink-800 mb-1">المدينة / المقر</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="الرياض، جدة، كافة المناطق..."
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-800 mb-1">تاريخ بداية التقديم</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-ink-800">تاريخ النهاية</label>
                    <div className="flex gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setDaysFromToday(14)}
                        className="text-saffron-700 hover:underline font-bold"
                      >
                        +14 يوم
                      </button>
                      <span>|</span>
                      <button
                        type="button"
                        onClick={() => setDaysFromToday(30)}
                        className="text-saffron-700 hover:underline font-bold"
                      >
                        +30 يوم
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-ink-800 mb-1">المؤهلات (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="ثانوية عامة، دبلوم، بكالوريوس"
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-800 mb-1">الخبرة المطلوبة</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="لا يشترط خبرة / حديثي التخرج..."
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-800 mb-1">الراتب والمزايا المالية</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="رواتب وبدلات مجزية"
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink-800 mb-1">رابط التقديم المباشر *</label>
                  <input
                    type="url"
                    required
                    value={formData.applicationUrl}
                    onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-800 mb-1">رابط المصدر الرسمي</label>
                  <input
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Custom Tags Section */}
              <div className="p-4 rounded-2xl border border-line bg-paper/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-ink-900 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-saffron-600" />
                    <span>وسوم وتصنيفات الوظيفة (Tags)</span>
                  </label>
                  <span className="text-[11px] text-ink-400">تساعد الباحثين ومحركات البحث SEO</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {formData.tags.map((tag, i) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-line text-xs font-bold text-ink-800 shadow-2xs"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="text-ink-400 hover:text-rose-600 ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <span className="text-xs text-ink-400">لا توجد وسوم مضافة بعد. أضف وسماً بالأسفل:</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(tagInput);
                      }
                    }}
                    placeholder="اكتب وسماً ثم اضغط Enter (مثال: عن_بعد، ثانوية_عامة)..."
                    className="flex-1 p-2 bg-white border border-line rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="px-4 py-2 bg-ink-950 text-white rounded-xl text-xs font-bold hover:bg-ink-900 transition"
                  >
                    + إضافة وسم
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-800 mb-1">نبذة سريعة (للبطاقة ونتائج البحث SEO)</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="موجز في جملتين يعرض على بطاقة الإعلان في الصفحة الرئيسية..."
                  className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-ink-800 mb-1">تفاصيل الإعلان والمسميات الوظيفية</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink-800 mb-1">الشروط والمتطلبات (كل شرط بسطر)</label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink-800 mb-1">المزايا والبدلات (كل ميزة بسطر)</label>
                  <textarea
                    rows={3}
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-line space-y-3">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-ink-900">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-saffron-500 rounded"
                    />
                    <span>إعلان مميز (يظهر في صدارة الموقع)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-700">
                    <input
                      type="checkbox"
                      checked={formData.urgent}
                      onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                      className="w-4 h-4 accent-rose-600 rounded"
                    />
                    <span>إعلان عاجل (ينتهي قريباً)</span>
                  </label>
                </div>

                <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-sky-950">
                    <input
                      type="checkbox"
                      checked={autoPublishTelegram}
                      onChange={(e) => setAutoPublishTelegram(e.target.checked)}
                      className="w-4 h-4 accent-sky-600 rounded"
                    />
                    <span className="flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-sky-600" />
                      بث الإعلان تلقائياً في قناة التيليجرام فور حفظه
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={savingJob}
                  className="px-5 py-2.5 bg-paper-2 hover:bg-line text-ink-700 font-bold rounded-xl transition"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={savingJob || uploadingLogo}
                  className="disabled:opacity-60 disabled:cursor-wait px-6 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-ink-950 font-black rounded-xl shadow-soft transition"
                >
                  {savingJob || uploadingLogo
                    ? 'جارٍ الحفظ والرفع...'
                    : editingJob
                      ? 'حفظ التعديلات'
                      : duplicatingJob
                        ? 'نشر النسخة الجديدة'
                        : 'نشر الإعلان الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BROADCAST POPUP WITH MULTI-TEMPLATE SELECTOR */}
      {/* ========================================================================= */}
      {broadcastModalOpen && broadcastJob && (
        <div className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto shadow-lift border border-line">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-ink-950">نشر الإعلان في القنوات والمجموعات</h3>
                  <p className="text-xs text-ink-500">اختر نوع الصيغة التعبيرية الجاهزة للبث</p>
                </div>
              </div>

              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-ink-400 hover:text-ink-950 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Template Selector inside Modal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700 block">اختر نوع وصيغة الرسالة:</label>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {allTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${selectedTemplateId === tmpl.id
                      ? 'bg-ink-950 text-white'
                      : 'bg-paper-2 border border-line text-ink-700 hover:bg-line'
                      }`}
                  >
                    {selectedTemplateId === tmpl.id && <Check className="w-3 h-3 text-saffron-400" />}
                    <span>{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-line pb-2">
              <button
                onClick={() => setBroadcastTab('telegram')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${broadcastTab === 'telegram'
                  ? 'bg-sky-50 text-sky-800 border border-sky-300 font-black'
                  : 'text-ink-500 hover:text-ink-950'
                  }`}
              >
                <Send className="w-4 h-4 text-sky-500" />
                <span>تنسيق قناة التيليجرام</span>
              </button>

              <button
                onClick={() => setBroadcastTab('whatsapp')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${broadcastTab === 'whatsapp'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-black'
                  : 'text-ink-500 hover:text-ink-950'
                  }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>تنسيق مجتمعات الواتساب</span>
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

            {/* Preview Box */}
            <div className="bg-ink-950 text-ink-100 p-5 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto border border-ink-800 selection:bg-saffron-500 selection:text-ink-950">
              {broadcastTab === 'telegram'
                ? renderTemplate(activeTemplate.telegramFormat, broadcastJob, currentOrigin)
                : renderTemplate(activeTemplate.whatsappFormat, broadcastJob, currentOrigin)}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => executeTelegramPublish(broadcastJob, activeTemplate)}
                  disabled={publishingTelegram}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-xl text-xs font-black shadow-soft transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{publishingTelegram ? 'جاري النشر في القناة...' : 'نشر فوري في التيليجرام'}</span>
                </button>

                <button
                  onClick={() => openWhatsAppBroadcast(broadcastJob, activeTemplate)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-soft transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال عبر الواتساب</span>
                </button>
              </div>

              <button
                onClick={() =>
                  copyFormatted(
                    broadcastTab === 'telegram'
                      ? renderTemplate(activeTemplate.telegramFormat, broadcastJob, currentOrigin)
                      : renderTemplate(activeTemplate.whatsappFormat, broadcastJob, currentOrigin),
                    broadcastTab
                  )
                }
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-paper-2 hover:bg-line text-ink-900 rounded-xl text-xs font-bold border border-line transition"
              >
                {copiedType === broadcastTab ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">تم نسخ النص بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ النص المنسق لنشره يدوياً</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TELEGRAM SETTINGS */}
      {/* ========================================================================= */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-lift border border-line">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-ink-950">إعدادات قناة التيليجرام</h3>
                  <p className="text-xs text-ink-500">اربط قناتك بالبوت للنشر المباشر</p>
                </div>
              </div>

              <button
                onClick={() => setSettingsModalOpen(false)}
                className="text-ink-400 hover:text-ink-950 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveSettings} className="space-y-4 text-xs">
              <div className="rounded-xl bg-paper-2 border border-line p-3 text-[11px] text-ink-700 leading-relaxed">
                يتم حفظ توكن البوت في متغير <code>TELEGRAM_BOT_TOKEN</code> على Vercel لحماية المفاتيح.
                احصل عليه عبر بوت <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="font-bold underline text-saffron-700">@BotFather</a>.
              </div>

              <div>
                <label className="block font-bold text-ink-800 mb-1">
                  معرف القناة (Channel ID أو @Username) *
                </label>
                <input
                  type="text"
                  required
                  value={telegramChannelId}
                  onChange={(e) => setTelegramChannelId(e.target.value)}
                  placeholder="مثال: @my_job_channel أو -100123456789"
                  className="w-full p-2.5 bg-paper-2/60 border border-line rounded-xl font-mono text-xs focus:bg-white focus:border-saffron-500 text-right dir-ltr"
                />
                <p className="text-[11px] text-ink-400 mt-1">
                  تأكد من إضافة البوت كـ <strong>مسؤول (Admin)</strong> في القناة مع صلاحية نشر الرسائل.
                </p>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-4 py-2 bg-paper-2 hover:bg-line text-ink-700 font-bold rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-saffron-500 hover:bg-saffron-600 text-ink-950 font-black rounded-xl shadow-soft transition"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}