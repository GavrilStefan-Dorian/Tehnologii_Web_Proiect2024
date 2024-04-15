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