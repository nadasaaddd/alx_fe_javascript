// Array to store quote objects
// Load saved quotes or default ones
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

//Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

  quoteDisplay.innerHTML = `<p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-category">Category: ${randomQuote.category}</p>`;
}
//------------------
const newbutton = document.getElementById("newQuote");
newbutton.addEventListener("click", showRandomQuote);

const status = document.getElementById("status");
const statText = document.createElement("p");
status.appendChild(statText);
// ---------------add new quote
function createAddQuoteForm() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newCat = document.getElementById("newQuoteCategory").value.trim();
  // loop for check input
  if (newQuoteText && newCat) {
    const newQuote = {
      text: newQuoteText,
      category: newCat,
    };
    quotes.push(newQuote);
    statText.textContent = "✅ Quote added!";
    newQuoteText.value = "";
    newCat.value = "";
  } else {
    statText.textContent = "❌ Please enter both text and category.";
  }
}
document
  .getElementById("addQuote")
  .addEventListener("click", createAddQuoteForm);
// 📤 Export quotes as JSON file
document.getElementById("exportBtn").addEventListener("click", () => {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.textContent = "Click here to download quotes.json";
  downloadLink.style.display = "inline";
});

// 📥 Import quotes from uploaded JSON file
document.getElementById("importFile").addEventListener("change", (event) => {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("✅ Quotes imported successfully!");
      } else {
        alert("❌ Invalid file format.");
      }
    } catch {
      alert("❌ Failed to read JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
});
