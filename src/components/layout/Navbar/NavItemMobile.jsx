import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { X, ChevronDown, WashingMachine, Refrigerator, Microwave, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";

const linkClasses = ({ isActive }) =>
  `block rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors ${
    isActive
      ? "bg-teal-500 text-white shadow-sm"
      : "text-gray-700 hover:bg-gray-100"
  }`;

const subLinkClasses = ({ isActive }) =>
  `flex items-center gap-3 block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-teal-500 text-white shadow-sm"
      : "text-gray-600 hover:bg-gray-100"
  }`;

const iconFor = {
  laundry: WashingMachine,
  refrigeration: Refrigerator,
  cooking: Microwave,
  dishwashers: Droplet,
};

const NavItemMobile = ({ onNavigate, onClose }) => {
  const menuRef = useRef(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape" && onClose) onClose();
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleNavigate = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden backdrop-blur-[1px] px-3 pt-3">
      <div
        ref={menuRef}
        className="mx-auto w-full max-w-md rounded-2xl border bg-white shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold text-gray-900">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg border border-gray-200"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-3 space-y-1.5 overflow-y-auto">
          <NavLink to="/" end className={linkClasses} onClick={handleNavigate}>
            Home
          </NavLink>
          <NavLink
            to="/products"
            end
            className={linkClasses}
            onClick={handleNavigate}
          >
            Products
          </NavLink>

          {/* Categories: expandable section linking to the four main pages */}
          <div>
            <button
              type="button"
              onClick={() => setIsCategoriesOpen((prev) => !prev)}
              className="flex items-center justify-between w-full rounded-xl px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              aria-expanded={isCategoriesOpen}
            >
              Categories
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isCategoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isCategoriesOpen && (
              <div className="mt-1 ml-2 space-y-1 border-l-2 border-gray-100 pl-2">
                {CATEGORIES.map((category) => {
                  const Icon = iconFor[category.slug];
                  return (
                    <NavLink
                      key={category.slug}
                      to={`/${category.slug}`}
                      className={subLinkClasses}
                      onClick={handleNavigate}
                    >
                      <span className="inline-flex items-center justify-center p-2 bg-neutral-100 rounded-md">
                        {Icon ? <Icon className="h-4 w-4 text-neutral-700" /> : null}
                      </span>
                      <span>{category.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          <NavLink
            to="/services"
            className={linkClasses}
            onClick={handleNavigate}
          >
            Services
          </NavLink>
          <NavLink to="/about" className={linkClasses} onClick={handleNavigate}>
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={linkClasses}
            onClick={handleNavigate}
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default NavItemMobile;
