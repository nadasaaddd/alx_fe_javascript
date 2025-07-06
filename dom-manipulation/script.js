// 🔁 Load quotes from localStorage OR use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The only way to do great work is to love what you do.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "Inspiration",
  },
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// 🔒 Save quotes and filter
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// 🎲 Show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>Category: ${randomQuote.category}</p>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// 📊 Populate categories dropdown
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  if (!dropdown) return;

  dropdown.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  dropdown.appendChild(allOption);

  const categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  dropdown.value = selectedCategory;
}

// 🔍 Filter and display quotes
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  saveSelectedCategory(category);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filtered =
    category === "all" ? quotes : quotes.filter((q) => q.category === category);

  filtered.forEach((q) => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ➕ Add a new quote
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

// 📥 Import quotes from file
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
    } catch {
      alert("❌ Could not read file.");
    }
  };

  reader.readAsText(file);
}

// 🛜 Simulated server sync
function syncWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts?_limit=3") // Simulated quotes
    .then((response) => response.json())
    .then((serverData) => {
      const serverQuotes = serverData.map((post) => ({
        text: post.title,
        category: "Server",
      }));

      let conflictResolved = false;

      // Check for conflicts (same text, different category)
      serverQuotes.forEach((sq) => {
        const local = quotes.find((q) => q.text === sq.text);
        if (!local) {
          quotes.push(sq);
          conflictResolved = true;
        }
      });

      if (conflictResolved) {
        saveQuotes();
        populateCategories();
        filterQuotes();

        const syncNote = document.getElementById("syncStatus");
        if (syncNote) {
          syncNote.textContent = "⚠️ Quotes updated from server.";
        }
      }
    })
    .catch((err) => {
      console.log("Server sync failed", err);
    });
}

// ▶️ Init on load
window.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    const quoteDisplay = document.getElementById("quoteDisplay");
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" — ${quote.category}`;
    quoteDisplay.appendChild(p);
  }

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  document.getElementById("addQuote").addEventListener("click", addQuote);
  document.getElementById("exportBtn").addEventListener("click", exportQuotes);
  document
    .getElementById("importFile")
    .addEventListener("change", importQuotes);
  const filterDropdown = document.getElementById("categoryFilter");
  if (filterDropdown) filterDropdown.addEventListener("change", filterQuotes);

  // ⏱ Sync with server every 20 seconds
  setInterval(syncWithServer, 20000);
});
