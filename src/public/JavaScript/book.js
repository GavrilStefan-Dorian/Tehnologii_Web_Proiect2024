function createReview(name, date, text, rating, updated, editable, edit) {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let parsedDate  = new Date(date);
    return `<div ${editable ? "id='editable'" : ""} class="details__reviews__item">
                <div class="details__reviews__item__header">
                    <div class="navbar__profile">
                        <p class="navbar__profile__text">${name[0].toUpperCase()}</p>
                    </div>
                    <div class="details__reviews__item__header__info">
                        <div class="details__reviews__item__header__info__top">
                            <p class="details__reviews__item__header__info__top__name">${name}</p>
                            <p class="details__reviews__item__header__info__top__rated">rated it </p>
                            <div class="details__reviews__item__header__info__top__rating">
                                <img class="${rating >= 1 ? "book__info__header__info__rating__star" : "book__info__header__info__rating__empty"}" src="../Resources/Svg/star.svg">
                                <img class="${rating >= 2 ? "book__info__header__info__rating__star" : "book__info__header__info__rating__empty"}" src="../Resources/Svg/star.svg">
                                <img class="${rating >= 3 ? "book__info__header__info__rating__star" : "book__info__header__info__rating__empty"}" src="../Resources/Svg/star.svg">
                                <img class="${rating >= 4 ? "book__info__header__info__rating__star" : "book__info__header__info__rating__empty"}" src="../Resources/Svg/star.svg">
                                <img class="${rating >= 5 ? "book__info__header__info__rating__star" : "book__info__header__info__rating__empty"}" src="../Resources/Svg/star.svg">
                            </div>
                        </div>

                        <p class="details__reviews__item__header__info__date">${(updated ? "Updated on " : "Created on ") + parsedDate.toLocaleDateString("en-US", options)}</p>
                    </div>

                    <div class="details__reviews__item__header__buttons" style="display: ${editable ? "block" : "none"}">
                        <img onclick="edit()" class="details__reviews__item__header__buttons__button" src="../Resources/Svg/edit.svg">
                    </div>
                </div>
                <p class="details__reviews__item__description">
                    ${text}
                </p>
            </div>`;
}

function postReview(bookId, description, rating)
{
    fetch(`/review`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + document.cookie.split(';').find(c => c.trim().startsWith('jwt=')), // not sure if necessary, nolonger using the handleNav
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bookId: bookId,
            description: description,
            rating: rating,
        })
    })
}

function postLike(bookId, status)
{
    fetch(`/like`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + document.cookie.split(';').find(c => c.trim().startsWith('jwt=')), // not sure if necessary, nolonger using the handleNav
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bookId: bookId,
            status: status
        })
    })
}

function postBookmark(bookId, status)
{
    fetch(`/bookmark`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + document.cookie.split(';').find(c => c.trim().startsWith('jwt=')), // not sure if necessary, nolonger using the handleNav
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bookId: bookId,
            status: status
        })
    })
}

function postStatus(bookId, status)
{
    fetch(`/status`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + document.cookie.split(';').find(c => c.trim().startsWith('jwt=')), // not sure if necessary, nolonger using the handleNav
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bookId: bookId,
            status: status
        })
    })
}

function download(bookId, name, format)
{
    fetch(`/download`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + document.cookie.split(';').find(c => c.trim().startsWith('jwt=')), // not sure if necessary, nolonger using the handleNav
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bookId: bookId,
            format: format
        })
    })
        .then(response => response.blob())
        .then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `${name}.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}