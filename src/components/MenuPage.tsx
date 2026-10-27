import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useMemo, useState } from "react";
import { menuImageMobile, menuItems } from "../data/menuItems";
import type { MenuItem } from "../lib/cart";
import { AddToCartDialog } from "./AddToCartDialog";
import { useMenuWithImages } from "../hooks/useMenuWithImages";
import { MenuQueryErrorBoundary } from "./MenuQueryErrorBoundary";

const menuGridClassName =
  "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-3.5 sm:gap-4 md:gap-5";

function MenuProductGrid({
  items,
  onAdd,
  eagerCount = 0,
}: {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
  eagerCount?: number;
}) {
  return (
    <div className={menuGridClassName}>
      {items.map((item, index) => {
        const useMobileWebp = item.image.startsWith("/menu/");
        return (
        <article
          key={item.id}
          className="flex flex-col justify-between overflow-hidden rounded-[8px] border-2 border-black border-solid bg-white"
        >
          <div className="flex flex-col">
            <div className="aspect-square w-full shrink-0 overflow-hidden">
              <picture>
                {useMobileWebp && (
                  <source
                    media="(max-width: 639px)"
                    srcSet={menuImageMobile(item.image)}
                    type="image/webp"
                  />
                )}
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="size-full object-cover"
                  loading={index < eagerCount ? "eager" : "lazy"}
                  decoding="async"
                />
              </picture>
            </div>
            <div className="flex flex-col gap-4 px-4 pt-4 pb-2">
              <div className="flex flex-col gap-1.5 text-black">
                <h3 className="text-lg leading-snug tracking-[0.36px]">
                  {item.name}
                </h3>
                <p className="text-sm leading-normal tracking-[0.28px] text-black/80">
                  {item.weight}
                </p>
              </div>
              <p className="text-lg font-bold leading-normal tracking-[0.36px] text-[#EE101A]">
                {item.price}
              </p>
            </div>
          </div>
          <div className="px-2.5 pb-2.5">
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="flex h-11 w-full items-center justify-center rounded-[6px] bg-[#0B0B0B] text-center text-base leading-normal tracking-[0.36px] text-white transition-colors hover:bg-[#1a1a1a]"
            >
              Add to cart
            </button>
          </div>
        </article>
        );
      })}
    </div>
  );
}

interface MenuPageProps {
  onNavigateToContact: () => void;
}

const MENU_CATEGORIES = [
  "All",
  "Beef",
  "Chicken",
  "Pork",
  "Ready Meals & Prepared Food",
  "Coffee Capsules & Beverages",
  "Cakes & Desserts",
] as const;

export function MenuPage({ onNavigateToContact }: MenuPageProps) {
  return (
    <MenuQueryErrorBoundary
      fallback={<MenuPageView catalog={menuItems} onNavigateToContact={onNavigateToContact} />}
    >
      <MenuPageWithLiveImages onNavigateToContact={onNavigateToContact} />
    </MenuQueryErrorBoundary>
  );
}

function MenuPageWithLiveImages({ onNavigateToContact }: MenuPageProps) {
  const liveMenu = useMenuWithImages();
  return (
    <MenuPageView
      catalog={liveMenu ?? menuItems}
      onNavigateToContact={onNavigateToContact}
    />
  );
}

function MenuPageView({
  catalog,
  onNavigateToContact,
}: {
  catalog: MenuItem[];
  onNavigateToContact: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [addToCartItem, setAddToCartItem] = useState<MenuItem | null>(null);
  const [addToCartOpen, setAddToCartOpen] = useState(false);

  const filteredItems = useMemo(
    () =>
      selectedCategory === "All"
        ? catalog
        : catalog.filter((item) => item.category === selectedCategory),
    [catalog, selectedCategory],
  );

  const categorySections = useMemo(
    () =>
      selectedCategory === "All"
        ? MENU_CATEGORIES.filter((category) => category !== "All")
            .map((category) => ({
              category,
              items: catalog.filter((item) => item.category === category),
            }))
            .filter((section) => section.items.length > 0)
        : [],
    [catalog, selectedCategory],
  );

  const openAddToCart = (item: MenuItem) => {
    setAddToCartItem(item);
    setAddToCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AddToCartDialog
        item={addToCartItem}
        open={addToCartOpen}
        onOpenChange={setAddToCartOpen}
      />

      {/* Header Image with Overlay */}
      <div className="relative h-[500px] overflow-hidden">
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet={menuImageMobile("/menu/menu%20header.png")}
            type="image/webp"
          />
          <ImageWithFallback
            src="/menu/menu%20header.png"
            alt="Steak-Out menu"
            className="w-full h-full object-cover"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-black/70" />

        {/* Header Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-medium mb-4 drop-shadow-lg">
              Steak-Out Menu
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Hand-selected, premium cuts and quality products sourced from the finest suppliers.
            </p>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                style={
                  selectedCategory === category
                    ? { backgroundColor: "#EE101A" }
                    : {}
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {selectedCategory === "All" ? (
          <div className="flex flex-col gap-12 md:gap-16">
            {categorySections.map((section, sectionIndex) => (
              <section key={section.category}>
                <div className="mb-5 md:mb-6">
                  <h2 className="text-2xl font-medium tracking-tight text-gray-900 md:text-3xl">
                    {section.category}
                  </h2>
                  <div className="mt-2.5 h-0.5 w-14 bg-[#EE101A]" aria-hidden="true" />
                </div>
                <MenuProductGrid
                  items={section.items}
                  onAdd={openAddToCart}
                  eagerCount={sectionIndex === 0 ? 4 : 0}
                />
              </section>
            ))}
          </div>
        ) : (
          <MenuProductGrid items={filteredItems} onAdd={openAddToCart} eagerCount={4} />
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found in this category.</p>
          </div>
        )}

        <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Custom Orders Available
          </h3>
          <p className="text-gray-600 mb-6">
            Need a specific cut or have special requirements? Contact us for custom orders and bulk pricing.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onNavigateToContact}
            style={{ borderColor: "#EE101A", color: "#EE101A" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#EE101A";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#EE101A";
            }}
          >
            Contact for Custom Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
