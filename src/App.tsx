/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  Gamepad2, 
  Music, 
  Heart, 
  Footprints, 
  CloudMoon, 
  RotateCcw,
  Info,
  Clock,
  LayoutDashboard
} from 'lucide-react';

// --- Types & Constants ---

type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise';

interface Emotions {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
}

interface Stimulus {
  id: string;
  name: string;
  icon: React.ReactNode;
  effect: Partial<Record<EmotionType, number>>;
  description: string;
}

interface Scenario {
  name: string;
  emotions: Emotions;
}

const EMOTION_LABELS: Record<EmotionType, string> = {
  joy: 'Радість',
  sadness: 'Сум',
  anger: 'Злість',
  fear: 'Страх',
  surprise: 'Здивування'
};

const STIMULI: Stimulus[] = [
  { 
    id: 'book',
    name: 'Книжка', 
    icon: <Book className="w-6 h-6" />, 
    effect: { joy: 3, fear: -2, sadness: -1 },
    description: 'Читання розширює світогляд, дарує радість пізнання та зменшує тривожність через фокусування на сюжеті.'
  },
  { 
    id: 'game',
    name: 'Гра', 
    icon: <Gamepad2 className="w-6 h-6" />, 
    effect: { joy: 2, surprise: 1, anger: -1 },
    description: 'Активна гра залучає допитливість та знімає напругу, хоча може викликати легке збудження.'
  },
  { 
    id: 'music',
    name: 'Музика', 
    icon: <Music className="w-6 h-6" />, 
    effect: { joy: 2, anger: -2, fear: -2 },
    description: 'Мелодії та ритми гармонізують внутрішній стан, знижуючи рівень стресових гормонів.'
  },
  { 
    id: 'hugs',
    name: 'Обійми', 
    icon: <Heart className="w-6 h-6" />, 
    effect: { joy: 4, fear: -3, sadness: -2 },
    description: 'Фізичний контакт вивільняє окситоцин — гормон довіри та безпеки.'
  },
  { 
    id: 'move',
    name: 'Рух', 
    icon: <Footprints className="w-6 h-6" />, 
    effect: { joy: 2, anger: -3 },
    description: 'Фізична активність допомагає "виплеснути" накопичену агресію через рух.'
  },
  { 
    id: 'calm',
    name: 'Спокій', 
    icon: <CloudMoon className="w-6 h-6" />, 
    effect: { anger: -2, fear: -2, sadness: 1 },
    description: 'Тиша дозволяє емоціям вщухнути, хоча іноді може трішки посилити відчуття самотності.'
  }
];

const SCENARIOS: Record<string, Scenario> = {
  initial: {
    name: 'Початковий стан',
    emotions: { joy: 2, sadness: 0, anger: 0, fear: 7, surprise: 0 }
  },
  darkness: {
    name: 'Боїться темряви',
    emotions: { joy: 1, sadness: 5, anger: 0, fear: 8, surprise: 0 }
  },
  conflict: {
    name: 'Після конфлікту',
    emotions: { joy: 1, sadness: 6, anger: 7, fear: 0, surprise: 0 }
  },
  school: {
    name: 'Нова школа',
    emotions: { joy: 3, sadness: 0, anger: 0, fear: 6, surprise: 7 }
  }
};

const EMOTION_COLORS: Record<EmotionType, string> = {
  joy: '#facc15',      // yellow-400
  sadness: '#3b82f6',  // blue-500
  anger: '#ef4444',    // red-500
  fear: '#a855f7',     // purple-500
  surprise: '#2dd4bf', // teal-400
};

// --- Components ---

