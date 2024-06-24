function createBookList(id, title, books) {
    let html = `
    <div class="books">
        <div class="books__header">
          <img class="books__header__arrow" src="../Resources/Svg/chevron-left.svg" onclick="deadvanceList('${title}')">
    
          <div class="books__title">
            <p class="books__title__text">${title}</p>
            <a style="text-decoration: none" href="/view_books/category/${id}"><p class="books__title__subtitle">See All</p></a>
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

function createBook(id, title, author, image, rating, numRatings) {
    let totalBookStarsCount = Math.round(parseFloat(rating));
    console.log(rating);
    return `
    <a class="books__items__item" href="/book/${id}">
        <div class="books__items__item__cover">
          <img class="books__items__item__cover__image" src=${image}>
        </div>

        <div class="books__items__item__data">
          <p class="books__items__item__data__title">${title}</p>
          <p class="books__items__item__data__author">${author}</p>
        </div>
        
        <div class="books__list__item__info__rating">
            <img class="books__list__item__info__rating__${totalBookStarsCount >= 1 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
            <img class="books__list__item__info__rating__${totalBookStarsCount >= 2 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
            <img class="books__list__item__info__rating__${totalBookStarsCount >= 3 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
            <img class="books__list__item__info__rating__${totalBookStarsCount >= 4 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
            <img class="books__list__item__info__rating__${totalBookStarsCount >= 5 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
            <p class="books__list__item__info__rating_text">${parseFloat(rating).toFixed(2)}</p>
        </div>
        <p class="books__list__item__info__ratings">${numRatings} ratings</p>
      </a>
    `;
}