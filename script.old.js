const menuContainer = document.querySelector("#menu-sections");

const Appetizers = {
  title: "Appetizers",
  position: 0,
  items: {
    item1: {
      name: "A1 - Spring Rolls (2pcs)",
      price: 8.5,
      description:
        "Grilled pork, shrimp, lettuce, carrots, cilantro, & rice noodles wrapped in rice paper",
    },
    item2: {
      name: "A2 - Fried Egg-Roll (2pcs)",
      price: 8.5,
      description:
        "Pork, carrots, onions,taro & cellophane noodles wrapped in crispy fried wheat paper",
    },
    item3: {
      name: "A3 - Crab Rangoon (6pcs)",
      price: 8.5,
      description:
        "Wonton filled with crab, green onion & cream cheese spread. Pinched into little purses, and deep fried",
    },
    item4: {
      name: "A9 - Pot Stickers - Steamed or Fried (6pcs)",
      price: 8.5,
      description: "Wonton filled with pork & vegetables",
    },
    item5: {
      name: "E1 - Edamame",
      price: 8.5,
      description: "Boiled soybeans in the pod",
    },
  },
};

const Pho = {
  title: "Pho",
  position: 1,
  items: {
    item1: {
      name: "P1 - Beef Pho (with or without Beef Ball)",
      price: 16.95,
      description: "",
    },
    item2: {
      name: "P10 - Chicken Pho",
      price: 15.95,
      description: "",
    },
    item3: {
      name: "P11 - Vegetable Pho",
      price: 15.95,
      description: "- with Tofu (+ 1.00) <br> - without Tofu",
    },
    item4: {
      name: "P12 - Shrimp Pho",
      price: 16.95,
      description: "",
    },
  },
};

const Vermicelli = {
  title: "Vermicelli",
  position: 2,
  items: {
    item1: {
      name: "B1 - Combination Vermicelli",
      price: 16.95,
      description: "",
    },
    item2: {
      name: "B2 - Egg Roll Vermicelli",
      price: 15.95,
      description: "",
    },
    item3: {
      name: "B4 - Char-grilled Pork Vermicelli",
      price: 15.95,
      description: "",
    },
    item4: {
      name: "B5 - Char-grilled Shrimp Vermicelli",
      price: 15.95,
      description: "",
    },
    item5: {
      name: "B6 - Stir-fried Beef Vermicelli",
      price: 15.95,
      description: "",
    },
    item6: {
      name: "B7 - Stir-fried Chicken Vermicelli",
      price: 15.95,
      description: "",
    },
    item7: {
      name: "B8 - Stir-fried Tofu Vermicelli",
      price: 15.95,
      description: "",
    },
  },
};

const Plates = {
  title: "Plates",
  position: 3,
  items: {
    item1: {
      name: "C1 - Combination with Steamed Rice",
      price: 16.95,
      description: "",
    },
    item2: {
      name: "C4 - Char-grilled Pork with Steamed Rice",
      price: 15.95,
      description: "",
    },
    item3: {
      name: "C5 - Char-grilled Shrimp with Steamed Rice",
      price: 15.95,
      description: "",
    },
    item4: {
      name: "C6 - Stir-fried Beef with Steamed Rice",
      price: 15.95,
      description: "",
    },
    item5: {
      name: "C7 - Stir-fried Chicken with Steamed Rice",
      price: 15.95,
      description: "",
    },
    item6: {
      name: "C8 - Stir-fried Tofu with Steamed Rice",
      price: 15.95,
      description: "",
    },
  },
};

const Fried_Rice = {
  title: "Fried Rice",
  position: 4,
  items: {
    item1: {
      name: "F1 - Combination Fried Rice",
      price: 16.95,
      description: "",
    },
    item2: {
      name: "F2 - Chicken Fried Rice",
      price: 15.95,
      description: "",
    },
    item3: {
      name: "F3 - Beef Fried Rice",
      price: 15.95,
      description: "",
    },
    item4: {
      name: "F4 - Shrimp Fried Rice",
      price: 15.95,
      description: "",
    },
  },
};

