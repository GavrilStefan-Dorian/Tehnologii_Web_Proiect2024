function createBookList(title, books) {
    let html = `
    <div class="books">
        <div class="books__header">
          <img class="books__header__arrow" src="../Resources/Svg/chevron-left.svg" onclick="deadvanceList('${title}')">
    
          <div class="books__title">
            <p class="books__title__text">${title}</p>
            <p class="books__title__subtitle">See All</p>
          </div>
    
          <img class="books__arrow" src="../Resources/Svg/chevron-right.svg" onclick="advanceList('${title}')">
        </div>
    
        <div id="${title}_items" class="books__items">
    `;

    books.forEach(x => html += x);

    html += `
    </div>
  </div>`;

    return html;
}

function createBook(title, author, image) {
    return `
    <a class="books__items__item" href="/book">
        <div class="books__items__item__cover">
          <img class="books__items__item__cover__image" src=${image}>
        </div>

        <div class="books__items__item__data">
          <p class="books__items__item__data__title">${title}</p>
          <p class="books__items__item__data__author">${author}</p>
        </div>
      </a>
    `;
}