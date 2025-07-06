let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Do what you love.", category: "Motivation" },
  { text: "Keep going.", category: "Inspiration" },
  { text: "Stay strong.", category: "Life" },
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save selected filter category
function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// Show quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  saveSelectedCategory(selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// Build the dropdown options
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  dropdown.innerHTML = "";

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

  // Restore last selected filter
  dropdown.value = selectedCategory;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();
  const status = document.getElementById("status");

  if (text && cat) {
    quotes.push({ text, category: cat });
    saveQuotes();
    populateCategories();
    filterQuotes();
    status.textContent = "✅ Quote added!";
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    status.textContent = "❌ Please enter both quote and category.";
  }
}

// On page load
window.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("addQuote").addEventListener("click", addQuote);
});