const Lo_Mein = {
  title: "Lo Mein",
  position: 5,
  items: {
    item1: {
      name: "Combination Lo Mein",
      price: 16.95,
      description: "",
    },
    item2: {
      name: "Chicken Lo Mein",
      price: 15.95,
      description: "",
    },
    item3: {
      name: "Beef Lo Mein",
      price: 15.95,
      description: "",
    },
    item4: {
      name: "Shrimp Lo Mein",
      price: 15.95,
      description: "",
    },
  },
};

const Vietnamese_Sandwiches = {
  title: "Vietnamese Sandwiches",
  position: 6,
  items: {
    item1: {
      name: "S4 - Char-grilled Pork",
      price: 9.5,
      description: "",
    },
    item2: {
      name: "S6 - Stir-fried Beef",
      price: 9.5,
      description: "",
    },
    item3: {
      name: "S7 - Stir-fried Chicken",
      price: 9.5,
      description: "",
    },
    item4: {
      name: "S8 - Stir-fried Tofu",
      price: 9.5,
      description: "",
    },
  },
};

const Vegetarian_Items = {
  title: "Vegetarian Items",
  position: 7,
  items: {
    item1: {
      name: "ATofu - Vegetable Spring Rolls (2pcs)",
      price: 8.5,
      description:
        "Tofu, lettuce, pickled carrots, cilantro & rice vermicelli noodles wrapped in rice paper",
    },
    item2: {
      name: "Vegetable Lo Mein",
      price: 15.95,
      description: "- with Tofu (+ 1.00) <br> - without Tofu",
    },
    item3: {
      name: "Vegetable Pho",
      price: 15.95,
      description: "- with Tofu (+ 2.00) <br> - without Tofu",
    },
  },
};

const Drinks = {
  title: "Drinks",
  position: 8,
  items: {
    item1: {
      name: "Boba Drinks",
      price: 6.99,
      description:
        "Strawberry, Watermelon, Mango, Coconut, PassionFruit, Peach, Taro",
    },
    item2: {
      name: "Vietnamese Coffee",
      price: 4.99,
      description: "",
    },
    item3: {
      name: "Hot Jasmine Tea",
      price: 4.99,
      description: "",
    },
    item4: {
      name: "Soda / Tea / Bottled Water",
      price: 2.75,
      description: "",
    },
  },
};
const categories = [
  Appetizers, Pho, Vermicelli, Plates, Fried_Rice, Lo_Mein,
  Vietnamese_Sandwiches, Vegetarian_Items, Drinks,
];
const categoryNav = document.querySelector("#category-nav");
const searchInput = document.querySelector("#dish-search");
const clearSearch = document.querySelector("#clear-search");
const searchSummary = document.querySelector("#search-summary");
const noResults = document.querySelector("#no-results");
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const renderedCategories = categories.map((category) => {
  const section = document.createElement("section");
  section.className = "menu-section";
  section.id = `category-${category.position}`;
  const heading = document.createElement("h2");
  heading.id = `${section.id}-title`;
  heading.textContent = category.title;
  section.setAttribute("aria-labelledby", heading.id);
  section.append(heading);

  const link = document.createElement("a");
  link.className = "category-link";
  link.href = `#${section.id}`;
  link.textContent = category.title;
  categoryNav.append(link);

  const items = Object.values(category.items).map((item) => {
    const article = document.createElement("article");
    article.className = "menu-item";
    const row = document.createElement("div");
    row.className = "menu-item-heading";
    const name = document.createElement("h3");
    name.className = "item_name";
    name.textContent = item.name;
    const price = document.createElement("span");
    price.className = "item_price";
    price.textContent = currency.format(item.price);
    row.append(name, price);
    article.append(row);
    const description = item.description.replace(/<br\s*\/?>/gi, "\n");
    if (description) {
      const paragraph = document.createElement("p");
      paragraph.className = "item_description";
      paragraph.textContent = description;
      article.append(paragraph);
    }
    section.append(article);
    return {
      element: article,
      searchText: `${category.title} ${item.name} ${description}`.toLowerCase(),
    };
  });
  menuContainer.append(section);
  return { section, link, items };
});

