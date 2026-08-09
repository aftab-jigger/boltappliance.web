import { useState } from "react";
import { X } from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import FilterAccordion from "./FilterAccordion";

/**
 * @typedef {object} FilterSectionConfig
 * @property {string} key           Unique id / state key
 * @property {string} label         Section label
 * @property {Array<*>} options     Options accepted by `FilterAccordion`
 * @property {*} value              Currently selected value
 * @property {(option: *) => void} onChange
 * @property {boolean} [isActive]
 * @property {string} [selectedLabel] Badge text when active
 */

/**
 * Sticky "Filters" header shown above the scrolling section list. Solid
 * background + subtle border, gaining a light shadow only once content has
 * scrolled beneath it.
 * @param {{activeCount: number, onClearAll: () => void, title?: string, isScrolled?: boolean}} props
 */
function FilterHeader({ activeCount, onClearAll, title, isScrolled }) {
  return (
    <div
      className={`sticky top-0 z-10 flex items-center justify-between bg-white border-b px-5 py-3 transition-shadow duration-200 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <h2 className="text-lg font-bold text-foreground">
        {title}
        {activeCount > 0 && (
          <span className="ml-2 text-sm font-medium text-teal-600">
            ({activeCount})
          </span>
        )}
      </h2>
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

/**
 * Shared accordion filter body. Rendered by both the desktop sidebar and the
 * mobile drawer so there is exactly one implementation of the filter UI.
 *
 * The single scroll container lives here: the header sticks to its top and
 * only the sections scroll underneath. Individual sections never scroll.
 *
 * @param {{
 *   sections: FilterSectionConfig[],
 *   activeCount: number,
 *   onClearAll: () => void,
 *   namespace: string,
 *   title?: string,
 *   scrollClassName?: string,
 * }} props
 */
export function FilterSections({
  sections,
  activeCount,
  onClearAll,
  namespace,
  title = "Filters",
  scrollClassName = "",
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <div
      className={`overflow-y-auto overscroll-contain ${scrollClassName}`}
      onScroll={(event) => {
        const scrolled = event.currentTarget.scrollTop > 0;
        if (scrolled !== isScrolled) setIsScrolled(scrolled);
      }}
    >
      <FilterHeader
        activeCount={activeCount}
        onClearAll={onClearAll}
        title={title}
        isScrolled={isScrolled}
      />

      <div className="px-5 pt-2 pb-5">
        {sections.map((section) => (
          <FilterAccordion
            key={section.key}
            id={section.key}
            label={section.label}
            options={section.options}
            value={section.value}
            onChange={section.onChange}
            isActive={section.isActive}
            selectedLabel={section.selectedLabel}
            namespace={namespace}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Desktop sticky sidebar wrapper. `stickyClassName` carries the page-specific
 * offset/height (e.g. the category page keeps `top-36`), and that same height
 * bound is what the single inner scroll container uses.
 * @param {{sections: FilterSectionConfig[], activeCount: number, onClearAll: () => void, stickyClassName?: string}} props
 */
export function DesktopFilterSidebar({
  sections,
  activeCount,
  onClearAll,
  stickyClassName = "top-20 max-h-[calc(100vh-6rem)]",
}) {
  if (sections.length === 0) return null;

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div
        className={`sticky ${stickyClassName} bg-card rounded-2xl shadow-sm border overflow-hidden`}
      >
        <FilterSections
          sections={sections}
          activeCount={activeCount}
          onClearAll={onClearAll}
          namespace="desktop"
          scrollClassName="max-h-[inherit]"
        />
      </div>
    </div>
  );
}

/**
 * Mobile slide-over drawer wrapper. Filters apply instantly; "Apply" simply
 * closes the drawer. One outer scroll area, no nested ones.
 * @param {{sections: FilterSectionConfig[], activeCount: number, onClearAll: () => void, isOpen: boolean, onClose: () => void}} props
 */
export function MobileFilterPanel({
  sections,
  activeCount,
  onClearAll,
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={onClose}>
      <div
        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-80 bg-background shadow-xl flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Drawer chrome sits above the sticky Filters header so the close
            button is never overlapped. */}
        <div className="relative z-20 flex items-center justify-between border-b bg-white px-5 py-4">
          <span className="text-sm font-semibold text-gray-900">Filters</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <FilterSections
          sections={sections}
          activeCount={activeCount}
          onClearAll={onClearAll}
          namespace="mobile"
          scrollClassName="flex-1"
        />

        <div className="flex gap-3 border-t p-5">
          <Button
            variant="outline"
            className="flex-1 border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-600 bg-transparent"
            onClick={onClearAll}
          >
            Clear
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            onClick={onClose}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FilterSections;
