/**
 * Centralized icons and illustrations
 * - Lucide icons re-exported for use across pages
 * - Custom SVG illustrations (service icons, product placeholder)
 */

// Lucide React Icons
export {
  ArrowRight,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  Droplets,
  Headphones,
  Home,
  Mail,
  MapPin,
  Building2,
  Minus,
  Plus,
  Phone,
  Quote,
  Refrigerator,
  RotateCcw,
  Send,
  Share2,
  Shield,
  ShoppingCart,
  SlidersHorizontal,
  Smile,
  Star,
  Truck,
  Users,
  Users2,
  WashingMachine,
  X,
  Zap,
} from "lucide-react"

// WhatsApp icon for contact buttons
export function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// Service Illustrations (SVG components)
export function DeliveryIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="0" y="230" width="400" height="40" rx="4" fill="#e2e8f0" />
      <rect x="40" y="247" width="30" height="6" rx="3" fill="#cbd5e1" />
      <rect x="120" y="247" width="30" height="6" rx="3" fill="#cbd5e1" />
      <rect x="200" y="247" width="30" height="6" rx="3" fill="#cbd5e1" />
      <rect x="280" y="247" width="30" height="6" rx="3" fill="#cbd5e1" />
      <rect x="350" y="247" width="30" height="6" rx="3" fill="#cbd5e1" />
      <rect x="60" y="130" width="160" height="100" rx="8" fill="#0d9488" />
      <rect x="70" y="140" width="140" height="60" rx="4" fill="#14b8a6" />
      <rect x="90" y="155" width="40" height="8" rx="4" fill="white" opacity="0.6" />
      <rect x="90" y="170" width="60" height="6" rx="3" fill="white" opacity="0.4" />
      <rect x="90" y="182" width="30" height="6" rx="3" fill="white" opacity="0.3" />
      <rect x="160" y="150" width="36" height="36" rx="4" fill="white" opacity="0.25" />
      <path d="M168 168H188M178 158V178" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M220 155H270C278 155 284 161 284 169V230H220V155Z" fill="#0f766e" />
      <rect x="232" y="168" width="38" height="30" rx="4" fill="#67e8f9" opacity="0.7" />
      <line x1="251" y1="168" x2="251" y2="198" stroke="#0d9488" strokeWidth="2" />
      <circle cx="130" cy="235" r="22" fill="#334155" />
      <circle cx="130" cy="235" r="12" fill="#64748b" />
      <circle cx="130" cy="235" r="5" fill="#334155" />
      <circle cx="260" cy="235" r="22" fill="#334155" />
      <circle cx="260" cy="235" r="12" fill="#64748b" />
      <circle cx="260" cy="235" r="5" fill="#334155" />
      <line x1="30" y1="180" x2="50" y2="180" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="20" y1="195" x2="48" y2="195" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <line x1="35" y1="210" x2="52" y2="210" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <rect x="310" y="90" width="50" height="50" rx="6" fill="#14b8a6" opacity="0.2" stroke="#14b8a6" strokeWidth="2" />
      <path d="M325 115H350M335 105V125" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <rect x="330" y="160" width="35" height="35" rx="4" fill="#0d9488" opacity="0.15" stroke="#0d9488" strokeWidth="1.5" />
    </svg>
  )
}

export function RecycleIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="200" cy="150" r="100" fill="#0d9488" opacity="0.08" />
      <circle cx="200" cy="150" r="70" fill="#0d9488" opacity="0.06" />
      <path d="M200 70L230 110H170L200 70Z" fill="#14b8a6" opacity="0.8" />
      <path d="M140 130L120 180H170L140 130Z" fill="#0d9488" opacity="0.8" />
      <path d="M260 130L280 180H230L260 130Z" fill="#0f766e" opacity="0.8" />
      <path d="M220 105C240 115 255 130 260 130" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" fill="none" />
      <polygon points="258,125 268,132 256,135" fill="#14b8a6" />
      <path d="M130 180C125 195 130 210 145 218" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
      <polygon points="150,213 148,225 138,216" fill="#0d9488" />
      <path d="M270 180C275 195 270 210 255 218" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" fill="none" />
      <polygon points="250,213 252,225 262,216" fill="#0f766e" />
      <rect x="178" y="128" width="44" height="54" rx="6" fill="white" stroke="#0d9488" strokeWidth="2" />
      <rect x="186" y="138" width="28" height="24" rx="3" fill="#14b8a6" opacity="0.2" />
      <circle cx="200" cy="172" r="4" fill="#0d9488" opacity="0.5" />
      <path d="M310 80C310 80 330 60 350 80C350 80 330 100 310 80Z" fill="#14b8a6" opacity="0.3" />
      <line x1="310" y1="80" x2="350" y2="80" stroke="#14b8a6" strokeWidth="1" opacity="0.5" />
      <path d="M50 200C50 200 70 180 90 200C90 200 70 220 50 200Z" fill="#14b8a6" opacity="0.25" />
      <circle cx="320" cy="200" r="4" fill="#14b8a6" opacity="0.2" />
      <circle cx="340" cy="185" r="3" fill="#0d9488" opacity="0.15" />
      <circle cx="70" cy="100" r="5" fill="#14b8a6" opacity="0.2" />
      <circle cx="55" cy="120" r="3" fill="#0d9488" opacity="0.15" />
    </svg>
  )
}

