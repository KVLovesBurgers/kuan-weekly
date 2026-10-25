import raw from "@/data/quiz-questions.json";

export type QuizSubject = "數A" | "數B";
export type QuizQuestion = {
  id: string;
  subject: QuizSubject;
  unit: string;
  stem: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type PublicQuestion = Omit<QuizQuestion, "answer" | "explanation">;

const ALL = raw as QuizQuestion[];
export const QUIZ_SUBJECTS: QuizSubject[] = ["數A", "數B"];

export function cleanSubject(v: unknown): QuizSubject | "" {
  return v === "數A" || v === "數B" ? v : "";
}
export function quizQuestions(subject: QuizSubject) {
  return ALL.filter((q) => q.subject === subject);
}
export function publicQuestions(subject: QuizSubject): PublicQuestion[] {
  return quizQuestions(subject).map(({ answer: _a, explanation: _e, ...rest }) => rest);
}

export type QuizResult = {
  subject: QuizSubject;
  score: number;
  total: number;
  units: { unit: string; correct: number; total: number }[];
  weak: string[];
  items: { id: string; unit: string; stem: string; options: string[]; chosen: number; answer: number; correct: boolean; explanation: string }[];
};

export function gradeQuiz(subject: QuizSubject, answers: Record<string, number>): QuizResult {
  const qs = quizQuestions(subject);
  const items = qs.map((q) => {
    const chosen = Number(answers[q.id]) || 0;
    return { id: q.id, unit: q.unit, stem: q.stem, options: q.options, chosen, answer: q.answer, correct: chosen === q.answer, explanation: q.explanation };
  });
  const map = new Map<string, { unit: string; correct: number; total: number }>();
  for (const it of items) {
    const u = map.get(it.unit) ?? { unit: it.unit, correct: 0, total: 0 };
    u.total += 1;
    if (it.correct) u.correct += 1;
    map.set(it.unit, u);
  }
  const units = [...map.values()];
  const weak = units.filter((u) => u.correct < u.total).sort((a, b) => a.correct / a.total - b.correct / b.total).map((u) => u.unit);
  return { subject, score: items.filter((i) => i.correct).length, total: items.length, units, weak, items };
}
