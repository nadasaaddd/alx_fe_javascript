// Array to store quote objects
let quotes = [
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

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-category">Category: ${randomQuote.category}</p>`;
}
const newbutton = document.getElementById("newQuote");

newbutton.addEventListener("click", showRandomQuote);

// add new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newCat = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newCat) {
    const newQuote = {
      text: newQuoteText,
      category: newCat,
    };
    quotes.push(newQuote);
    document.getElementById("status").innerText = "✅ Quote added!";
    newQuoteText.value = "";
    newCat.value = "";
  } else {
    document.getElementById("status").innerText =
      "❌ Please enter both text and category.";
  }
}
document.getElementById("addQuote").addEventListener("click", addQuote);