export function InstallationIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="40" y="250" width="320" height="8" rx="4" fill="#e2e8f0" />
      <rect x="150" y="100" width="120" height="150" rx="10" fill="white" stroke="#0d9488" strokeWidth="3" />
      <circle cx="210" cy="180" r="35" stroke="#14b8a6" strokeWidth="3" fill="#14b8a6" opacity="0.1" />
      <circle cx="210" cy="180" r="20" stroke="#14b8a6" strokeWidth="2" fill="white" />
      <circle cx="210" cy="180" r="8" fill="#14b8a6" opacity="0.3" />
      <rect x="165" y="115" width="90" height="30" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <circle cx="185" cy="130" r="5" fill="#14b8a6" opacity="0.6" />
      <circle cx="200" cy="130" r="5" fill="#0d9488" opacity="0.4" />
      <rect x="215" y="125" width="25" height="10" rx="3" fill="#14b8a6" opacity="0.2" />
      <circle cx="90" cy="140" r="18" fill="#14b8a6" opacity="0.3" />
      <circle cx="90" cy="133" r="12" fill="#0f766e" opacity="0.5" />
      <path d="M70 165C70 155 78 148 90 148C102 148 110 155 110 165V210H70V165Z" fill="#0d9488" opacity="0.6" />
      <path d="M108 170L145 160" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
      <rect x="74" y="210" width="14" height="40" rx="4" fill="#0d9488" opacity="0.5" />
      <rect x="98" y="210" width="14" height="40" rx="4" fill="#0d9488" opacity="0.5" />
      <rect x="290" y="220" width="40" height="10" rx="3" fill="#14b8a6" opacity="0.3" />
      <path d="M300 220V200L310 195L320 200V220" stroke="#0d9488" strokeWidth="2" fill="#14b8a6" opacity="0.15" />
      <path d="M310 90L320 80L330 90L320 95Z" fill="#0d9488" opacity="0.4" />
      <rect x="317" y="93" width="6" height="30" rx="3" fill="#0d9488" opacity="0.3" />
      <circle cx="340" cy="140" r="20" fill="#14b8a6" opacity="0.15" stroke="#14b8a6" strokeWidth="2" />
      <path d="M330 140L337 147L350 134" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="80" r="15" stroke="#14b8a6" strokeWidth="2" fill="none" opacity="0.3" />
      <circle cx="60" cy="80" r="6" fill="#14b8a6" opacity="0.2" />
    </svg>
  )
}

export function RepairIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="310" cy="90" r="40" stroke="#14b8a6" strokeWidth="2" fill="none" opacity="0.15" />
      <circle cx="310" cy="90" r="20" stroke="#14b8a6" strokeWidth="2" fill="none" opacity="0.1" />
      <circle cx="310" cy="90" r="8" fill="#14b8a6" opacity="0.1" />
      <path d="M120 80C100 60 100 30 120 10C125 15 125 25 130 30L170 70L120 80Z" fill="#0d9488" opacity="0.6" transform="translate(30,80) scale(0.9)" />
      <rect x="175" y="155" width="14" height="90" rx="5" fill="#0d9488" opacity="0.5" transform="rotate(-45, 182, 200)" />
      <rect x="230" y="100" width="8" height="80" rx="4" fill="#14b8a6" opacity="0.5" transform="rotate(20, 234, 140)" />
      <path d="M228 100L238 100L234 70Z" fill="#0f766e" opacity="0.6" transform="rotate(20, 234, 90)" />
      <rect x="226" y="175" width="16" height="25" rx="4" fill="#0d9488" opacity="0.4" transform="rotate(20, 234, 188)" />
      <rect x="140" y="120" width="100" height="130" rx="8" fill="white" stroke="#0d9488" strokeWidth="2.5" />
      <rect x="155" y="135" width="70" height="50" rx="4" fill="#14b8a6" opacity="0.1" stroke="#14b8a6" strokeWidth="1.5" />
      <path d="M260 130L270 120L265 135L275 125" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M270 150L278 142L274 155L282 147" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <rect x="160" y="200" width="60" height="8" rx="4" fill="#e2e8f0" />
      <rect x="160" y="200" width="40" height="8" rx="4" fill="#14b8a6" opacity="0.7" />
      <circle cx="190" cy="225" r="5" fill="#0d9488" opacity="0.5" />
      <circle cx="80" cy="100" r="8" stroke="#14b8a6" strokeWidth="2" fill="none" opacity="0.3" />
      <circle cx="80" cy="100" r="3" fill="#14b8a6" opacity="0.2" />
      <circle cx="330" cy="220" r="6" stroke="#0d9488" strokeWidth="2" fill="none" opacity="0.25" />
      <circle cx="330" cy="220" r="2" fill="#0d9488" opacity="0.2" />
      <circle cx="70" cy="200" r="12" stroke="#14b8a6" strokeWidth="2" fill="none" opacity="0.2" />
      <circle cx="70" cy="200" r="5" fill="#14b8a6" opacity="0.15" />
    </svg>
  )
}

