import type { LearningRoadmap, QuestionReview, ReportData } from "../types/interview";

const clean = (value: string) => value
  .replace(/^[-*+\s]+/, "")
  .replace(/\*\*/g, "")
  .replace(/`/g, "")
  .trim();

const normalizeTitle = (value: string) => clean(value.replace(/^#{1,6}\s*/, ""))
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

function headingLevel(line: string) {
  return line.match(/^\s*(#{1,6})\s+/)?.[1].length ?? 0;
}

function section(report: string, aliases: string[]) {
  const lines = report.replace(/\r/g, "").split("\n");
  const normalizedAliases = aliases.map(normalizeTitle);
  const start = lines.findIndex((line) => {
    const title = normalizeTitle(line);
    return headingLevel(line) > 0 && normalizedAliases.some((alias) => title === alias || title.startsWith(`${alias} `));
  });
  if (start < 0) return "";
  const level = headingLevel(lines[start]);
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const nextLevel = headingLevel(lines[index]);
    if (nextLevel > 0 && nextLevel <= level) {
      end = index;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n").trim();
}

function labeledBlock(content: string, label: string, nextLabels: string[]) {
  const plain = content.replace(/\*\*/g, "");
  const labelPattern = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nextPattern = nextLabels
    .map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const expression = new RegExp(
    `(?:^|\\n)\\s*(?:[-*+]\\s*)?${labelPattern}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:[-*+]\\s*)?(?:${nextPattern})\\s*:|$)`,
    "i",
  );
  return plain.match(expression)?.[1]?.trim() ?? "";
}

function labeledValue(content: string, labels: string[]) {
  const plain = content.replace(/\*\*/g, "");
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = plain.match(new RegExp(`(?:^|\\n)\\s*(?:[-*+]\\s*)?${escaped}\\s*:\\s*([^\\n]+)`, "i"));
    if (match?.[1]) return clean(match[1]);
  }
  return "";
}

function items(content: string) {
  const cleaned = content
    .split("\n")
    .map(clean)
    .filter((item) => item && !/^[-=_]{3,}$/.test(item) && item.toLowerCase() !== "none");
  if (cleaned.length === 1 && cleaned[0].includes(",")) {
    return cleaned[0].split(",").map(clean).filter(Boolean);
  }
  return cleaned;
}

function parseQuestionReviews(report: string): QuestionReview[] {
  const evaluation = section(report, ["Question-by-Question Evaluation", "Question-by-Question Review"]);
  if (!evaluation) return [];
  const blocks = evaluation.split(/(?=^#{2,6}\s+Question\s+\d+)/gim).filter((block) => /Question\s+\d+/i.test(block));
  const labels = ["Question", "Candidate Answer", "Answer", "Score", "Strengths", "Weaknesses", "Improvement Advice"];

  return blocks.map((block, index) => {
    const heading = block.match(/^#{2,6}\s+(.+)$/m)?.[1];
    const question = labeledBlock(block, "Question", labels.filter((label) => label !== "Question"));
    const answer = labeledBlock(block, "Candidate Answer", ["Score", "Strengths", "Weaknesses", "Improvement Advice"])
      || labeledBlock(block, "Answer", ["Score", "Strengths", "Weaknesses", "Improvement Advice"]);
    const scoreText = labeledBlock(block, "Score", ["Strengths", "Weaknesses", "Improvement Advice"]);
    const scoreMatch = scoreText.match(/\d+(?:\.\d+)?/);
    return {
      title: clean(heading ?? `Question ${index + 1}`),
      question: clean(question),
      answer: answer.trim(),
      score: scoreMatch ? Number(scoreMatch[0]) : null,
      strengths: items(labeledBlock(block, "Strengths", ["Weaknesses", "Improvement Advice"])),
      weaknesses: items(labeledBlock(block, "Weaknesses", ["Improvement Advice"])),
      improvementAdvice: items(labeledBlock(block, "Improvement Advice", ["Question"])),
    };
  });
}

function roadmapSection(content: string, aliases: string[], nextLabels: string[]) {
  const nested = section(`# Personalized Learning Roadmap\n${content}`, aliases);
  if (nested) return items(nested);
  for (const alias of aliases) {
    const value = labeledBlock(content, alias, nextLabels);
    if (value) return items(value);
  }
  return [];
}

