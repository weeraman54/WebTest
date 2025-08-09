import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../../assets/assets";

interface Category {
  id: string;
  name: string;
  icon: string;
  href: string;
}

// ===== SINGLE PLACE TO CUSTOMIZE ALL STYLING =====
const CATEGORY_STYLES = {
  // Rectangle dimensions - Smaller and more compact for desktop
  rectangle: {
    height: "min-h-[80px] sm:min-h-[80px] lg:min-h-[70px]", // Reduced height, especially on desktop
    width: "flex-1",
    padding: "p-2 sm:p-3 lg:p-2", // Reduced padding on desktop
  },

  // Content positioning - More compact spacing
  layout: {
    direction: "flex-col sm:flex-row", // Stack vertically on mobile, row on larger screens
    alignment: "items-center",
    justification: "justify-center",
    spacing: "space-y-1 sm:space-y-0 sm:space-x-2 lg:space-x-1", // Reduced spacing on desktop
  },

  // Icon styling - Smaller on desktop
  icon: {
    containerSize: "w-10 h-10 sm:w-12 sm:h-12 lg:w-10 lg:h-10", // Smaller on desktop
    imageSize: "w-8 h-8 sm:w-10 sm:h-10 lg:w-8 lg:h-8", // Smaller icons on desktop
    hoverEffect: "group-hover:scale-110",
  },

  // Text styling - Smaller and more compact on desktop
  text: {
    fontSize: "text-xs sm:text-sm lg:text-sm", // Smaller text on desktop
    fontWeight: "font-medium",
    fontFamily: "font-poppins",
    textAlign: "text-center",
    lineHeight: "leading-tight",
    maxWidth: "max-w-[80px] sm:max-w-none lg:max-w-[70px]", // Limit width on desktop too
  },

  // Colors and effects - Using CSS Variables (HOVER COLORS REMOVED)
  colors: {
    background: "bg-[var(--category-bg)]", // #353535
    hoverBackground: "hover:bg-[var(--category-hover-bg)]", // #4a4a4a
    textColor: "text-[var(--category-text)]", // Pure white
    border: "border border-[var(--category-border)]", // #424242
    transition: "transition-all duration-200",
  },

  // Title styling
  title: {
    show: false,
    text: "Shop by Category",
    fontSize: "text-3xl",
    fontWeight: "font-bold",
    color: "text-[var(--category-text)]", // Pure white
    spacing: "py-8",
    alignment: "text-center",
  },
};

const categories: Category[] = [
  {
    id: "laptops",
    name: "Laptops",
    icon: Icons.desktop,
    href: "/categories/laptops",
  },
  {
    id: "used-desktop",
    name: "Used Desktop",
    icon: Icons.desktop,
    href: "/categories/used-desktop",
  },
  {
    id: "brand-new-desktop",
    name: "Brand New Desktop",
    icon: Icons.desktop,
    href: "/categories/brand-new-desktop",
  },
  {
    id: "processors",
    name: "Processors",
    icon: Icons.processor,
    href: "/categories/processors",
  },
  {
    id: "motherboards",
    name: "Motherboards",
    icon: Icons.motherboard,
    href: "/categories/motherboards",
  },
  {
    id: "memory",
    name: "Memory",
    icon: Icons.ram,
    href: "/categories/memory",
  },
  {
    id: "casing",
    name: "Casing",
    icon: Icons.casing,
    href: "/categories/casing",
  },
  {
    id: "monitors",
    name: "Monitors",
    icon: Icons.monitor,
    href: "/categories/monitors",
  },
  {
    id: "storage-odd",
    name: "Storage & ODD",
    icon: Icons.storage,
    href: "/categories/storage-odd",
  },
  {
    id: "ssd",
    name: "SSD",
    icon: Icons.ssd,
    href: "/categories/ssd",
  },
  {
    id: "power-supply",
    name: "Power Supply",
    icon: Icons.accessories,
    href: "/categories/power-supply",
  },
  {
    id: "graphics-card",
    name: "Graphics Card",
    icon: Icons.gpu,
    href: "/categories/graphics-card",
  },
  {
    id: "cooling",
    name: "Cooling",
    icon: Icons.cooling,
    href: "/categories/cooling",
  },
  {
    id: "speaker-headphone",
    name: "Speaker & Headphone",
    icon: Icons.sounds,
    href: "/categories/speaker-headphone",
  },
  {
    id: "laptop-accessories",
    name: "Laptop Accessories",
    icon: Icons.laptopAccessories,
    href: "/categories/laptop-accessories",
  },
  {
    id: "printers-accessories",
    name: "Printers & Accessories",
    icon: Icons.printer,
    href: "/categories/printers-accessories",
  },
  {
    id: "network-accessories",
    name: "Network & Accessories",
    icon: Icons.networking,
    href: "/categories/network-accessories",
  },
  {
    id: "pen-drive-sd-card",
    name: "Pen Drive & SD Card",
    icon: Icons.penSd,
    href: "/categories/pen-drive-sd-card",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: Icons.accessories,
    href: "/categories/accessories",
  },
  {
    id: "pcie-adapters-cables",
    name: "PCIe|Adapters & Cables",
    icon: Icons.nic,
    href: "/categories/pcie-adapters-cables",
  },
  {
    id: "keyboard-mouse",
    name: "Keyboard & Mouse",
    icon: Icons.keyboardMouse,
    href: "/categories/keyboard-mouse",
  },
];

