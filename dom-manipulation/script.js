// 🔁 Load saved quotes or use default ones
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Do what you love.", category: "Motivation" },
  { text: "Keep going.", category: "Inspiration" },
  { text: "Stay strong.", category: "Life" },
];

// 🔁 Load last selected category
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// 🧠 Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// 🧠 Save selected filter to localStorage
function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// 🎯 Show filtered quotes
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  saveSelectedCategory(category);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear old quotes

  const filtered = category === "all"
    ? quotes
    : quotes.filter(q => q.category === category);

  // Show each quote
  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// 🧾 Build dropdown from quote categories
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  dropdown.innerHTML = ""; // Clear existing options

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  dropdown.appendChild(allOption);

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  // Restore previous selected filter
  dropdown.value = selectedCategory;
}

// ➕ Add new quote + update dropdown
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();
  const status = document.getElementById("status");

  if (text && cat) {
    quotes.push({ text, category: cat });
    saveQuotes();

    populateCategories(); // update filter dropdown
    filterQuotes(); // show updated list

    status.textContent = "✅ Quote added!";
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    status.textContent = "❌ Please enter both quote and category.";
  }
}

// 📌 Run when page loads
window.addEventListener("DOMContentLoaded", () => {
  populateCategories(); // Fill dropdown
  filterQuotes();       // Show filtered quotes
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("addQuote").addEventListener("click", addQuote);
});
