 

import { ArrowRight } from "@/assets/icons/icons"
import { Link } from "react-router-dom"
import { categoryConfig } from "@/lib/data"
import SectionHeader from "@/components/ui/section-header"

const categoryIcons = {
  Dryer: (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="70" height="80" rx="8" fill="#e0f2fe" stroke="#0891b2" strokeWidth="3" />
      <circle cx="50" cy="55" r="28" fill="#cffafe" stroke="#0891b2" strokeWidth="2" />
      <circle cx="50" cy="55" r="20" fill="#a5f3fc" stroke="#0891b2" strokeWidth="1.5" />
      <circle cx="50" cy="55" r="10" fill="#67e8f9" />
      <rect x="25" y="18" width="50" height="12" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="35" cy="24" r="3" fill="#0891b2" /><circle cx="50" cy="24" r="3" fill="#0891b2" /><circle cx="65" cy="24" r="3" fill="#0891b2" />
    </svg>
  ),
  Dishwasher: (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="70" height="80" rx="8" fill="#e0f2fe" stroke="#0891b2" strokeWidth="3" />
      <rect x="20" y="15" width="60" height="10" rx="2" fill="#f1f5f9" />
      <circle cx="30" cy="20" r="3" fill="#10b981" /><circle cx="45" cy="20" r="3" fill="#0891b2" />
      <rect x="25" y="32" width="50" height="50" rx="4" fill="#cffafe" stroke="#0891b2" strokeWidth="1.5" />
      <ellipse cx="50" cy="45" rx="18" ry="8" fill="#a5f3fc" /><ellipse cx="50" cy="65" rx="15" ry="6" fill="#a5f3fc" />
      <line x1="35" y1="45" x2="65" y2="45" stroke="#0891b2" strokeWidth="1" />
      <line x1="38" y1="55" x2="62" y2="55" stroke="#0891b2" strokeWidth="1" /><line x1="40" y1="65" x2="60" y2="65" stroke="#0891b2" strokeWidth="1" />
    </svg>
  ),
  Refrigerator: (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="5" width="60" height="90" rx="8" fill="#e0f2fe" stroke="#0891b2" strokeWidth="3" />
      <line x1="20" y1="35" x2="80" y2="35" stroke="#0891b2" strokeWidth="2" />
      <rect x="70" y="15" width="4" height="12" rx="2" fill="#0891b2" /><rect x="70" y="45" width="4" height="20" rx="2" fill="#0891b2" />
      <rect x="28" y="12" width="35" height="15" rx="3" fill="#cffafe" stroke="#0891b2" strokeWidth="1" />
      <rect x="28" y="45" width="20" height="25" rx="3" fill="#cffafe" stroke="#0891b2" strokeWidth="1" />
      <rect x="52" y="45" width="20" height="15" rx="3" fill="#a5f3fc" stroke="#0891b2" strokeWidth="1" />
      <circle cx="35" cy="80" r="4" fill="#67e8f9" /><circle cx="50" cy="80" r="4" fill="#67e8f9" /><circle cx="65" cy="80" r="4" fill="#67e8f9" />
    </svg>
  ),
  "Microwave Oven": (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="80" height="55" rx="8" fill="#e0f2fe" stroke="#0891b2" strokeWidth="3" />
      <rect x="18" y="28" width="45" height="38" rx="4" fill="#0c4a6e" stroke="#0891b2" strokeWidth="2" />
      <rect x="22" y="32" width="37" height="30" rx="2" fill="#164e63" />
      <circle cx="40" cy="47" r="10" fill="#67e8f9" opacity="0.5" />
      <circle cx="75" cy="35" r="4" fill="#10b981" /><circle cx="75" cy="48" r="4" fill="#0891b2" />
      <rect x="70" y="56" width="12" height="8" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      <rect x="15" y="75" width="70" height="5" rx="2" fill="#94a3b8" />
    </svg>
  ),
  Cooker: (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="70" height="65" rx="8" fill="#e0f2fe" stroke="#0891b2" strokeWidth="3" />
      <rect x="20" y="30" width="60" height="15" rx="3" fill="#f1f5f9" />
      <circle cx="35" cy="37" r="5" fill="#0891b2" /><circle cx="50" cy="37" r="5" fill="#0891b2" /><circle cx="65" cy="37" r="5" fill="#0891b2" />
      <rect x="25" y="52" width="50" height="30" rx="4" fill="#0c4a6e" stroke="#0891b2" strokeWidth="2" />
      <rect x="30" y="57" width="40" height="20" rx="2" fill="#164e63" />
      <line x1="35" y1="12" x2="35" y2="22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="8" x2="50" y2="22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="65" y1="12" x2="65" y2="22" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="10" r="3" fill="#f97316" /><circle cx="50" cy="6" r="3" fill="#f97316" /><circle cx="65" cy="10" r="3" fill="#f97316" />
    </svg>
  ),
  Hobs: (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="80" height="50" rx="8" fill="#1e293b" stroke="#0891b2" strokeWidth="3" />
      <circle cx="32" cy="47" r="12" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
      <circle cx="32" cy="47" r="8" fill="#0f172a" stroke="#f97316" strokeWidth="1.5" /><circle cx="32" cy="47" r="4" fill="#fbbf24" />
      <circle cx="68" cy="47" r="12" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
      <circle cx="68" cy="47" r="8" fill="#0f172a" stroke="#f97316" strokeWidth="1.5" /><circle cx="68" cy="47" r="4" fill="#fbbf24" />
      <circle cx="32" cy="68" r="6" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" /><circle cx="68" cy="68" r="6" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
      <rect x="45" y="35" width="10" height="20" rx="2" fill="#334155" />
      <circle cx="50" cy="42" r="2" fill="#10b981" /><circle cx="50" cy="50" r="2" fill="#10b981" />
    </svg>
  ),
}

const categories = Object.entries(categoryConfig).map(([key, config]) => ({
  id: config.slug,
  name: config.title,
  description: config.description,
  slug: config.slug,
  icon: categoryIcons[key],
}))

const ProductCategories = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96  rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge="Our Products"
          title="Browse By Category"
          description="Explore our wide range of premium home appliances designed to make your life easier and more comfortable."
          className="mb-10 sm:mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products/${category.slug}`}
              className="group"
            >
              <div className="relative bg-card rounded-2xl p-6 sm:p-8 shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground text-center mb-2">{category.name}</h3>
                  <p className="text-muted-foreground text-sm text-center mb-4">{category.description}</p>

                  {/* View Products Link */}
                  <div className="flex items-center justify-center gap-2 text-teal-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Products
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
export default ProductCategories;