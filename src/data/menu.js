export const categories = [
  {
    title: "Appetizers",
    items: [
      { name: "A1 - Spring Rolls (2pcs)", price: 8.5, description: "Grilled pork, shrimp, lettuce, carrots, cilantro, & rice noodles wrapped in rice paper" },
      { name: "A2 - Fried Egg-Roll (2pcs)", price: 8.5, description: "Pork, carrots, onions, taro & cellophane noodles wrapped in crispy fried wheat paper" },
      { name: "A3 - Crab Rangoon (6pcs)", price: 8.5, description: "Wonton filled with crab, green onion & cream cheese spread. Pinched into little purses, and deep fried" },
      { name: "A9 - Pot Stickers - Steamed or Fried (6pcs)", price: 8.5, description: "Wonton filled with pork & vegetables" },
      { name: "E1 - Edamame", price: 8.5, description: "Boiled soybeans in the pod" },
    ],
  },
  {
    title: "Pho",
    items: [
      { name: "P1 - Beef Pho (with or without Beef Ball)", price: 16.95, description: "" },
      { name: "P10 - Chicken Pho", price: 15.95, description: "" },
      { name: "P11 - Vegetable Pho", price: 15.95, description: "- with Tofu (+ $1.00)\n- without Tofu" },
      { name: "P12 - Shrimp Pho", price: 16.95, description: "" },
    ],
  },
  {
    title: "Vermicelli",
    items: [
      { name: "B1 - Combination Vermicelli", price: 16.95, description: "" },
      { name: "B2 - Egg Roll Vermicelli", price: 15.95, description: "" },
      { name: "B4 - Char-grilled Pork Vermicelli", price: 15.95, description: "" },
      { name: "B5 - Char-grilled Shrimp Vermicelli", price: 15.95, description: "" },
      { name: "B6 - Stir-fried Beef Vermicelli", price: 15.95, description: "" },
      { name: "B7 - Stir-fried Chicken Vermicelli", price: 15.95, description: "" },
      { name: "B8 - Stir-fried Tofu Vermicelli", price: 15.95, description: "" },
    ],
  },
  {
    title: "Plates",
    items: [
      { name: "C1 - Combination with Steamed Rice", price: 16.95, description: "" },
      { name: "C4 - Char-grilled Pork with Steamed Rice", price: 15.95, description: "" },
      { name: "C5 - Char-grilled Shrimp with Steamed Rice", price: 15.95, description: "" },
      { name: "C6 - Stir-fried Beef with Steamed Rice", price: 15.95, description: "" },
      { name: "C7 - Stir-fried Chicken with Steamed Rice", price: 15.95, description: "" },
      { name: "C8 - Stir-fried Tofu with Steamed Rice", price: 15.95, description: "" },
    ],
  },
  {
    title: "Fried Rice",
    items: [
      { name: "F1 - Combination Fried Rice", price: 16.95, description: "" },
      { name: "F2 - Chicken Fried Rice", price: 15.95, description: "" },
      { name: "F3 - Beef Fried Rice", price: 15.95, description: "" },
      { name: "F4 - Shrimp Fried Rice", price: 15.95, description: "" },
    ],
  },
  {
    title: "Lo Mein",
    items: [
      { name: "Combination Lo Mein", price: 16.95, description: "" },
      { name: "Chicken Lo Mein", price: 15.95, description: "" },
      { name: "Beef Lo Mein", price: 15.95, description: "" },
      { name: "Shrimp Lo Mein", price: 15.95, description: "" },
    ],
  },
  {
    title: "Vietnamese Sandwiches",
    items: [
      { name: "S4 - Char-grilled Pork", price: 9.5, description: "" },
      { name: "S6 - Stir-fried Beef", price: 9.5, description: "" },
      { name: "S7 - Stir-fried Chicken", price: 9.5, description: "" },
      { name: "S8 - Stir-fried Tofu", price: 9.5, description: "" },
    ],
  },
  {
    title: "Vegetarian Items",
    items: [
      { name: "ATofu - Vegetable Spring Rolls (2pcs)", price: 8.5, description: "Tofu, lettuce, pickled carrots, cilantro & rice vermicelli noodles wrapped in rice paper" },
      { name: "Vegetable Lo Mein", price: 15.95, description: "- with Tofu (+ $1.00)\n- without Tofu" },
      { name: "Vegetable Pho", price: 15.95, description: "- with Tofu (+ $2.00)\n- without Tofu" },
    ],
  },
  {
    title: "Drinks",
    items: [
      { name: "Boba Drinks", price: 6.99, description: "Strawberry, Watermelon, Mango, Coconut, PassionFruit, Peach, Taro" },
      { name: "Vietnamese Coffee", price: 4.99, description: "" },
      { name: "Hot Jasmine Tea", price: 4.99, description: "" },
      { name: "Soda / Tea / Bottled Water", price: 2.75, description: "" },
    ],
  },
];

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