const EmotionFace = ({ emotions }: { emotions: Emotions }) => {
  const dominant = useMemo(() => {
    let max = -1;
    let type: EmotionType = 'joy';
    (Object.entries(emotions) as [EmotionType, number][]).forEach(([key, val]) => {
      if (val > max) {
        max = val;
        type = key;
      }
    });
    return type;
  }, [emotions]);

  // Interpolate features based on values
  const eyeScale = 1 + (emotions.surprise / 10) * 0.5;
  const eyeYOffset = emotions.fear > 5 ? -2 : 0;
  const mouthPath = useMemo(() => {
    const joyVal = emotions.joy;
    const sadVal = emotions.sadness;
    const angerVal = emotions.anger;
    
    if (joyVal > 5) return "M 30 70 Q 50 85 70 70"; // Smile
    if (sadVal > 5) return "M 30 75 Q 50 65 70 75"; // Frown
    if (angerVal > 5) return "M 35 75 L 65 75"; // Intense flat
    return "M 40 75 Q 50 78 60 75"; // Neutral
  }, [emotions]);

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
      <motion.svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-xl"
        initial={false}
        animate={{ scale: 1 + (emotions.surprise / 50) }}
      >
        {/* Face Base */}
        <motion.circle 
          cx="50" cy="50" r="45" 
          fill="white" 
          stroke={EMOTION_COLORS[dominant]} 
          strokeWidth="3"
          animate={{ fill: emotions.anger > 7 ? '#fee2e2' : 'white' }}
        />
        
        {/* Eyes */}
        <motion.g animate={{ y: eyeYOffset }}>
          <motion.circle 
            cx="35" cy="40" r="5" 
            fill="#334155" 
            animate={{ scaleY: eyeScale, scaleX: emotions.fear > 7 ? 0.8 : 1 }}
          />
          <motion.circle 
            cx="65" cy="40" r="5" 
            fill="#334155" 
            animate={{ scaleY: eyeScale, scaleX: emotions.fear > 7 ? 0.8 : 1 }}
          />
        </motion.g>

        {/* Eyebrows */}
        <motion.path 
          d="M 25 32 Q 35 28 45 32" 
          fill="none" 
          stroke="#334155" 
          strokeWidth="2" 
          strokeLinecap="round"
          animate={{ 
            rotate: emotions.anger > 5 ? 15 : emotions.fear > 5 ? -15 : 0,
            y: emotions.surprise > 5 ? -5 : 0
          }}
        />
        <motion.path 
          d="M 55 32 Q 65 28 75 32" 
          fill="none" 
          stroke="#334155" 
          strokeWidth="2" 
          strokeLinecap="round"
          animate={{ 
            rotate: emotions.anger > 5 ? -15 : emotions.fear > 5 ? 15 : 0,
            y: emotions.surprise > 5 ? -5 : 0
          }}
        />

        {/* Mouth */}
        <motion.path 
          d={mouthPath} 
          fill="none" 
          stroke="#334155" 
          strokeWidth="3" 
          strokeLinecap="round"
          animate={{ d: mouthPath }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </motion.svg>
    </div>
  );
};