let selectedCategory = null;

function updateActiveCategory() {
  const visible = renderedCategories.filter(({ section }) => !section.hidden);
  const marker = categoryNav.getBoundingClientRect().bottom + 14;
  let active = visible[0];
  for (const category of visible) {
    if (category.section.getBoundingClientRect().top <= marker) active = category;
  }
  if (window.scrollY > 0 &&
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    active = visible[visible.length - 1];
  }
  // The page bottom can prevent the clicked section from reaching the sticky bar.
  if (selectedCategory && !selectedCategory.category.section.hidden &&
      Math.abs(window.scrollY - selectedCategory.scrollY) <= 1) {
    active = selectedCategory.category;
  } else {
    selectedCategory = null;
  }
  for (const category of renderedCategories) {
    if (category === active) {
      category.link.setAttribute("aria-current", "location");
    } else {
      category.link.removeAttribute("aria-current");
    }
  }
}

function updateCategoryOffset() {
  if (!categoryNav.hidden) {
    document.documentElement.style.setProperty(
      "--category-offset", `${categoryNav.getBoundingClientRect().height + 12}px`
    );
  }
  updateActiveCategory();
}

function selectLinkedCategory() {
  const category = renderedCategories.find(({ link }) => link.hash === location.hash);
  if (category && !category.section.hidden) {
    selectedCategory = { category, scrollY: window.scrollY };
    updateActiveCategory();
  }
}

function filterMenu() {
  selectedCategory = null;
  const words = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let count = 0;
  for (const category of renderedCategories) {
    let matches = 0;
    for (const item of category.items) {
      item.element.hidden = !words.every((word) => item.searchText.includes(word));
      if (!item.element.hidden) matches++;
    }
    category.section.hidden = matches === 0;
    category.link.hidden = matches === 0;
    count += matches;
  }
  searchSummary.textContent = `${count} ${count === 1 ? "dish" : "dishes"}${words.length ? " found" : " on the menu"}`;
  clearSearch.hidden = searchInput.value.length === 0;
  noResults.hidden = count !== 0;
  categoryNav.hidden = count === 0;
  updateActiveCategory();
}

document.querySelector(".menu-search").addEventListener("submit", (event) => {
  event.preventDefault();
});
searchInput.addEventListener("input", filterMenu);
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  filterMenu();
  searchInput.focus();
});
document.addEventListener("scroll", updateActiveCategory, { passive: true });
categoryNav.addEventListener("click", (event) => {
  if (event.target.closest(".category-link")) {
    requestAnimationFrame(selectLinkedCategory);
  }
});
window.addEventListener("hashchange", () => requestAnimationFrame(selectLinkedCategory));
new ResizeObserver(updateCategoryOffset).observe(categoryNav);

const hoursDisclosure = document.querySelector(".hours-disclosure");
const hoursToggle = document.querySelector(".hours-toggle");
const restaurantDetails = document.querySelector("#restaurant-details");

function setHoursExpanded(expanded) {
  hoursToggle.setAttribute("aria-expanded", String(expanded));
  restaurantDetails.hidden = !expanded;
}

hoursToggle.addEventListener("click", () => {
  setHoursExpanded(hoursToggle.getAttribute("aria-expanded") !== "true");
});
document.addEventListener("click", (event) => {
  if (!hoursDisclosure.contains(event.target)) setHoursExpanded(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !restaurantDetails.hidden) {
    setHoursExpanded(false);
    hoursToggle.focus();
  }
});
document.addEventListener("focusin", (event) => {
  if (!hoursDisclosure.contains(event.target)) setHoursExpanded(false);
});
filterMenu();
updateCategoryOffset();
requestAnimationFrame(selectLinkedCategory);
