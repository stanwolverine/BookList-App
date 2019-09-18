const newEl = document.createElement('div');
newEl.innerHTML = '<p style="color: red">Please Fill all fields.</p>';
const output = document.getElementById('error');

// Book Class : Represents a book
class Book {
  constructor(title, author, isbnNumber) {
    this.title = title;
    this.author = author;
    this.isbnNumber = isbnNumber;
  }
}

// UI Class : Handle UI Class
class UIHandle {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => UIHandle.addBooksToUI(book));
  }

  static addBooksToUI(book) {
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbnNumber}</td>
            <td><i class="far fa-trash-alt btn btn-danger delete"></i></td>
        `;

    list.insertBefore(row, list.firstElementChild);
  }

  static showAlert(message, className) {
    // Making the structure of alert
    const div = document.createElement('div');
    div.className = `alert alert-${className} msg`;
    div.appendChild(document.createTextNode(message));

    // Adding to UI
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Removing Automatically From UI
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 2000);
  }

  static clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  static deleteBook(element) {
    if (element.classList.contains('delete')) {
      element.parentNode.parentNode.remove();
    }
  }

  static deleteWarning() {
    if (output) {
      output.remove();
    }
  }
}

// Store Class: Handles storage

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books')) {
      books = JSON.parse(localStorage.getItem('books'));
    } else {
      books = [];
    }
    return books;
  }

  static addBook({ title, author, isbnNumber }) {
    let books;
    !!localStorage.getItem('books')
      ? (books = JSON.parse(localStorage.getItem('books')))
      : (books = []);
    books = [...books, { title, author, isbnNumber }];
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    let books = JSON.parse(localStorage.getItem('books'));
    books = books.filter(book => !(book.isbnNumber === isbn));
    localStorage.setItem('books', JSON.stringify(books));
  }
}

//Event: Display Books

document.addEventListener('DOMContentLoaded', UIHandle.displayBooks());

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', e => {
  e.preventDefault();
  // Getting Title Input
  const titleInput = document.getElementById('title');

  // Get Form Values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbnNumber = document.getElementById('isbn').value;

  // Instatiate Book
  if (title && author && isbnNumber) {
    const book = new Book(title, author, isbnNumber);

    // Add books to Array & Local Storage
    Store.addBook(book);

    // Add books to UI
    UIHandle.addBooksToUI(book);

    // Clear Fields
    UIHandle.clearFields();

    // Delete Error message
    UIHandle.deleteWarning();

    // Showing success alert
    UIHandle.showAlert('Book Added', 'info');

    // focusing back on title input of form
    titleInput.focus();
  } else {
    output.appendChild(newEl);
    UIHandle.showAlert('Please fill all the fields', 'danger');
  }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    UIHandle.deleteBook(e.target);
    UIHandle.showAlert('Book Deleted', 'success');
    Store.removeBook(e.target.parentNode.previousElementSibling.textContent);
  }
});

// Event: Search Books
document.getElementById('search-books').addEventListener('keyup', e => {
  e.preventDefault();
  // Get Form Values
  const searchInput = e.target.value.toLowerCase();

  // Getting Book List
  const bookList = document.getElementById('book-list');
  // Getting all table rows inside that bookList
  const trs = bookList.getElementsByTagName('tr');
  Array.from(trs).forEach(tr => {
    const isMatching = Array.from(tr.children).some(td =>
      td.textContent
        .toLowerCase()
        .replace(/ /g, '')
        .includes(searchInput)
    );
    if (isMatching) {
      tr.style.display = 'table-row';
      Array.from(tr.children).forEach(td => {
        if (
          td.textContent
            .toLowerCase()
            .replace(/ /g, '')
            .includes(searchInput) &&
          searchInput.length > 0
        ) {
          td.style.backgroundColor = 'yellow';
        } else {
          td.style.backgroundColor = 'initial';
        }
      });
    } else {
      tr.style.display = 'none';
    }
  });
  // Get Books
  // let allBooks = Store.getBooks();
  // console.log(typeof allBooks[0].isbnNumber);

  // if (searchInput && typeof searchInput === typeof 'string') {
  //   let filteredBooks = allBooks.filter(({ title, author, isbnNumber }) => {
  //     title = title.toLowerCase();
  //     author = author.toLowerCase();

  //     return (
  //       title.includes(searchInput) ||
  //       author.includes(searchInput) ||
  //       isbnNumber.includes(isbnNumber)
  //     );
  //   });
  //   console.log(filteredBooks);
  // } else {
  //   let filteredBooks = [{ title: 'nothing' }];
  //   console.log(filteredBooks);
  // }
});
