document.addEventListener("DOMContentLoaded", function () {
  const bookList = document.querySelector('#list');
  const showPanel = document.querySelector('#show-panel');

  fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(booksData => displayAllBooks(booksData))

  function displayAllBooks(booksData) {
    bookList.textContent = '';
    booksData.forEach(book => {
      let title = document.createElement('li');
      title.textContent = book.title;
      title.addEventListener('click', () => {
        displayBookDetail(book)
      });
      bookList.append(title);
    })
  }

  function displayBookDetail(book) {
    showPanel.innerHTML = '';

    const thumbnail = document.createElement('img');
    thumbnail.src = book.img_url;

    const bookTitle = document.createElement('h3');
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement('h4');
    bookAuthor.textContent = book.author;

    const bookDescription = document.createElement('p');
    bookDescription.textContent = book.description;

    const listOfLikingUsers = document.createElement('ul');
    book.users.forEach(user => {
      let likingUser = document.createElement('li');
      likingUser.textContent = user.username;
      listOfLikingUsers.append(likingUser);
    });

    showPanel.append(thumbnail)
    showPanel.append(bookTitle);
    showPanel.append(bookAuthor);
    showPanel.append(bookDescription);
    showPanel.append(listOfLikingUsers);

    const likeBtn = document.createElement('button');
    likeBtn.textContent = 'LIKE';
    showPanel.append(likeBtn)

    likeBtn.addEventListener('click', () => {
      likeBook(book);
    });
  }

  function likeBook(book) {
    if (!book.users.find(elem => elem.username === 'Scott')) {
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          users: [...book.users, { id: 11, username: 'Scott' }]
        })
      })
        .then(response => response.json())
        .then(book => {
          displayBookDetail(book) // update DOM currently
          fetch(`http://localhost:3000/books`) // do another fetch  and call displayAllBooks so that they have latest data
            .then(res => res.json())
            .then(books => displayAllBooks(books))
        })
    } else {
      removeLike(book);
    }
  }

  function removeLike(book) {
    let foundUser = book.users.find(elem => elem.username === 'Scott');
    let foundUserIdx = book.users.indexOf(foundUser);
    book.users.splice(foundUserIdx, 1);
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        users: book.users
      })
    })
      .then(response => response.json())
      .then(book => {
        displayBookDetail(book);
        fetch('http://localhost:3000/books')
          .then(res => res.json())
          .then(books => displayAllBooks(books))
      })
  }
});