export default function App() {
  const [emotions, setEmotions] = useState<Emotions>(SCENARIOS.initial.emotions);
  const [history, setHistory] = useState<{ stimulus: string, effect: string }[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const dominantEmotion = useMemo(() => {
    let max = -1;
    let type: EmotionType = 'joy';
    (Object.entries(emotions) as [EmotionType, number][]).forEach(([key, val]) => {
      if (val > max) {
        max = val;
        type = key;
      }
    });
    return type;
  }, [emotions]);

  const updateEmotion = (type: EmotionType, delta: number) => {
    setEmotions(prev => {
      let newVal = prev[type] + delta;
      // Special logic for Sadness in "Calm" scenario as per prompt (+1 сум→0) - interpretation: increases sadness but limited?
      // Actually standard 0-10 logic.
      return {
        ...prev,
        [type]: Math.max(0, Math.min(10, newVal))
      };
    });
  };

  const applyStimulus = (stim: Stimulus) => {
    const effectsList: string[] = [];
    
    setEmotions(prev => {
      const next = { ...prev };
      (Object.entries(stim.effect) as [EmotionType, number][]).forEach(([type, delta]) => {
        next[type] = Math.max(0, Math.min(10, next[type] + delta));
        if (delta !== 0) {
          effectsList.push(`${EMOTION_LABELS[type]} ${delta > 0 ? '+' : ''}${delta}`);
        }
      });
      return next;
    });

    setFeedback(stim.description);
    
    setHistory(prev => [
      { stimulus: stim.name, effect: effectsList.join(', ') },
      ...prev
    ].slice(0, 5));
  };

  const handleScenario = (key: string) => {
    setEmotions(SCENARIOS[key].emotions);
    setFeedback(`Завантажено сценарій: ${SCENARIOS[key].name}`);
  };

  const reset = () => {
    setEmotions(SCENARIOS.initial.emotions);
    setHistory([]);
    setFeedback("Скинуто до початкових значень");
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-700 ease-in-out p-4 md:p-8 flex flex-col font-sans text-slate-800"
      style={{ backgroundColor: `${EMOTION_COLORS[dominantEmotion]}22` }} // Low opacity bg
    >
      <header className="max-w-6xl mx-auto w-full mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" />
              Емоційний конструктор
            </h1>
            <p className="text-slate-600">STEM-симуляція емоційних станів дитини (4–6 років)</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleScenario('darkness')}
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-sm font-medium transition-colors border border-indigo-200"
            >
              🌑 Темрява
            </button>
            <button 
              onClick={() => handleScenario('conflict')}
              className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-sm font-medium transition-colors border border-rose-200"
            >
              ⚡ Конфлікт
            </button>
            <button 
              onClick={() => handleScenario('school')}
              className="px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg text-sm font-medium transition-colors border border-teal-200"
            >
              🏫 Школа
            </button>
            <button 
              onClick={reset}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-lg border border-slate-200 transition-colors shadow-sm"
              title="Новий сценарій"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        {/* Left Column: Visuals & History */}
        <div className="lg:col-span-5 space-y-8">
          {/* Face Display */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white shadow-xl flex flex-col items-center justify-center min-h-[350px]">
            <EmotionFace emotions={emotions} />
            <div className="mt-6 text-center">
              <span className="inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-2" 
                style={{ backgroundColor: EMOTION_COLORS[dominantEmotion], color: 'white' }}>
                {EMOTION_LABELS[dominantEmotion]}
              </span>
              <p className="text-slate-500 italic text-sm">Поточний домінуючий стан</p>
            </div>
          </div>

          {/* Researcher Notes */}
          <section className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-lg">Нотатки дослідника</h2>
            </div>
            <div className="space-y-3 min-h-[160px]">
              <AnimatePresence mode="popLayout">
                {history.length > 0 ? (
                  history.map((item, idx) => (
                    <motion.div 
                      key={`${item.stimulus}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-sm py-2 border-b border-slate-800 last:border-0 flex justify-between items-center"
                    >
                      <span className="font-medium text-slate-300">{item.stimulus}</span>
                      <span className="text-blue-400 font-mono text-xs">{item.effect}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
                    Очікування взаємодій...
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Right Column: Controls & Feedback */}
        <div className="lg:col-span-7 space-y-8">
          {/* Sliders Panel */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
            <h2 className="font-bold text-xl mb-6 text-slate-900 border-b pb-2">Панель емоцій</h2>
            <div className="space-y-6">
              {(Object.entries(emotions) as [EmotionType, number][]).map(([type, val]) => (
                <div key={type} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold text-slate-700 capitalize">
                      {EMOTION_LABELS[type]}
                    </label>
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-600">
                      {val}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="1"
                      value={val}
                      onChange={(e) => updateEmotion(type, parseInt(e.target.value) - val)}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer accent-current"
                      style={{ color: EMOTION_COLORS[type], backgroundColor: '#e2e8f0' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stimuli Panel */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
            <h2 className="font-bold text-xl mb-6 text-slate-900 border-b pb-2">Панель «Стимули»</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {STIMULI.map(stim => (
                <button
                  key={stim.id}
                  onClick={() => applyStimulus(stim)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all group active:scale-95"
                >
                  <div className="mb-2 p-3 bg-slate-50 rounded-xl group-hover:bg-white text-slate-600 group-hover:text-blue-600 transition-colors">
                    {stim.icon}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{stim.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Info */}
          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-600 text-white rounded-3xl p-6 shadow-xl flex gap-4 items-start"
              >
                <div className="bg-white/20 p-2 rounded-xl shrink-0">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Висновок дослідника</h3>
                  <p className="text-sm leading-relaxed text-blue-50 tracking-wide">
                    {feedback}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm max-w-6xl mx-auto w-full">
        <p>© 2026 Емоційний конструктор • Навчальна STEM-модель для 9 класу</p>
      </footer>
    </div>
  );
}
