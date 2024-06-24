function createMember(username) {
    return `
        <div class="member">
        <div class="member__avatar">\n
            <p class="member__avatar__text">${username[0].toUpperCase()}</p>\n
        </div>

        <p class="member__name">${username}</p>
        </div>
    `;
}


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
    let group_html = `
                 <div class="groups__list__item">
                    <img class="groups__list__item__image" src=${img}>
                    <div class="groups__list__item__info">
                        <p class="groups__list__item__info__title">${name}</p>
                        <p class="groups__list__item__info__description">${description}</p>
                        <p class="groups__list__item__info__members">${member_count} members</p>

                        <a class="groups__list__item__info__view" href="/groups/${id}">
                            <p class="groups__list__item__info__view__text">${type === "Your Groups" ? "View" : "Join"}</p>
                        </a>
                    `

    if(type === "Your Groups") {
        group_html += `
                        <a class="groups__list__item__info__leave" href="/groups/${id}">
                            <p class="groups__list__item__info__leave__text">Leave</p>
                        </a>
                `  
    }

    group_html += `
                    </div>
                </div>
    `
    return group_html;
}


function getToken() {
    return localStorage.getItem('jwtToken');
}

function fetchData(url) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log('Data fetched successfully:', data);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}


function joinGroup(groupId) {
    const groupElement = document.getElementsByClassName("groups__popular")[0].querySelector(`[href="/groups/${groupId}"]`).closest('.groups__list__item');
    if (groupElement) {
        groupElement.remove();
        const viewLink = groupElement.querySelector('.groups__list__item__info__view__text');
        if (viewLink) {
            viewLink.textContent = "View";
        }

        groupElement.querySelector('.groups__list__item__info').innerHTML += `
                                    <a class="groups__list__item__info__leave" href="/groups/${groupId}">
                                        <p class="groups__list__item__info__leave__text">Leave</p>
                                    </a>
                            `;


        groupElement.addEventListener('click', function(event) {
            if (event.target.classList.contains('groups__list__item__info__leave__text') && event.target.textContent === 'Leave') {
                event.preventDefault();
                const groupId = event.target.closest('a').getAttribute('href').split('/').pop();
                leaveGroupApi(groupId);
            } 
        });
        
        console.log(groupElement.innerHTML);
        const yourGroupsList = groupList.querySelector('.groups__list');
        if (yourGroupsList) {
            yourGroupsList.innerHTML += groupElement.outerHTML;
        }
    }
}

function joinGroupApi(groupId) {
    const url = `/groups/${groupId}/members`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log('Joined group successfully:', data);
        joinGroup(groupId); // Move the group to "Your Groups" section
    }).catch(error => {
        console.error('Error joining group:', error);
    });
}


function leaveGroup(groupId) {
    const groupElement = document.getElementsByClassName("groups")[0].querySelector(`[href="/groups/${groupId}"]`).closest('.groups__list__item');
    if (groupElement) {
        groupElement.remove();    
    }
}

function leaveGroupApi(groupId) {
    const url = `/groups/${groupId}/members`;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log('Left group successfully:', data);
        leaveGroup(groupId); // Move the group to "Your Groups" section
    }).catch(error => {
        console.error('Error leaving group:', error);
    });
}


document.addEventListener('click', function(event) {
    if (event.target.classList.contains('groups__list__item__info__view__text') && event.target.textContent === 'Join') {
        event.preventDefault();
        const groupId = event.target.closest('a').getAttribute('href').split('/').pop();
        joinGroupApi(groupId);
    } else if (event.target.classList.contains('groups__list__item__info__view__text') && event.target.textContent === 'View') {
        event.preventDefault();
        const url = event.target.closest('a').getAttribute('href');
        window.location.href = url;
    }
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('groups__list__item__info__leave__text') && event.target.textContent === 'Leave') {
        event.preventDefault();
        const groupId = event.target.closest('a').getAttribute('href').split('/').pop();
        leaveGroupApi(groupId);
    } 
});