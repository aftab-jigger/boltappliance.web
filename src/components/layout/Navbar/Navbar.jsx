import { useState } from "react";
import NavItemMobile from "./NavItemMobile";
import NavItemsDesktop from "./NavItemsDesktop";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../../../assets/logo/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <NavItemsDesktop />

          {/* Mobile-only: compact "Hire an Expert" CTA + menu toggle. Border
              is transparent — the visible outline is painted by
              .cta-glow-border, the Categories dropdown's own rotating
              conic-gradient border animation reused verbatim. Same tel:
              link/number as the Phone card on the Contact page. */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="tel:02079711031"
              className="cta-glow-border flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border border-transparent bg-transparent px-3 py-1.5 text-sm font-medium text-teal-600 transition-colors duration-300 hover:bg-teal-500 hover:text-white"
            >
              <Phone className="h-3 w-3" />
              Hire an Expert
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl border border-border/70"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && <NavItemMobile onNavigate={closeMenu} onClose={closeMenu} />}
    </header>
  );
};
export default Navbar;
