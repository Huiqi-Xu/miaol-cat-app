import {GoogleGenAI} from '@google/genai';

export type CatProfileInput = {
  name: string;
  age: number;
  personality: string[];
  breed: string;
};

export type TranslationPayload = {
  translation: string;
  mood: string;
  confidence: number;
  tips: string[];
  tag: string;
};

const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

function stripJsonFence(text: string): string {
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return t.trim();
}

function coerceResult(raw: unknown): TranslationPayload {
  if (!raw || typeof raw !== 'object') {
    throw new Error('模型返回格式异常');
  }
  const o = raw as Record<string, unknown>;
  const translation = typeof o.translation === 'string' ? o.translation : '';
  const mood = typeof o.mood === 'string' ? o.mood : '';
  const tag = typeof o.tag === 'string' ? o.tag : '';
  const confidence =
    typeof o.confidence === 'number' && Number.isFinite(o.confidence)
      ? Math.min(1, Math.max(0, o.confidence))
      : 0.8;
  const tips = Array.isArray(o.tips)
    ? o.tips.filter((x): x is string => typeof x === 'string' && x.length > 0)
    : [];
  if (!translation || !mood || tips.length < 1) {
    throw new Error('模型返回字段不完整');
  }
  return {translation, mood, confidence, tips: tips.slice(0, 5), tag: tag || '喵语解析'};
}

/** 未配置 GEMINI_API_KEY 时走本地占位数据，便于不接密钥也能打通前后端联调。 */
function mockTranslation(profile: CatProfileInput): TranslationPayload {
  const traits = profile.personality.length ? profile.personality.join('、') : '未知性格';
  return {
    translation: `「${profile.name}：先摸摸我，再谈别的！」`,
    mood: '72% 撒娇',
    confidence: 0.72,
    tag: '本地演示',
    tips: [
      `档案里是「${traits}」，可先轻声叫名字建立回应。`,
      '未配置 GEMINI_API_KEY：配置 .env.local 后将由 Gemini 生成可变文案。',
    ],
  };
}

export async function translateCatMeow(profile: CatProfileInput): Promise<TranslationPayload> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    return mockTranslation(profile);
  }

  const ai = new GoogleGenAI({apiKey});

  const userBlock = [
    `猫咪档案：名字「${profile.name}」，约 ${profile.age} 岁，性格标签：${profile.personality.join('、') || '未知'}，品种 id：${profile.breed}。`,
    '用户刚刚按下「开始录音」并录到一段猫叫（你听不到真实音频）。请**虚构但合理**地想象这段叫声在表达什么，用幽默温暖的口吻完成「喵语翻译」。',
    '只输出一个 JSON 对象，不要 markdown，不要前后说明文字。字段要求：',
    '- translation: string，中文，用「」包住一句猫的心声，例如「我肚子饿坏啦！」',
    '- mood: string，简短中文情绪标签，可带百分比，例如「85% 撒娇」',
    '- confidence: number，0 到 1 之间的小数',
    '- tag: string，4～8 个字的中文小标签，例如「重点请求!」',
    '- tips: string[]，恰好 2 条中文养猫互动建议，每条不超过 60 字',
  ].join('\n');

  const GEMINI_TIMEOUT_MS = 35_000;
  const response = await Promise.race([
    ai.models.generateContent({
      model: MODEL,
      contents: userBlock,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.95,
        maxOutputTokens: 1024,
      },
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('模型请求超时（35s），请稍后重试')), GEMINI_TIMEOUT_MS);
    }),
  ]);

  const text = response.text;
  if (!text) {
    throw new Error('模型未返回内容');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFence(text));
  } catch {
    throw new Error('模型返回不是合法 JSON');
  }

  return coerceResult(parsed);
}
