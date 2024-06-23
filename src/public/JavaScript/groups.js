function createGroupList(name, groups) {

    const containerClass = name === "Your Groups" ? "groups" : "groups__popular";
    const containerTitle = name === "Your Groups" ? "Your Groups" : "Popular Groups";

    
    let html = `
        <div class="${containerClass}">
            <p class="groups__title">${containerTitle}</p>
            <div class="groups__list">
    `;

    groups.forEach(x => html += x);

    html += `
    </div>
  </div>`;

  return html;
}


function createGroup(type, id, name, description, img, creationDate, member_count) {
    return `
                 <div class="groups__list__item">
                    <img class="groups__list__item__image" src=${img}>
                    <div class="groups__list__item__info">
                        <p class="groups__list__item__info__title">${name}</p>
                        <p class="groups__list__item__info__description">${description}</p>
                        <p class="groups__list__item__info__members">${member_count} members</p>

                        <a class="groups__list__item__info__view" href="/groups/${id}">
                            <p class="groups__list__item__info__view__text">${type === "Your Groups" ? "View" : "Join"}</p>
                        </a>
                    </div>
                </div>
    `;
}


