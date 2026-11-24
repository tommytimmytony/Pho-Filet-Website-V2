import { useState, useMemo } from "react";
import { categories, currency } from "../data/menu";

function MenuItem({ item }) {
  return (
    <article className="menu-item">
      <div className="menu-item-heading">
        <h3 className="item-name">{item.name}</h3>
        <span className="item-price">{currency.format(item.price)}</span>
      </div>
      {item.description && (
        <p className="item-description">{item.description}</p>
      )}
    </article>
  );
}

function MenuSection({ category, visible }) {
  if (!visible) return null;
  return (
    <section className="menu-section" id={`cat-${category.title}`}>
      <h2>{category.title}</h2>
      {category.filteredItems.map((item) => (
        <MenuItem key={item.name} item={item} />
      ))}
    </section>
  );
}

export default function Menu() {
  const [query, setQuery] = useState("");

  const { filtered, totalCount } = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let total = 0;
    const result = categories.map((cat) => {
      const filteredItems = words.length
        ? cat.items.filter((item) => {
            const text = `${cat.title} ${item.name} ${item.description}`.toLowerCase();
            return words.every((w) => text.includes(w));
          })
        : cat.items;
      total += filteredItems.length;
      return { ...cat, filteredItems };
    });
    return { filtered: result, totalCount: total };
  }, [query]);

  return (
    <main id="menu" className="main-container">
      <div className="menu-intro">
        <p className="eyebrow">Pho Filet</p>
        <h1>Our menu</h1>
        <p className="menu-subtitle">Find your next favorite.</p>
      </div>

      <form className="menu-search" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="dish-search">Search dishes</label>
        <div className="search-controls">
          <input
            id="dish-search"
            type="search"
            placeholder="Search a dish or ingredient..."
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}>
              Clear
            </button>
          )}
        </div>
      </form>

      <p className="search-summary" role="status" aria-live="polite">
        {totalCount} {totalCount === 1 ? "dish" : "dishes"}
        {query.trim() ? " found" : " on the menu"}
      </p>

      <nav className="category-nav" aria-label="Menu categories">
        {filtered.map((cat) =>
          cat.filteredItems.length > 0 ? (
            <a key={cat.title} className="category-link" href={`#cat-${cat.title}`}>
              {cat.title}
            </a>
          ) : null
        )}
      </nav>

      <div id="menu-sections">
        {filtered.map((cat) => (
          <MenuSection
            key={cat.title}
            category={cat}
            visible={cat.filteredItems.length > 0}
          />
        ))}
      </div>

      {totalCount === 0 && (
        <p className="no-results">
          No dishes found. Try another dish name or ingredient, or clear your search.
        </p>
      )}
    </main>
  );
}
