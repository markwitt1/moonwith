import classNames from "classnames";
import { HTMLProps } from "react";

export interface OptionProps extends HTMLProps<HTMLButtonElement> {
  label: string;
  isActive: boolean;
  isCorrect: boolean;
  showSolution: boolean;
}

export default function Option({
  label,
  isActive,
  isCorrect,
  showSolution,
  ...props
}: OptionProps) {
  const className = classNames(
    "w-full ps-4 text-logicolaPrimary flex items-center border rounded-lg",
    !isActive && "border-stone-200",
    showSolution && (isCorrect ? "bg-green-100" : "text-red-400"),
    !showSolution && isActive && "border-LogicolaPrimary"
  );

  return (
    <button {...props} className={className} type="button">
      <div className="flex">
        <div className="py-4 ms-2 font-medium text-stone-900">{label}</div>
      </div>
    </button>
  );
}
