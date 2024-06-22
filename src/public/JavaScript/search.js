function createCategory(id, title) {
    return `<a class="list__categories__category" href="/view_books/genre/${id}">
        <p class="list__categories__category__title">${title}</p>
        <img class="list__categories__category__arrow" src="../Resources/Svg/chevron-right.svg">
    </a>`;
}