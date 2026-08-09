import { useState } from "react";
import { ChevronDown } from "@/assets/icons/icons";

/**
 * A single collapsible filter section rendering radio (single-select) options.
 *
 * Options may be:
 * - strings, e.g. `["All", "Beko", "Bosch"]`
 * - `{ value, label }` objects (used by Category / Subcategory)
 * - `{ label, min, max }` price range objects
 *
 * @param {{
 *   id: string,
 *   label: string,
 *   options: Array<string | {value?: string, label: string}>,
 *   value: *,
 *   onChange: (option: *) => void,
 *   isActive?: boolean,
 *   selectedLabel?: string,
 *   namespace?: string,
 * }} props
 */
export default function FilterAccordion({
  id,
  label,
  options,
  value,
  onChange,
  isActive = false,
  selectedLabel = "",
  namespace = "filter",
}) {
  // Every section starts collapsed. Collapsing/expanding never touches the
  // selected value — the selection lives in the parent's filter state and is
  // surfaced in the header badge while collapsed.
  const [isOpen, setIsOpen] = useState(false);

  if (!options || options.length === 0) return null;

  const isSelected = (option) => {
    if (typeof option === "string") return value === option;
    if (option.value !== undefined) return value === option.value;
    return value?.label === option.label;
  };

  const optionLabel = (option) =>
    typeof option === "string" ? option : option.label;

  const optionKey = (option, index) =>
    typeof option === "string"
      ? option
      : (option.value ?? option.label ?? index);

  return (
    <div className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={`${namespace}-${id}-panel`}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="font-semibold text-foreground text-sm">{label}</span>
          {isActive && (
            <span className="bg-teal-100 text-teal-700 text-[11px] font-medium px-2 py-0.5 rounded-full max-w-[7rem] truncate">
              {selectedLabel || 1}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div id={`${namespace}-${id}-panel`} className="space-y-2 pt-1 pb-2">
          {options.map((option, index) => (
            <label
              key={optionKey(option, index)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name={`${namespace}-${id}`}
                checked={isSelected(option)}
                onChange={() => onChange(option)}
                className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {optionLabel(option)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
