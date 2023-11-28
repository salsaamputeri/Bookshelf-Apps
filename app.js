document.addEventListener('DOMContentLoaded', function () {
    const unfinishedList = document.getElementById('unfinishedList');
    const finishedList = document.getElementById('finishedList');
    const addBookButton = document.getElementById('addBook');
    const searchInput = document.getElementById('search');

    addBookButton.addEventListener('click', addBookToShelf);
    searchInput.addEventListener('input', filterBooks);

    let books = JSON.parse(localStorage.getItem('books')) || [];

    refreshBookshelves();

    function addBookToShelf() {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = parseInt(document.getElementById('year').value);
        const isComplete = document.getElementById('isComplete').checked;
        const id = +new Date();

        const book = {
            id,
            title,
            author,
            year,
            isComplete
        };

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        refreshBookshelves();

        // Clear input fields
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('year').value = '';
        document.getElementById('isComplete').checked = false;
    }

    function moveBook(id, toComplete) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].isComplete = toComplete;
            localStorage.setItem('books', JSON.stringify(books));
            refreshBookshelves();
        }
    }

    function deleteBook(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books.splice(index, 1);
            localStorage.setItem('books', JSON.stringify(books));
            refreshBookshelves();
        }
    }

    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
        refreshBookshelves(filteredBooks);
    }

    function refreshBookshelves(filteredBooks) {
        unfinishedList.innerHTML = '';
        finishedList.innerHTML = '';

        const booksToDisplay = filteredBooks || books;

        for (const book of booksToDisplay) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${book.title}</strong><br> by <em>${book.author}</em></br>(${book.year})</span>
                <button class="moveButton">${book.isComplete ? '<i class="fas fa-undo"></i> ' : '<i class="fas fa-check"></i> '}
                <button class="deleteButton"><i class="fas fa-trash-alt"></i></button>
            `;

            const moveButton = li.querySelector('.moveButton');
            const deleteButton = li.querySelector('.deleteButton');

            moveButton.addEventListener('click', () => moveBook(book.id, !book.isComplete));
            deleteButton.addEventListener('click', () => showDeleteDialog(book.id));

            if (book.isComplete) {
                finishedList.appendChild(li);
            } else {
                unfinishedList.appendChild(li);
            }
        }
    }

    function showDeleteDialog(id) {
        const dialogOverlay = document.createElement('div');
        dialogOverlay.classList.add('dialog-overlay');
        const dialogBox = document.createElement('div');
        dialogBox.classList.add('dialog-box');
        dialogBox.innerHTML = `
            <p>Buku akan dihapus dari rak buku?</p>
            <button class="dialog-button" id="confirmDelete">Hapus</button>
            <button class="dialog-button" id="cancelDelete">Batal</button>
        `;
        dialogOverlay.appendChild(dialogBox);
        document.body.appendChild(dialogOverlay);

        const confirmDeleteButton = document.getElementById('confirmDelete');
        const cancelDeleteButton = document.getElementById('cancelDelete');

        confirmDeleteButton.addEventListener('click', () => {
            deleteBook(id);
            closeDeleteDialog();
        });

        cancelDeleteButton.addEventListener('click', () => closeDeleteDialog());

        function closeDeleteDialog() {
            dialogOverlay.remove();
        }
    }
});