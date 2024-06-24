function createBookList(title, books) {
    let html = `
        <div class="books">
            <p class="books__title">${title}</p>
            <div class="books__list">
    `;

    books.forEach(x => html += x);

    html += `
    </div>
  </div>`;

    return html;
}

function createBook(id, title, author, image, rating, ratings) {
    let totalBookStarsCount = Math.round(parseFloat(rating));
    return `
                 <div class="books__list__item">
                    <img class="books__list__item__image" src=${image}>
                    <div class="books__list__item__info">
                        <p class="books__list__item__info__title">${title}</p>
                        <p class="books__list__item__info__author">${author}</p>
                        <div class="books__list__item__info__rating">
                            <img class="books__list__item__info__rating__${totalBookStarsCount >= 1 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
                            <img class="books__list__item__info__rating__${totalBookStarsCount >= 2 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
                            <img class="books__list__item__info__rating__${totalBookStarsCount >= 3 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
                            <img class="books__list__item__info__rating__${totalBookStarsCount >= 4 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
                            <img class="books__list__item__info__rating__${totalBookStarsCount >= 5 ? "star" : "empty"}" src="../Resources/Svg/star.svg">
                            <p class="books__list__item__info__rating_text">${parseFloat(rating).toFixed(2)}</p>
                        </div>
                        <p class="books__list__item__info__ratings">${ratings} ratings</p>

                        <a class="books__list__item__info__view" href="/book/${id}">
                            <p class="books__list__item__info__view__text">View</p>
                        </a>
                    </div>
                    <div class="books__list__item__buttons">
                        <!--<img class="books__list__item__buttons__button" src="../Resources/Svg/bookmark.svg">
                        <img class="books__list__item__buttons__button" src="../Resources/Svg/heart.svg">
                        <img class="books__list__item__buttons__button" src="../Resources/Svg/options.svg">
                    !--></div>
                </div>
    `;
}