const Categories: React.FC = () => {
  // Build className strings from configuration
  const rectangleClasses = `
    ${CATEGORY_STYLES.rectangle.width} 
    group 
    flex 
    ${CATEGORY_STYLES.layout.direction} 
    ${CATEGORY_STYLES.layout.alignment} 
    ${CATEGORY_STYLES.layout.justification} 
    ${CATEGORY_STYLES.rectangle.padding} 
    ${CATEGORY_STYLES.colors.background} 
    ${CATEGORY_STYLES.colors.hoverBackground} 
    ${CATEGORY_STYLES.colors.transition} 
    ${CATEGORY_STYLES.colors.border} 
    ${CATEGORY_STYLES.rectangle.height} 
    ${CATEGORY_STYLES.layout.spacing}
    backdrop-blur-sm
  `
    .replace(/\s+/g, " ")
    .trim();

  // Icon classes without hover color changes
  const iconClasses = `
    ${CATEGORY_STYLES.icon.imageSize} 
    object-contain 
    ${CATEGORY_STYLES.icon.hoverEffect} 
    transition-transform
    category-icon
  `
    .replace(/\s+/g, " ")
    .trim();

  // Text classes without hover color changes
  const textClasses = `
    ${CATEGORY_STYLES.text.fontSize} 
    ${CATEGORY_STYLES.text.fontWeight} 
    ${CATEGORY_STYLES.colors.textColor} 
    ${CATEGORY_STYLES.text.textAlign} 
    ${CATEGORY_STYLES.text.lineHeight} 
    ${CATEGORY_STYLES.text.fontFamily}
  `
    .replace(/\s+/g, " ")
    .trim();

  const titleClasses = `
    ${CATEGORY_STYLES.title.fontSize} 
    ${CATEGORY_STYLES.title.fontWeight} 
    ${CATEGORY_STYLES.title.color} 
    ${CATEGORY_STYLES.title.alignment} 
    ${CATEGORY_STYLES.title.spacing}
    ${CATEGORY_STYLES.text.fontFamily}
  `
    .replace(/\s+/g, " ")
    .trim();

  // Update the return section to use responsive grid instead of fixed rows
  return (
    <section className="w-screen bg-[var(--category-bg)] border-y border-gray-600/30 overflow-hidden" id="categories-section" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
      <div className="w-full max-w-full overflow-hidden" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
        {/* Title */}
        {CATEGORY_STYLES.title.show && (
          <h2 className={titleClasses} id="categories-title">{CATEGORY_STYLES.title.text}</h2>
        )}

        {/* Responsive Grid - All categories in one responsive grid */}
        <div className="flex flex-wrap justify-center gap-0 bg-[var(--category-bg)] w-screen max-w-full overflow-hidden" id="categories-grid" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={rectangleClasses.replace('flex-1', 'w-[50%] sm:w-[33.333%] md:w-[25%] lg:w-[20%] xl:w-[16.666%] 2xl:w-[14.285%] flex-shrink-0 min-w-0 box-border')}
              id={`category-link-${category.id}`}
              data-testid={`category-${category.id}`}
            >
              <div className={`${CATEGORY_STYLES.icon.containerSize} flex items-center justify-center flex-shrink-0`}>
                <img
                  src={category.icon}
                  alt={category.name}
                  className={iconClasses}
                  id={`category-icon-${category.id}`}
                />
              </div>
              <span className={textClasses} id={`category-name-${category.id}`}>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;