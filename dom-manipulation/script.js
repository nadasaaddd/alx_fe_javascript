// 🔁 Load quotes from localStorage OR use default ones
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" }
];

// 🔁 Load last selected category or default to "all"
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// 🔒 Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// 🔒 Save selected category to localStorage
function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// 🎲 Show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <p>Category: ${randomQuote.category}</p>
  `;

  // Save last quote to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// 📊 Populate unique categories in dropdown
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  if (!dropdown) return;

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

  dropdown.value = selectedCategory;
}

// 🔍 Filter and display quotes by category
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  saveSelectedCategory(category);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filtered = category === "all"
    ? quotes
    : quotes.filter(q => q.category === category);

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ➕ Add new quote and update dropdown
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput = document.getElementById("newQuoteCategory");
  const status = document.getElementById("status");

  const text = textInput.value.trim();
  const category = catInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();

    status.textContent = "✅ Quote added!";
    textInput.value = "";
    catInput.value = "";
  } else {
    status.textContent = "❌ Please fill both fields.";
  }
}

// 📤 Export quotes to JSON
function exportQuotes() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.textContent = "Click here to download your quotes!";
  downloadLink.style.display = "inline";
}

// 📥 Import quotes from JSON file
function importQuotes(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("✅ Quotes imported!");
      } else {
        alert("❌ Invalid JSON format.");
      }
    } catch (err) {
      alert("❌ Could not read file.");
    }
  };

  reader.readAsText(file);
}

// ▶️ Run on page load
window.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();

  // Show last viewed quote (optional)
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    const quoteDisplay = document.getElementById("quoteDisplay");
    const p = document.createElement
