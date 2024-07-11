// Fetch data from Google Sheets API
const SHEET_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1eFNyOTc1sjFwoBYA5FzB4f-ecGs0w-COjOZ_mXLWBbo/values/Sheet1!A2:I100?key=YOUR_API_KEY';

// Function to fetch books data
async function fetchBooks() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

// Function to display books in index.html
async function displayBooks() {
    const booksContainer = document.getElementById('books-container');
    const booksData = await fetchBooks();

    if (booksData.length === 0) {
        booksContainer.innerHTML = '<p>No books found.</p>';
        return;
    }

    booksContainer.innerHTML = ''; // Clear previous content

    booksData.forEach(book => {
        const [title, cover, author, rating] = book;
        const ratingStars = '★'.repeat(parseInt(rating)); // Create star rating based on number

        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <img src="${cover}" alt="${title}">
            <h2>${title}</h2>
            <p><strong>Author:</strong> ${author}</p>
            <p><strong>Rating:</strong> ${ratingStars} ${rating}</p>
        `;

        bookElement.addEventListener('click', () => {
            // Redirect to book.html with book details
            window.location.href = `book.html?title=${encodeURIComponent(title)}`;
        });

        booksContainer.appendChild(bookElement);
    });
}

// Function to display book details in book.html
async function displayBookDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookTitle = urlParams.get('title');
    const booksData = await fetchBooks();

    const book = booksData.find(book => book[0] === bookTitle);

    if (!book) {
        document.getElementById('book-details-container').innerHTML = '<p>Book not found.</p>';
        return;
    }

    const [title, cover, author, rating, pages, genre, releaseDate, summary, review] = book;
    const ratingStars = '★'.repeat(parseInt(rating)); // Create star rating based on number

    const bookDetailsContainer = document.getElementById('book-details-container');
    bookDetailsContainer.innerHTML = `
        <img src="${cover}" alt="${title}">
        <h2>${title}</h2>
        <p><strong>Author:</strong> ${author}</p>
        <p><strong>Rating:</strong> ${ratingStars} ${rating}</p>
        <p><strong>Pages:</strong> ${pages}</p>
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Release Date:</strong> ${releaseDate}</p>
        <div class="summary"><strong>Summary:</strong> ${summary}</div>
        <p><strong>My Review:</strong> ${review}</p>
    `;
}

// Check which page is currently loaded
if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    displayBooks();
} else if (window.location.pathname === '/book.html') {
    displayBookDetails();
}
