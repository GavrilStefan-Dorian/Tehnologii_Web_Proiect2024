function createSidebar(selected) {
    const selectableItems = [
        '<img class="sidebar__items__container__item" src="../Resources/Svg/home.svg">',
        '<img class="sidebar__items__container__item" src="../Resources/Svg/book.svg">',
        '<img class="sidebar__items__container__item" src="../Resources/Svg/search.svg">',
        '<img class="sidebar__items__container__item" src="../Resources/Svg/groups.svg">'
    ];

    let html = `
<div class="sidebar">
    <div class="sidebar__items">
         <img class="sidebar__items__profile" src="../Resources/Images/Profile.png">
    `;

    let index = 0;
    selectableItems.forEach(x => {
        if(index++ === selected)
            html += '<div class="sidebar__items__container sidebar__items__container--selected">';
        else html += '<div class="sidebar__items__container">';

        html += x;
        html += '</div>';
    })

    html += `
    </div>

  <div class="sidebar__items sidebar__items--bottom">
    <div class="sidebar__items__container">
      <img class="sidebar__items__container__item" src="../Resources/Svg/logout.svg">
    </div>
  </div>
</div>
    `;

    document.body.innerHTML += html;
}

function createBookList(title, books) {
    let html = `
    <div class="books">
        <div class="books__header">
          <img class="books__header__arrow" src="../Resources/Svg/chevron-left.svg">
    
          <div class="books__title">
            <p class="books__title__text">${title}</p>
            <p class="books__title__subtitle">See All</p>
          </div>
    
          <img class="books__arrow" src="../Resources/Svg/chevron-right.svg">
        </div>
    
        <div class="books__items">
    `;

    books.forEach(x => html += x);

    html += `
    </div>
  </div>`;

    return html;
}

function createBook(title, author, image) {
    return `
    <div class="books__items__item">
        <div class="books__items__item__cover">
          <img class="books__items__item__cover__image" src=${image}>
        </div>

        <div class="books__items__item__data">
          <p class="books__items__item__data__title">${title}</p>
          <p class="books__items__item__data__author">${author}</p>
        </div>
      </div>
    `;
}