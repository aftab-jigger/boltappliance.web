import React from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  WashingMachine,
  Refrigerator,
  Microwave,
  Droplet,
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const linkClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors px-3 py-1 rounded-full ${
    isActive ? "bg-teal-500 text-white" : "text-foreground hover:text-primary"
  }`;

const iconFor = {
  laundry: WashingMachine,
  refrigeration: Refrigerator,
  cooking: Microwave,
  dishwashers: Droplet,
};

const NavItemsDesktop = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <NavLink to="/" className={linkClasses} end>
        Home
      </NavLink>

      {/* Products: all products mixed together */}
      <NavLink to="/products" className={linkClasses} end>
        Products
      </NavLink>

      {/* Categories dropdown: links to the four main category pages */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
          >
            Categories
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>

        {/* Styled content: outer gradient border wrapper + inner white box */}
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="category-dropdown-popover w-[272px] rounded-2xl"
        >
          <div className="category-dropdown-arrow" aria-hidden="true" />

          <div className="category-dropdown-frame">
            <div className="category-dropdown-surface">
              <div className="p-1.5">
                {CATEGORIES.map((category) => {
                  const Icon = iconFor[category.slug];
                  return (
                    <DropdownMenuItem
                      key={category.slug}
                      asChild
                      className="category-dropdown-item rounded-xl p-0"
                    >
                      <NavLink
                        to={`/${category.slug}`}
                        className="group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-1.5 text-sm text-foreground outline-none transition-colors duration-200 hover:bg-teal-50/70 focus:bg-teal-50/70 aria-[current=page]:font-medium"
                      >
                        <span className="flex size-[2.375rem] shrink-0 items-center justify-center rounded-lg bg-neutral-100 transition-colors duration-200 group-hover:bg-teal-100/70 group-focus:bg-teal-100/70">
                          {Icon ? (
                            <Icon className="size-[1.125rem] text-neutral-700 transition-colors group-hover:text-teal-700 group-focus:text-teal-700" />
                          ) : null}
                        </span>

                        <span className="flex-1">{category.title}</span>
                      </NavLink>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <NavLink to="/services" className={linkClasses}>
        Services
      </NavLink>
      <NavLink to="/about" className={linkClasses}>
        About
      </NavLink>
      <NavLink to="/contact" className={linkClasses}>
        Contact
      </NavLink>
    </div>
  );
};

export default NavItemsDesktop;
