import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
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
            className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-1 rounded-full"
          >
            Categories
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[10rem]">
          {CATEGORIES.map((category) => (
            <DropdownMenuItem key={category.slug} asChild>
              <NavLink to={`/${category.slug}`}>{category.title}</NavLink>
            </DropdownMenuItem>
          ))}
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
