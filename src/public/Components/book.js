function createReview(name, date, text) {
    return `<div class="details__reviews__item">
                <div class="details__reviews__item__header">
                    <img class="details__reviews__item__header__image" src="../Resources/Images/Profile.png">
                    <div class="details__reviews__item__header__info">
                        <div class="details__reviews__item__header__info__top">
                            <p class="details__reviews__item__header__info__top__name">${name}</p>
                            <p class="details__reviews__item__header__info__top__rated">rated it </p>
                            <div class="details__reviews__item__header__info__top__rating">
                                <img class="book__info__header__info__rating__star" src="../Resources/Svg/star.svg">
                                <img class="book__info__header__info__rating__star" src="../Resources/Svg/star.svg">
                                <img class="book__info__header__info__rating__star" src="../Resources/Svg/star.svg">
                                <img class="book__info__header__info__rating__star" src="../Resources/Svg/star.svg">
                                <img class="book__info__header__info__rating__star" src="../Resources/Svg/star.svg">
                            </div>
                        </div>

                        <p class="details__reviews__item__header__info__date">${date}</p>
                    </div>

                    <div class="details__reviews__item__header__buttons">
                        <img class="details__reviews__item__header__buttons__button" src="../Resources/Svg/options.svg">
                    </div>
                </div>
                <p class="details__reviews__item__description">
                    ${text}
                </p>
            </div>`;
}