export interface ParsedReport {
  candidateLevel: string;
  candidateCategory: string;
  interviewDifficulty: string;
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
  topicsCovered: string[];
  missingSkills: string[];
  questionReviews: QuestionReview[];
  roadmap: LearningRoadmap;
}

interface CreateReportDataInput {
  candidateCategory: string;
  averageScore: number;
  resumeMatchScore: number;
  interviewConfidence: number;
  topicsCovered: string[];
  strengths: string[];
  weaknesses: string[];
  questionReviews?: QuestionReview[];
}

function mergeQuestionReviews(parsed: QuestionReview[], fallback: QuestionReview[] = []) {
  if (!parsed.length) return fallback;

  const merged = parsed.map((review, index) => {
    const backup = fallback[index];
    return {
      ...backup,
      ...review,
      title: review.title || backup?.title || `Question ${index + 1}`,
      topic: review.topic || backup?.topic,
      question: review.question || backup?.question || "",
      answer: review.answer || backup?.answer || "",
      score: review.score ?? backup?.score ?? null,
      strengths: review.strengths.length ? review.strengths : backup?.strengths ?? [],
      weaknesses: review.weaknesses.length ? review.weaknesses : backup?.weaknesses ?? [],
      improvementAdvice: review.improvementAdvice.length
        ? review.improvementAdvice
        : backup?.improvementAdvice ?? [],
    };
  });

  return [...merged, ...fallback.slice(parsed.length)];
}

export function parseReportMarkdown(report: string): ParsedReport {
  const summary = section(report, ["Overall Summary"]);
  const roadmap = section(report, ["Personalized Learning Roadmap"]);
  return {
    candidateLevel: labeledValue(summary || report, ["Candidate Level"]),
    candidateCategory: labeledValue(summary || report, ["Candidate Category"]),
    interviewDifficulty: labeledValue(summary || report, ["Interview Difficulty"]),
    recommendation: labeledValue(summary || report, ["Hiring Recommendation", "Recommendation"])
      || labeledValue(section(report, ["Final Hiring Decision"]), ["Recommendation"]),
    strengths: items(section(report, ["Overall Technical Strengths", "Technical Strengths"])),
    weaknesses: items(section(report, ["Overall Areas to Improve", "Areas to Improve", "Technical Weaknesses"])),
    topicsCovered: items(section(report, ["Topics Covered"])),
    missingSkills: items(section(report, ["Topics Missing", "Missing Skills", "Missing JD Skills"])),
    questionReviews: parseQuestionReviews(report),
    roadmap: {
      immediate: roadmapSection(roadmap, ["Immediate Improvements"], ["Short-Term Learning", "Short Term Learning", "Long-Term Learning", "Long Term Learning"]),
      shortTerm: roadmapSection(roadmap, ["Short-Term Learning", "Short Term Learning"], ["Long-Term Learning", "Long Term Learning"]),
      longTerm: roadmapSection(roadmap, ["Long-Term Learning", "Long Term Learning"], ["Final Hiring Decision"]),
    },
  };
}

export function createReportData(
  report: string,
  input: CreateReportDataInput,
): ReportData {
  const parsed = parseReportMarkdown(report);
  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    candidateCategory: input.candidateCategory || parsed.candidateCategory || "Not specified",
    candidateLevel: parsed.candidateLevel || "Not specified",
    interviewDifficulty: parsed.interviewDifficulty || "Adaptive",
    recommendation: parsed.recommendation || "Review complete",
    topicsCovered: parsed.topicsCovered.length ? parsed.topicsCovered : input.topicsCovered,
    missingSkills: parsed.missingSkills,
    strengths: parsed.strengths.length ? parsed.strengths : input.strengths,
    weaknesses: parsed.weaknesses.length ? parsed.weaknesses : input.weaknesses,
    questionReviews: mergeQuestionReviews(parsed.questionReviews, input.questionReviews),
    roadmap: parsed.roadmap,
    rawReport: report,
  };
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
