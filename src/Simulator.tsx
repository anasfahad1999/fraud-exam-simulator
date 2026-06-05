import React, { useState, useEffect, useRef } from "react";
import { quizData } from "./quizData";
import type { MockExamModel, MockExamQuestion } from "./mockExamModels";
import { useAuth } from "./auth/AuthContext";

type AnswerKey = "a" | "b" | "c" | "d";
type Answer = AnswerKey | null;
type Mode = "cover" | "exam" | "result";

const EXAM_DURATION = 150 * 60;
const TRAINING_DURATION = 230 * 60;

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

function ExamWatermark({ name }: { name: string }) {
  const watermarkText = name?.trim() || "متدرب ثغرة";
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      <div className="grid min-h-screen grid-cols-2 gap-10 px-4 py-6 opacity-[0.055] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 45 }).map((_, index) => (
          <div
            key={index}
            className="flex h-24 items-center justify-center whitespace-nowrap text-base font-semibold tracking-wide text-white sm:text-lg"
            style={{ transform: `rotate(${index % 2 === 0 ? -24 : -18}deg)` }}
          >
            {watermarkText}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Simulator({ onBack, model }: { onBack: () => void; model?: MockExamModel }) {
  const { user } = useAuth();
  const watermarkName = user?.name?.trim() || user?.email?.split("@")[0] || "متدرب ثغرة";
  const examQuestions: MockExamQuestion[] = model?.questions ?? (quizData as MockExamQuestion[]);
  const examTitle = model?.title ?? "المحاكي الأول";
  const examDescription = model?.description ?? "النموذج الأول الموجود في الموقع.";
  const [mode, setMode] = useState<Mode>("cover");
  const [trainingMode, setTrainingMode] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>(Array(examQuestions.length).fill(null));
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [reviewMode, setReviewMode] = useState<"wrong" | "all">("wrong");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(EXAM_DURATION);

  const q = examQuestions[current];
  const answered = answers.filter(Boolean).length;
  const progress = Math.round((answered / examQuestions.length) * 100);



  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setMode("cover");
    setTrainingMode(false);
    setAnswers(Array(examQuestions.length).fill(null));
    setCurrent(0);
    setTimeLeft(EXAM_DURATION);
    durationRef.current = EXAM_DURATION;
  }, [model?.id, examQuestions.length]);

  useEffect(() => {
    if (mode === "exam" && !trainingMode && timeLeft > EXAM_DURATION) {
      setTimeLeft(EXAM_DURATION);
      durationRef.current = EXAM_DURATION;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (mode === "exam") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setMode("result");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mode, trainingMode]);

  function startExam(training: boolean) {
    const duration = training ? TRAINING_DURATION : EXAM_DURATION;
    if (timerRef.current) clearInterval(timerRef.current);
    durationRef.current = duration;
    setTrainingMode(training);
    setTimeLeft(duration);
    setAnswers(Array(examQuestions.length).fill(null));
    setCurrent(0);
    setMode("exam");
  }

  function finish() {
    if (timerRef.current) clearInterval(timerRef.current);
    setMode("result");
  }

  function score() {
    return examQuestions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
  }

  const pct = Math.round((score() / examQuestions.length) * 100);
  const pass = pct >= 75;

  // ---- COVER ----
  if (mode === "cover") {
    return (
      <div dir="rtl" className="min-h-screen bg-[#05070B] text-[#E0E1DD] flex flex-col">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 lg:py-24 flex-1 flex flex-col justify-center">

          <button onClick={onBack} className="mb-10 flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition w-fit">
            ← العودة للمنصة
          </button>

          <div className="mb-4 inline-flex items-center gap-3 border-r border-[#415A77] pr-4 text-sm text-zinc-400 w-fit">
            <span className="h-2 w-2 bg-[#415A77]" />
            الاختبارات المهنية
          </div>

          <h1 className="text-5xl font-semibold leading-tight text-[#E0E1DD] md:text-6xl mb-4">
            {examTitle}
            <span className="block text-[#8FA9C4]">FFE</span>
          </h1>

          <p className="text-lg text-zinc-400 leading-9 max-w-2xl mb-4">
            {examQuestions.length} سؤال في هذا النموذج. اختر وضع الاختبار للتقييم الحقيقي، أو وضع التدريب لمراجعة الإجابات فور كل سؤال.
          </p>
          <p className="text-sm text-zinc-500 leading-7 max-w-2xl mb-12">{examDescription}</p>

          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3 mb-10">
            {[
              ["100", "سؤال"],
              ["150", "دقيقة للاختبار"],
              ["75%", "نسبة النجاح"],
            ].map(([val, label]) => (
              <div key={label} className="bg-[#0B0F16] p-7 text-center">
                <div className="text-4xl font-semibold text-white mb-2">{val}</div>
                <div className="text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => startExam(false)}
              className="border border-[#415A77]/40 bg-[#415A77]/15 hover:bg-[#415A77]/25 text-white px-8 py-5 text-lg font-semibold transition"
            >
              بدء الاختبار
              <div className="text-sm text-zinc-400 font-normal mt-1">150 دقيقة — بدون إجابات فورية</div>
            </button>
            <button
              onClick={() => startExam(true)}
              className="border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white px-8 py-5 text-lg font-semibold transition"
            >
              وضع التدريب
              <div className="text-sm text-zinc-400 font-normal mt-1">230 دقيقة — مع شرح كل إجابة</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- RESULT ----
  if (mode === "result") {
    const reviewItems = examQuestions.filter((q, i) => {
      if (reviewMode === "wrong") return answers[i] !== q.correct;
      return true;
    });

    return (
      <div dir="rtl" className="min-h-screen bg-[#05070B] text-[#E0E1DD]">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <button onClick={onBack} className="mb-10 flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition">
            ← العودة للمنصة
          </button>

          <div className={`border p-10 mb-8 text-center ${pass ? "border-green-800/40 bg-green-900/10" : "border-red-800/40 bg-red-900/10"}`}>
            <div className={`text-6xl font-semibold mb-3 ${pass ? "text-green-400" : "text-red-400"}`}>{pct}%</div>
            <div className="text-2xl font-semibold text-white mb-2">{pass ? "اجتزت الاختبار" : "لم تجتز الاختبار"}</div>
            <div className="text-zinc-400">{score()} من {examQuestions.length} إجابة صحيحة — الأسئلة المجابة: {answered} من {examQuestions.length}</div>
          </div>

          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3 mb-10">
            {[
              ["الصحيحة", String(score()), "text-green-400"],
              ["الخاطئة", String(answered - score()), "text-red-400"],
              ["بدون إجابة", String(examQuestions.length - answered), "text-zinc-400"],
            ].map(([label, val, color]) => (
              <div key={label} className="bg-[#0B0F16] p-6 text-center">
                <div className={`text-3xl font-semibold mb-1 ${color}`}>{val}</div>
                <div className="text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-8 flex-wrap">
            <button
              onClick={() => setReviewMode("wrong")}
              className={`px-5 py-3 text-sm border transition ${reviewMode === "wrong" ? "border-[#415A77]/50 bg-[#415A77]/15 text-white" : "border-white/10 text-zinc-500 hover:text-white"}`}
            >
              الأسئلة الخاطئة فقط
            </button>
            <button
              onClick={() => setReviewMode("all")}
              className={`px-5 py-3 text-sm border transition ${reviewMode === "all" ? "border-[#415A77]/50 bg-[#415A77]/15 text-white" : "border-white/10 text-zinc-500 hover:text-white"}`}
            >
              جميع الأسئلة
            </button>
            <button
              onClick={() => { setMode("cover"); }}
              className="px-5 py-3 text-sm border border-white/10 text-zinc-500 hover:text-white transition mr-auto"
            >
              إعادة الاختبار
            </button>
          </div>

          <div className="grid gap-4">
            {reviewItems.map((q, idx) => {
              const origIdx = examQuestions.indexOf(q);
              const selected = answers[origIdx];
              const correct = selected === q.correct;
              return (
                <div key={q.num} className={`border p-6 ${correct ? "border-green-800/30 bg-green-900/5" : "border-red-800/30 bg-red-900/5"}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`text-xs px-2 py-1 border ${correct ? "border-green-700/40 text-green-400" : "border-red-700/40 text-red-400"}`}>
                      {correct ? "صحيح" : "خطأ"}
                    </span>

                  </div>
                  <div className="text-white font-semibold leading-8 mb-4">{q.question}</div>
                  <div className="grid gap-2 mb-4">
                    {(["a","b","c","d"] as const).map((key) => {
                      const isCorrect = key === q.correct;
                      const isSelected = key === selected;
                      return (
                        <div key={key} className={`px-4 py-3 text-sm border ${
                          isCorrect ? "border-green-700/50 bg-green-900/15 text-green-300" :
                          isSelected && !isCorrect ? "border-red-700/50 bg-red-900/15 text-red-300 line-through" :
                          "border-white/10 text-zinc-500"
                        }`}>
                          {q[key]}
                        </div>
                      );
                    })}
                  </div>
                  {!correct && (
                    <div className="text-sm text-zinc-400">
                      إجابتك: {selected ? q[selected] : "لم تُجب"} &nbsp;|&nbsp; الصحيحة: {q[q.correct]}
                    </div>
                  )}
                  {q.note && (
                    <div className="mt-4 border-r-2 border-[#415A77] pr-4 text-sm text-zinc-400 leading-7">
                      <span className="text-[#8FA9C4] font-semibold">ملاحظة: </span>{q.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---- EXAM ----
  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-[#05070B] text-[#E0E1DD]">
      <ExamWatermark name={watermarkName} />

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#05070B]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <button onClick={onBack} className="text-sm text-zinc-500 hover:text-white transition">← خروج</button>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span>السؤال {current + 1} / {examQuestions.length}</span>
            <span className="h-4 w-px bg-white/10" />
            <span>المجاب: {answered}</span>
            {trainingMode && <span className="border border-[#415A77]/30 bg-[#415A77]/10 text-[#8FA9C4] px-2 py-0.5 text-xs">تدريب</span>}
          </div>
          <div className="font-mono text-lg font-semibold text-white">{formatTime(timeLeft)}</div>
        </div>
        <div className="h-1 bg-white/5">
          <div className="h-full bg-[#415A77] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10 grid gap-6 lg:grid-cols-[1fr_260px]">

        {/* Question */}
        <div>
          <div className="text-xl font-semibold leading-9 text-white mb-8">{q.question}</div>

          <div className="grid gap-3">
            {(["a","b","c","d"] as const).map((key) => {
              const isSelected = answers[current] === key;
              const showFeedback = trainingMode && answers[current] !== null;
              const isCorrect = key === q.correct;

              let cls = "border px-5 py-4 text-sm leading-7 cursor-pointer transition ";
              if (showFeedback) {
                if (isCorrect) cls += "border-green-700/50 bg-green-900/10 text-green-300";
                else if (isSelected) cls += "border-red-700/50 bg-red-900/10 text-red-300";
                else cls += "border-white/10 text-zinc-500";
              } else {
                if (isSelected) cls += "border-[#415A77] bg-[#415A77]/15 text-white";
                else cls += "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white";
              }

              return (
                <div
                  key={key}
                  className={cls}
                  onClick={() => {
                    if (showFeedback) return;
                    const newAnswers = [...answers];
                    newAnswers[current] = key;
                    setAnswers(newAnswers);
                  }}
                >
                  {q[key]}
                </div>
              );
            })}
          </div>

          {/* Training feedback */}
          {trainingMode && answers[current] !== null && (
            <div className={`mt-6 border-r-4 pr-4 py-3 text-sm leading-8 ${answers[current] === q.correct ? "border-green-600 text-green-300" : "border-red-600 text-red-300"}`}>
              <div className="font-semibold mb-1">{answers[current] === q.correct ? "✓ إجابة صحيحة" : "✗ إجابة خاطئة — الصحيحة: " + q[q.correct]}</div>
              {q.note && <div className="text-zinc-400">{q.note}</div>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="px-5 py-3 text-sm border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition"
            >
              ← السابق
            </button>
            <button
              onClick={() => setCurrent((c) => Math.min(examQuestions.length - 1, c + 1))}
              disabled={current === examQuestions.length - 1}
              className="px-5 py-3 text-sm border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition flex-1"
            >
              التالي →
            </button>
            <button
              onClick={() => {
                const unanswered = examQuestions.length - answered;
                const msg = unanswered > 0 ? `باقي ${unanswered} سؤال بدون إجابة. هل تريد الإنهاء؟` : "هل تريد إنهاء الاختبار؟";
                if (window.confirm(msg)) finish();
              }}
              className="px-5 py-3 text-sm border border-[#415A77]/40 bg-[#415A77]/10 text-white hover:bg-[#415A77]/20 transition"
            >
              إنهاء الاختبار
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sticky top-20 self-start">
          <div className="border border-white/10 bg-[#0B0F16] p-5 mb-4">
            <div className="text-xs text-zinc-500 mb-3">شبكة الأسئلة</div>
            <div className="grid grid-cols-5 gap-1.5">
              {examQuestions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-9 text-xs border transition ${
                    i === current ? "border-[#415A77] bg-[#415A77]/20 text-white font-semibold" :
                    answers[i] ? "border-green-800/40 bg-green-900/10 text-green-400" :
                    "border-white/10 text-zinc-500 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#0B0F16] p-5">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-2xl font-semibold text-white">{answered}</div>
                <div className="text-xs text-zinc-500 mt-1">مجاب</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-zinc-400">{examQuestions.length - answered}</div>
                <div className="text-xs text-zinc-500 mt-1">متبقي</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
