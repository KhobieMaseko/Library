class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = crypto.randomUUID();
    }

    toggleReadStatus() {
        this.read = !this.read;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        this.books.push(newBook);
        this.displayBooks();
    }

    removeBook(bookId) {
        const bookIndex = this.books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            this.books.splice(bookIndex, 1);
            this.displayBooks();
        }
    }

    displayBooks() {
        const libraryContainer = document.getElementById('library-container');
        libraryContainer.innerHTML = '';

        this.books.forEach(book => {
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

        document.querySelectorAll('.toggle-read-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = e.target.closest('.book-card').dataset.id;
                const book = this.books.find(book => book.id === bookId);
                book.toggleReadStatus();
                this.displayBooks();
            });
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookId = e.target.closest('.book-card').dataset.id;
                this.removeBook(bookId);
            });
        });
    }
}

const myLibrary = new Library();

// Form handling
const newBookBtn = document.getElementById('new-book-btn');
const bookFormDialog = document.getElementById('book-form-dialog');
const bookForm = document.getElementById('book-form');
const cancelBtn = document.getElementById('cancel-btn');
const submitBtn = document.getElementById('submit-btn');

newBookBtn.addEventListener('click', () => {
    bookFormDialog.showModal();
});

cancelBtn.addEventListener('click', () => {
    bookFormDialog.close();
});

// Character count indicators
document.getElementById('title').addEventListener('input', function() {
    const count = this.value.length;
    const countElement = document.getElementById('title-count');
    countElement.textContent = count;

    const charCount = this.parentElement.querySelector('.char-count');
    if (count > 80) {
        charCount.classList.add('warning');
        charCount.classList.remove('error');
    } else if (count > 95) {
        charCount.classList.add('error');
        charCount.classList.remove('warning');
    } else {
        charCount.classList.remove('warning', 'error');
    }
});

document.getElementById('author').addEventListener('input', function() {
    const count = this.value.length;
    const countElement = document.getElementById('author-count');
    countElement.textContent = count;

    const charCount = this.parentElement.querySelector('.char-count');
    if (count > 40) {
        charCount.classList.add('warning');
        charCount.classList.remove('error');
    } else if (count > 45) {
        charCount.classList.add('error');
        charCount.classList.remove('warning');
    } else {
        charCount.classList.remove('warning', 'error');
    }
});

bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visible');
    });

    // Get form values
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read-status').value === 'read';

    // Validate fields
    let isValid = true;

    // Title validation
    if (!title) {
        showError('title', 'Title is required');
        isValid = false;
    } else if (title.length > 100) {
        showError('title', 'Title must be 100 characters or less');
        isValid = false;
    }

    // Author validation
    if (!author) {
        showError('author', 'Author is required');
        isValid = false;
    } else if (author.length > 50) {
        showError('author', 'Author name must be 50 characters or less');
        isValid = false;
    }

    // Pages validation
    if (!pages) {
        showError('pages', 'Please enter number of pages');
        isValid = false;
    } else {
        const pagesNum = parseInt(pages);
        if (isNaN(pagesNum)) {
            showError('pages', 'Please enter a valid number');
            isValid = false;
        } else if (pagesNum < 1) {
            showError('pages', 'Must be at least 1 page');
            isValid = false;
        } else if (pagesNum > 20000) {
            showError('pages', 'Maximum 20,000 pages allowed');
            isValid = false;
        }
    }

    // If form is valid, proceed with submission
    if (isValid) {
        submitBtn.classList.add('loading');

        // Simulate async operation (like a real API call)
        await new Promise(resolve => setTimeout(resolve, 800));

        myLibrary.addBook(title, author, parseInt(pages), read);
        bookForm.reset();
        document.getElementById('title-count').textContent = '0';
        document.getElementById('author-count').textContent = '0';
        bookFormDialog.close();
        submitBtn.classList.remove('loading');
    }
});

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorMsg = field.nextElementSibling;

    field.classList.add('invalid');
    errorMsg.textContent = message;
    errorMsg.classList.add('visible');
}

// Clear validation on input
document.getElementById('title').addEventListener('input', function() {
    this.classList.remove('invalid');
    this.nextElementSibling.classList.remove('visible');
});

document.getElementById('author').addEventListener('input', function() {
    this.classList.remove('invalid');
    this.nextElementSibling.classList.remove('visible');
});

document.getElementById('pages').addEventListener('input', function() {
    this.classList.remove('invalid');
    this.nextElementSibling.classList.remove('visible');
});

// Add initial books
myLibrary.addBook('The Hobbit', 'J.R.R. Tolkien', 310, true);
myLibrary.addBook('To Kill a Mockingbird', 'Harper Lee', 281, false);
myLibrary.addBook('1984', 'George Orwell', 328, true);
