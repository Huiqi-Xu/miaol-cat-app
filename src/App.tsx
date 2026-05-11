/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Mic, 
  Smile, 
  LayoutList, 
  BookOpen, 
  PawPrint,
  Heart,
  Utensils,
  TriangleAlert,
  ArrowRight,
  Bookmark,
  Share2,
  Camera,
  ChevronRight,
  Volume2,
  Lightbulb,
  History,
  BookHeart
} from 'lucide-react';
import { Tab, CatProfile, TranslationResult } from './types.ts';
import { ENCYCLOPEDIA_ENTRIES, BREEDS } from './constants.ts';

// Mock avatars
const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAoi1PHkL-AJWf7kocs-IgxZ7hM3Q6mpzFtP0yu-p9FfOVX-Sf0N23SdlAjOHpj5AO9TBMs4q_ViNSlaUemCcCtqm-rEXc_DGxvX2lKL_B9ZXJZaYZyFgBs-OXPhIsT8keCOPVMUvcM4WR25XDQEIahLhavMJpcl-CvbT-5T2G4ZBiq6Tj8bwupAs7Kuj1O9y1Pitxvwb7lWtFcWxuS_1-mr5AlkDX83_oTZQyNd2iVr8AKboCXpSg2PXCQXJ4cLX3FJ8XxKtkNTz4F";
const CAT_ILLUSTRATION = "https://lh3.googleusercontent.com/aida-public/AB6AXuC81tKIxUAcCOM58QbEMD8EZBlfTc4Gp7ogLrvOnqW2ezi_QENRxg6lENX3VBr1_AC_VHTdWxQquU1LK6Qt_n5QhuhPjhiGcze3d6dPJBKDXto0_D5heLOzYiTHSooLzJzAJMki6ODcu-bEPP5lZn_MU62CyRQZYlv7f6mLlSUzPs4cQoZqwxHS71CmYv5JIAtE4ZotJQbem55ZqlWLaOx9VgnAlMURtN-MeE-q6GxMqnCFkAXq6BGELp80CCGPuu5J_2mKyrQUS_te";
const HUNGRY_CAT_ILLUSTRATION = "https://lh3.googleusercontent.com/aida-public/AB6AXuCOrVAYngQOQ5grUY8d4uXVQBwwV7YJdYLvO-XBE46X9--6A3jb2RFrRR5EoBr6dKvjtlWfYQVFuw02_hi_Y5crTb7UcL1KN4pz15TwVfgKhQtz_65WP8gUXfetH0JQVIocr6rudGY-SrBadVGrjXoh2xCEiC10EKQ5RoRYsTDEo0_u3ib6Gb1k2tYVEFCPPdn6tnPIkRtxIPLnQvfwMbf1VMl12gAevmPsuwCNPimtlf0pte8p8XczMSjKvSufA9ktu0knmgWH45Ey";
const RESULT_CAT = "https://lh3.googleusercontent.com/aida-public/AB6AXuB-6NmoJK0y9XJiwjBWmksd9GTMMiV51-K82yd9krZM0hb1-Hzj6bUh7T_zEjUGAxCDewDTncXon4LMy9LvUoGJaRWAqM2MH3y54ONsSGPNG5ucWG_c7UNXpzTUYXwHzQ2SSlhJAsCeqh5jFecVQ1keXjPVk7pwMN-u-1nxS2zelT0tmou8XdWRdMdfa6PwWb4RszaOkMbKrEgMQhg33WRSzST-UDd5z5hKBsF-j_mQQu5tJUbTwhIbhT3ALTTAXXmRJdzMGwk_btgB";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('translate');
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [profile, setProfile] = useState<CatProfile>({
    name: "咪咪",
    age: 2,
    personality: ["顽皮 (Naughty)"],
    breed: "orange",
    avatar: BREEDS[0].image
  });

  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const TRANSLATE_TIMEOUT_MS = 45_000;

  const startRecording = async () => {
    setTranslateError(null);
    setIsRecording(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({profile}),
        signal: controller.signal,
      });
      const raw: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          raw &&
          typeof raw === 'object' &&
          'error' in raw &&
          typeof (raw as {error: unknown}).error === 'string'
            ? (raw as {error: string}).error
            : `请求失败（${res.status}）`;
        throw new Error(msg);
      }
      if (
        !raw ||
        typeof raw !== 'object' ||
        typeof (raw as {translation: unknown}).translation !== 'string' ||
        typeof (raw as {mood: unknown}).mood !== 'string' ||
        !Array.isArray((raw as {tips: unknown}).tips)
      ) {
        throw new Error('返回数据格式异常');
      }
      const data = raw as TranslationResult;
      setTranslationResult({
        translation: data.translation,
        mood: data.mood,
        confidence: typeof data.confidence === 'number' ? data.confidence : 0.8,
        tag: typeof data.tag === 'string' ? data.tag : '喵语解析',
        tips: data.tips.filter((t): t is string => typeof t === 'string'),
      });
      setShowResult(true);
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        setTranslateError(
          '请求超时：请确认已运行 npm run dev:full（或同时开着 API），且本机 3001 端口可访问。',
        );
      } else {
        setTranslateError(e instanceof Error ? e.message : '翻译失败，请稍后重试');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F4] relative overflow-x-hidden flex flex-col items-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[420px] bg-white/40 min-h-screen flex flex-col relative shadow-2xl">
        
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-surface-container/50">
          <div className="flex items-center gap-2">
            <PawPrint className="text-primary fill-primary size-7" />
            <h1 className="font-heading text-xl text-primary font-bold">喵了个咪</h1>
          </div>
          <div className="size-9 rounded-full border-2 border-primary-container overflow-hidden active:scale-95 transition-transform cursor-pointer">
            <img src={USER_AVATAR} alt="Profile" className="size-full object-cover" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 pb-32">
          <AnimatePresence mode="wait">
            {activeTab === 'translate' && !showResult && (
              <motion.div
                key="translate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center"
              >
                {/* Hero Illustration */}
                <div className="relative size-64 bg-surface-container-low rounded-full flex items-center justify-center shadow-lg border-8 border-white mb-10">
                  <img src={CAT_ILLUSTRATION} alt="Cat" className="size-full object-cover rounded-full" />
                  <div className="absolute -top-3 -right-3 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label text-xs shadow-md rotate-12">
                    喵？
                  </div>
                </div>

                <div className="text-center space-y-2 mb-12">
                  <h2 className="font-heading text-2xl text-on-surface font-bold">Hi, {profile.name}</h2>
                  <p className="font-sans text-base text-on-surface-variant">准备好听懂主子的心声了吗？</p>
                </div>

                {/* Pulsar Orb */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-primary-container rounded-full blur-2xl opacity-30"
                  />
                  <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`relative size-28 bg-primary-container text-on-primary-container rounded-full flex flex-col items-center justify-center shadow-xl border-b-4 border-primary transition-all duration-300 ease-out orb-glow active:scale-95 ${isRecording ? 'opacity-80' : 'hover:opacity-95'}`}
                  >
                    <Mic className="size-9 mb-1 fill-on-primary-container" />
                    <span className="font-label text-xs font-bold">{isRecording ? '正在听' : '开始'}</span>
                  </button>
                  <p className="mt-6 font-label font-bold uppercase tracking-widest text-primary text-sm">
                    {isRecording ? '倾听中...' : '点击开始录音'}
                  </p>
                  {translateError ? (
                    <p className="mt-4 text-center text-sm text-red-600 px-2 leading-relaxed">{translateError}</p>
                  ) : null}
                </div>
              </motion.div>
            )}

            {activeTab === 'translate' && showResult && translationResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-full bg-white rounded-xl p-6 mb-10 text-center squishy-card bubble-tail border-2 border-primary-fixed">
                    <span className="font-label text-xs text-primary uppercase block mb-1">喵语翻译结果</span>
                    <p className="font-heading text-2xl text-on-surface font-bold">{translationResult.translation}</p>
                    <div className="absolute -top-4 -right-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label text-[10px] shadow-sm rotate-12">
                      {translationResult.tag}
                    </div>
                  </div>
                  <div className="size-20 relative">
                    <img src={RESULT_CAT} alt="Result Cat" className="size-full object-cover rounded-full border-4 border-white shadow-md" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-surface-container rounded-xl p-5 squishy-card border-b-4 border-primary-container relative overflow-hidden">
                    <Smile className="absolute -top-1 -left-1 size-16 opacity-5 text-primary fill-primary" />
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <h3 className="font-heading text-lg text-primary font-bold">情绪分析</h3>
                      <div className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-label text-[10px]">
                        实时更新
                      </div>
                    </div>
                    <div className="flex items-end gap-3 relative z-10">
                      <Utensils className="text-primary size-10 fill-primary" />
                      <div>
                        <p className="font-heading text-2xl text-on-surface font-bold">{translationResult.mood}</p>
                        <p className="font-sans text-xs text-on-surface-variant">当前心境：急切的食客</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-high rounded-xl p-5 squishy-card">
                    <h3 className="font-heading text-lg text-primary font-bold mb-3 flex items-center gap-2">
                      <Lightbulb className="size-4" />
                      互动建议
                    </h3>
                    <ul className="space-y-3">
                      {translationResult.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="bg-primary text-white rounded-full size-4 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5 font-bold">
                            {i + 1}
                          </span>
                          <p className="text-on-surface-variant text-xs leading-relaxed">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={() => setShowResult(false)}
                    className="w-full bg-primary text-on-primary font-heading text-base py-4 rounded-xl shadow-[0px_4px_0px_#6d3a00] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <BookHeart className="size-5" />
                    记入猫咪日记
                  </button>
                  <button className="w-full bg-white border-2 border-primary-container text-primary font-heading text-base py-4 rounded-xl active:bg-surface-container transition-colors flex items-center justify-center gap-2">
                    <Share2 className="size-5" />
                    分享给猫友
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'encyclopedia' && (
              <motion.div
                key="encyclopedia"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="font-heading text-2xl text-on-surface font-bold">喵语百科</h2>
                  <p className="text-on-surface-variant text-sm px-4">探索主子们每声叫唤背后的奥秘，让沟通变得更贴心。</p>
                  <div className="relative mx-auto mt-6">
                    <input
                      type="text"
                      placeholder="搜索猫叫声..."
                      className="w-full h-12 pl-12 pr-6 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary-container text-on-surface text-sm outline-none shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant size-5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {ENCYCLOPEDIA_ENTRIES.map((entry) => (
                    <div
                      key={entry.id}
                      className="group relative bg-white p-5 rounded-xl shadow-sm border border-surface-variant/30 active:scale-[0.98] transition-all"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`size-10 rounded-lg flex items-center justify-center bg-${entry.color}`}>
                          {entry.id === 'happy' && <Smile className="size-6 text-primary" />}
                          {entry.id === 'hungry' && <Utensils className="size-6 shadow-sm" />}
                          {entry.id === 'warning' && <TriangleAlert className="size-6" />}
                          {entry.id === 'mating' && <Heart className="size-6" />}
                        </div>
                        <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full text-[10px] font-label">
                          {entry.moodTag}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-bold mb-1">{entry.title}</h3>
                      <p className="text-on-surface-variant text-xs leading-relaxed mb-4">
                        {entry.description}
                      </p>
                      <div className="flex items-center gap-1 text-primary font-bold text-xs">
                        <span>查看详情</span>
                        <ArrowRight className="size-3" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-surface-container p-6 rounded-xl flex flex-col items-center gap-4 text-center">
                  <div className="space-y-1">
                    <h2 className="font-heading text-lg text-on-surface font-bold">还没听出主子的意思？</h2>
                    <p className="text-on-surface-variant text-xs">试试我们的 AI 即时翻译功能</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('translate')}
                    className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-heading text-base font-bold flex items-center gap-2 shadow-[0px_3px_0px_#6d3a00] active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <Mic className="size-5" />
                    立即翻译
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'archive' && (
              <motion.div
                key="archive"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="size-40 rounded-full bg-surface-container flex items-center justify-center shadow-lg border-4 border-primary-container overflow-hidden">
                      <img src={BREEDS.find(b => b.id === profile.breed)?.image || BREEDS[0].image} alt="Cat" className="size-32 object-contain" />
                      <div className="absolute bottom-1 right-5 bg-secondary text-white p-1.5 rounded-full shadow-md">
                        <Camera className="size-5" />
                      </div>
                    </div>
                  </div>
                  <h2 className="font-heading text-xl text-primary font-bold">编辑喵星人档案</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <label className="font-label text-xs text-on-surface-variant px-2">喵咪名字</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-surface-container-low rounded-xl px-5 py-3 outline-none font-heading text-base transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label text-xs text-on-surface-variant px-2">喵咪年龄 (岁)</label>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                      className="w-full bg-surface-container-low rounded-xl px-5 py-3 outline-none font-heading text-base transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="font-label text-xs text-on-surface-variant px-2">性格基因</label>
                    <div className="flex flex-wrap gap-2">
                      {["顽皮", "害羞", "甜蜜"].map(trait => (
                        <button
                          key={trait}
                          onClick={() => {
                            const newTraits = profile.personality.includes(trait) 
                              ? profile.personality.filter(t => t !== trait)
                              : [...profile.personality, trait];
                            setProfile({ ...profile, personality: newTraits });
                          }}
                          className={`px-5 py-2.5 rounded-full font-label text-xs transition-all active:scale-95 ${profile.personality.includes(trait) ? 'bg-secondary text-white shadow-sm' : 'bg-surface-container border border-secondary text-secondary'}`}
                        >
                          {trait}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-label text-xs text-on-surface-variant px-2">选择品种</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {BREEDS.map(breed => (
                      <div
                        key={breed.id}
                        onClick={() => setProfile({ ...profile, breed: breed.id as any })}
                        className={`bg-white p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${profile.breed === breed.id ? 'border-primary-container bg-primary-container/5' : 'border-transparent shadow-sm'}`}
                      >
                        <div className="size-20 bg-surface-container rounded-lg flex items-center justify-center p-2">
                          <img src={breed.image} alt={breed.name} className="size-full object-contain" />
                        </div>
                        <span className={`font-label text-[10px] ${profile.breed === breed.id ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{breed.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-primary text-white font-heading text-lg py-4 rounded-full shadow-[0px_6px_0px_#6d3a00] active:translate-y-1 active:shadow-none transition-all">
                  保存喵档案
                </button>
              </motion.div>
            )}

            {activeTab === 'mood' && (
              <motion.div
                key="mood"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-surface-container p-6 rounded-xl text-center space-y-3">
                  <div className="size-20 bg-primary-container rounded-full mx-auto flex items-center justify-center shadow-md">
                     <History className="size-10 text-white" />
                  </div>
                  <h2 className="font-heading text-xl font-bold">近期心情回顾</h2>
                  <p className="text-on-surface-variant text-xs">你和 {profile.name} 近 7 天进行了 24 次交流。</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-bold px-2 border-l-4 border-primary-container">心情热值图</h3>
                  <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-end h-28 px-2 gap-1.5">
                      {[40, 70, 90, 60, 80, 100, 75].map((val, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${val}%` }}
                            className="w-full max-w-[12px] bg-primary-container rounded-t-full"
                          />
                          <span className="text-[10px] font-label text-on-surface-variant">
                            {['一', '二', '三', '四', '五', '六', '日'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                 <div className="space-y-3">
                  <h3 className="font-heading text-lg font-bold px-2 border-l-4 border-primary-container">发声详解</h3>
                  <div className="space-y-2">
                    {[
                      { t: "短促的“喵”", d: "见到主人时的打招呼。" },
                      { t: "颤动的“喵呜”", d: "友好的欢迎或想要撒娇。" },
                      { t: "持续的“喵——”", d: "表示强烈不满。" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl flex items-center justify-between active:bg-surface-container transition-colors shadow-sm">
                        <div className="flex items-center gap-3">
                          <Volume2 className="text-primary size-4" />
                          <div>
                            <h4 className="font-label text-xs font-bold">{item.t}</h4>
                            <p className="text-[10px] text-on-surface-variant font-sans">{item.d}</p>
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-outline" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Nav Fixed inside Frame */}
        <nav className="absolute bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md px-4 pt-3 safe-bottom shadow-[0px_-2px_15px_rgba(255,159,67,0.1)] rounded-t-2xl flex justify-around items-center border-t border-surface-container/30">
          <NavButton 
            active={activeTab === 'translate'} 
            onClick={() => {
              setActiveTab('translate');
              setShowResult(false);
              setTranslateError(null);
            }}
            icon={<Mic className="size-5" />}
            label="翻译"
          />
          <NavButton 
            active={activeTab === 'mood'} 
            onClick={() => setActiveTab('mood')}
            icon={<Smile className="size-5" />}
            label="心情"
          />
          <NavButton 
            active={activeTab === 'archive'} 
            onClick={() => setActiveTab('archive')}
            icon={<LayoutList className="size-5" />}
            label="档案"
          />
          <NavButton 
            active={activeTab === 'encyclopedia'} 
            onClick={() => setActiveTab('encyclopedia')}
            icon={<BookOpen className="size-5" />}
            label="百科"
          />
        </nav>

        {/* Background Decorative Paws (Absolute to Frame) */}
        <div className="absolute top-1/2 -left-8 pointer-events-none opacity-5">
          <PawPrint className="size-24 text-primary rotate-45 fill-primary" />
        </div>
        <div className="absolute bottom-24 -right-8 pointer-events-none opacity-5">
          <PawPrint className="size-24 text-primary -rotate-12 fill-primary" />
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 active:scale-90 ${active ? 'bg-primary-container text-on-primary-container scale-110 shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
    >
      <div className={`${active ? 'fill-current' : ''}`}>
        {icon}
      </div>
      <span className="font-label text-[10px] mt-1 font-bold">{label}</span>
    </button>
  );
}

