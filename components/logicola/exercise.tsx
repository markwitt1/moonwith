"use client";
import React, { useEffect, useState } from "react";
import Option from "./Option";
import { chapters } from "@/app/(logicola)/content";
import Link from "next/link";

interface ExerciseProps {
  questionIdx: number;
  chapter: number;
}

const Exercise: React.FC<ExerciseProps> = ({
  questionIdx = 0,
  chapter = 1,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sessionStorageKey = `chapter-${chapter}-question-${questionIdx}`;

  useEffect(() => {
    const savedAnswer = sessionStorage.getItem(sessionStorageKey);

    if (savedAnswer) {
      setSelectedOptionId(Number(savedAnswer));
      setSubmitted(true);
    }
  }, [sessionStorageKey]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (selectedOptionId !== null) {
      sessionStorage.setItem(sessionStorageKey, selectedOptionId.toString());
    }
  };

  const nextQuestionHref = () => {
    const nextQuestionIdx = questionIdx + 1;
    const basePath = `/logicola/logic/basic-propositional-logic/${
      chapter === 6.1 ? "easier-translations" : "harder-translations"
    }`;
    return `${basePath}/${nextQuestionIdx}`;
  };

  const currentChapter = chapters.find((c) => c.id === chapter);
  const question = currentChapter?.questions[questionIdx];

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="max-w-7xl p-6 bg-white border border-stone-200 rounded-lg mb-6">
      <h3 className="mb-2 text-xl font-bold tracking-tight text-stone-900">
        {questionIdx + 1}.
      </h3>
      <div className="mx-auto w-full max-w-screen-xl p-4">
        <div className="md:flex flex-col md:justify-between gap-5">
          <div className="flex flex-col sm:gap-72 self-center mb-6 text-lg">
            <div>{question.prompt}</div>
          </div>

          {question.options.map((option) => (
            <Option
              isActive={option.id === selectedOptionId}
              isCorrect={option.id === question.correctId}
              showSolution={submitted}
              key={option.id}
              label={option.label}
              onClick={() => setSelectedOptionId(option.id)}
              disabled={submitted}
            />
          ))}
        </div>
      </div>
      <hr className="h-px my-4 bg-stone-200 border-0" />
      <div className="flex justify-between">
        {submitted && selectedOptionId !== null ? (
          <div className="p-2 mb-3 text-stone-800">
            You selected option {selectedOptionId + 1}. The correct answer is{" "}
            {question.correctId + 1}.
          </div>
        ) : (
          <button
            type="button"
            disabled={selectedOptionId == null}
            onClick={handleSubmit}
            className={`text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
              selectedOptionId == null
                ? " bg-stone-200 cursor-not-allowed"
                : "bg-logicolaPrimary hover:opacity-90"
            }`}
          >
            Check answer
          </button>
        )}
        {questionIdx < currentChapter.questions.length - 1 && (
          <Link href={nextQuestionHref()}>
            <button
              type="button"
              className={`text-logicolaPrimary rounded-lg text-sm font-semibold px-5 py-2.5 me-2 mb-2 border border-logicolaPrimary hover:opacity-90 `}
            >
              Next
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Exercise;
