const myLibrary = [];

// Book constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
}

// Toggle read status prototype method
Book.prototype.toggleReadStatus = function() {
    this.read = !this.read;
};

// Function to add book to library
function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    displayBooks();
}

// Function to display books
function displayBooks() {
    const libraryContainer = document.getElementById('library-container');
    libraryContainer.innerHTML = '';

    myLibrary.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.dataset.id = book.id;

        bookCard.innerHTML = `
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-pages">${book.pages} pages</p>
            <p class="book-read-status ${book.read ? 'read' : 'not-read'}">
                ${book.read ? 'Read' : 'Unread'}
            </p>
            <div class="book-actions">
                <button class="toggle-read-btn">Toggle Read</button>
                <button class="remove-btn">Remove</button>
            </div>
        `;

        libraryContainer.appendChild(bookCard);
    });

    // Add event listeners to all toggle buttons
    document.querySelectorAll('.toggle-read-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = e.target.closest('.book-card').dataset.id;
            const book = myLibrary.find(book => book.id === bookId);
            book.toggleReadStatus();
            displayBooks();
        });
    });

    // Add event listeners to all remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = e.target.closest('.book-card').dataset.id;
            const bookIndex = myLibrary.findIndex(book => book.id === bookId);
            myLibrary.splice(bookIndex, 1);
            displayBooks();
        });
    });
}

// Form handling
const newBookBtn = document.getElementById('new-book-btn');
const bookFormDialog = document.getElementById('book-form-dialog');
const bookForm = document.getElementById('book-form');
const cancelBtn = document.getElementById('cancel-btn');

newBookBtn.addEventListener('click', () => {
    bookFormDialog.showModal();
});

cancelBtn.addEventListener('click', () => {
    bookFormDialog.close();
});

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = parseInt(document.getElementById('pages').value);
    const read = document.getElementById('read-status').value === 'read';

    addBookToLibrary(title, author, pages, read);

    bookForm.reset();
    bookFormDialog.close();
});

// Some initial sample books
addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 310, true);
addBookToLibrary('To Kill a Mockingbird', 'Harper Lee', 281, false);
addBookToLibrary('1984', 'George Orwell', 328, true);
