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

// 🔒 Save quotes and selected filter to localStorage
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

// 📊 Populate category dropdown
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

// 🔍 Filter and display quotes by selected category
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

// ➕ Add a new quote and POST to server
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput = document.getElementById("newQuoteCategory");
  const status = document.getElementById("status");

  const text = textInput.value.trim();
  const category = catInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();

    status.textContent = "✅ Quote added!";
    textInput.value = "";
    catInput.value = "";

    // 🔄 POST new quote to mock server
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(newQuote),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Quote sent to server:", data);
        showSyncMessage("Quotes synced with server!");
      });
  } else {
    status.textContent = "❌ Please fill both fields.";
  }
}

// 📤 Export quotes to a JSON file
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

// 📥 Import quotes from a JSON file
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

// ✅ UI sync message
function showSyncMessage(message) {
  const syncStatus = document.getElementById("syncStatus");
  syncStatus.textContent = message;
  syncStatus.style.color = "green";
  setTimeout(() => {
    syncStatus.textContent = "";
  }, 5000);
}

// ✅ Fetch from mock API using async/await
async function fetchQuotesFromServer() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  const data = await response.json();
  return data.map((post) => ({
    text: post.title,
    category: "Server",
  }));
}

// ✅ Sync with server, resolve conflicts
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    let updated = false;

    serverQuotes.forEach((serverQ) => {
      const exists = quotes.find((local) => local.text === serverQ.text);
      if (!exists) {
        quotes.push(serverQ);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      showSyncMessage("⚠️ Synced: New quotes fetched from server.");
    }
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// ▶️ On page load
window.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();

  // Show last quote from sessionStorage
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    const quoteDisplay = document.getElementById("quoteDisplay");
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" — ${quote.category}`;
    quoteDisplay.appendChild(p);
  }

  // Add listeners
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  document.getElementById("addQuote").addEventListener("click", addQuote);
  document.getElementById("exportBtn").addEventListener("click", exportQuotes);
  document
    .getElementById("importFile")
    .addEventListener("change", importQuotes);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterQuotes);

  // Periodic server sync every 20 seconds
  setInterval(syncQuotes, 20000);
});