export function InspectionIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="175" cy="130" r="65" stroke="#0d9488" strokeWidth="4" fill="#14b8a6" opacity="0.08" />
      <circle cx="175" cy="130" r="50" stroke="#14b8a6" strokeWidth="2" fill="white" opacity="0.5" />
      <line x1="222" y1="178" x2="280" y2="236" stroke="#0d9488" strokeWidth="8" strokeLinecap="round" />
      <line x1="222" y1="178" x2="280" y2="236" stroke="#0f766e" strokeWidth="5" strokeLinecap="round" />
      <rect x="152" y="105" width="46" height="55" rx="5" fill="white" stroke="#14b8a6" strokeWidth="2" />
      <rect x="158" y="112" width="34" height="20" rx="3" fill="#14b8a6" opacity="0.15" />
      <circle cx="175" cy="148" r="5" fill="#14b8a6" opacity="0.4" />
      <rect x="290" y="60" width="80" height="120" rx="6" fill="white" stroke="#0d9488" strokeWidth="2" />
      <rect x="302" y="72" width="56" height="6" rx="3" fill="#14b8a6" opacity="0.3" />
      <rect x="302" y="90" width="10" height="10" rx="2" stroke="#14b8a6" strokeWidth="1.5" fill="#14b8a6" opacity="0.1" />
      <path d="M304 95L307 98L312 92" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="318" y="92" width="35" height="5" rx="2" fill="#e2e8f0" />
      <rect x="302" y="110" width="10" height="10" rx="2" stroke="#14b8a6" strokeWidth="1.5" fill="#14b8a6" opacity="0.1" />
      <path d="M304 115L307 118L312 112" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="318" y="112" width="35" height="5" rx="2" fill="#e2e8f0" />
      <rect x="302" y="130" width="10" height="10" rx="2" stroke="#14b8a6" strokeWidth="1.5" fill="#14b8a6" opacity="0.1" />
      <path d="M304 135L307 138L312 132" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="318" y="132" width="35" height="5" rx="2" fill="#e2e8f0" />
      <rect x="302" y="150" width="10" height="10" rx="2" stroke="#0d9488" strokeWidth="1.5" fill="none" />
      <rect x="318" y="152" width="35" height="5" rx="2" fill="#e2e8f0" />
      <circle cx="80" cy="70" r="15" fill="#14b8a6" opacity="0.1" />
      <circle cx="80" cy="70" r="8" fill="#14b8a6" opacity="0.08" />
      <circle cx="340" cy="220" r="10" fill="#0d9488" opacity="0.1" />
      <path d="M95 200L100 190L105 200L100 210Z" fill="#14b8a6" opacity="0.2" />
      <path d="M310 250L314 242L318 250L314 258Z" fill="#0d9488" opacity="0.15" />
    </svg>
  )
}

// Product placeholder image (used in ProductList, CategoryPage, Product)
export function ProductImagePlaceholder({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f0fdfa" />
      <rect x="40" y="30" width="120" height="140" rx="10" fill="#e0f2fe" stroke="#0891b2" strokeWidth="3" />
      <circle cx="100" cy="90" r="35" fill="#cffafe" stroke="#0891b2" strokeWidth="2" />
      <circle cx="100" cy="90" r="25" fill="#a5f3fc" stroke="#0891b2" strokeWidth="1.5" />
      <circle cx="100" cy="90" r="12" fill="#67e8f9" />
      <rect x="55" y="140" width="90" height="20" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="75" cy="150" r="4" fill="#0891b2" />
      <circle cx="100" cy="150" r="4" fill="#0891b2" />
      <circle cx="125" cy="150" r="4" fill="#0891b2" />
    </svg>
  )
}
