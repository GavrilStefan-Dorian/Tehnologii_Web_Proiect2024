var navbarHidden = true;
var navbar = null;
let logged = false;
let token;

async function createSidebar(selected, user) {
    token = document.cookie.split(';').find(c => c.trim().startsWith('jwt='));
    
    if(token !== null && token !== undefined) {
        token = token.split('=')[1];
    }

    const selectableItems = [
        '<a class="sidebar__items__container__link" href="/home"><img class="sidebar__items__container__item" src="../Resources/Svg/home.svg"></a>',
        '<a class="sidebar__items__container__link" href="/books"><img class="sidebar__items__container__item" src="../Resources/Svg/book.svg"></a>',
        '<a class="sidebar__items__container__link" href="/search"><img class="sidebar__items__container__item" src="../Resources/Svg/search.svg"></a>',
        '<a class="sidebar__items__container__link" href="/liked"><img class="sidebar__items__container__item" src="../Resources/Svg/heart.svg"></a>',
        '<a class="sidebar__items__container__link" href="/bookmarked"><img class="sidebar__items__container__item" src="../Resources/Svg/bookmark.svg"></a>',
        '<a class="sidebar__items__container__link" href="/view-groups"><img class="sidebar__items__container__item" src="../Resources/Svg/groups.svg"></a>',
        '<a class="sidebar__items__container__link" href="/help"><img class="sidebar__items__container__item" src="../Resources/Svg/question.svg"></a>',
        '<a class="sidebar__items__container__link" href="/about"><img class="sidebar__items__container__item" src="../Resources/Svg/info.svg"></a>',
        '<a class="sidebar__items__container__link" href="/rssFeed"><img class="sidebar__items__container__item" src="../Resources/Svg/rss.svg"></a>',

    ];

    let html = `
<div class="sidebar">
    <div class="sidebar__items">
         ${user ? `    <div class="navbar__profile">\n        <p class="navbar__profile__text">${user.username[0].toUpperCase()}</p>\n    </div>` : ""}
         <div class="sidebar__scrollable">

    `;

    let index = 0;
    selectableItems.forEach(x => {
        if(index++ === selected)
            html += '<div class="sidebar__items__container sidebar__items__container--selected">';
        else html += '<div class="sidebar__items__container">';

        html += x;
        html += '</div>'; 
    });

    html += `
         </div>
    </div>
`;

    if(token !== null && token !== undefined) {
        logged = true;
        role = document.cookie.split(';').find(c => c.trim().startsWith('role=')).split('=')[1];

        html += `
        <div class="sidebar__items sidebar__items--bottom">
        `

        if(role === 'admin') {
            html += `
                <div class="sidebar__items__container" id="adminButton">
                    <img class="sidebar__items__container__item" src="../Resources/Svg/admin.svg">
                </div>
            `
        }

        html += `
            <div class="sidebar__items__container" id="logoutButton">
                <img class="sidebar__items__container__item" src="../Resources/Svg/logout.svg">
            </div>
        </div>
        `;
    }

    html += `
</div>
<div class="navbar__links navbar__links--hidden">
    <a class="navbar__links__link" href="/home">Home</a>
    <a class="navbar__links__link" href="/books">Books</a>
    <a class="navbar__links__link" href="/search">Search</a>
    <a class="navbar__links__link" href="/view-groups">Groups</a>
    <a class="navbar__links__link" href="/help">FAQ</a>
    <a class="navbar__links__link" href="/about">About</a>
    `

    if(logged === true && role === 'admin') {
        html += `
            <a class="navbar__links__link" href="/admin">Admin Panel</a>
        `
    }


    html += `
</div>
<div class="navbar">
    ${user ? `<div class="navbar__profile">
        <p class="navbar__profile__text">${user.username[0].toUpperCase()}</p>
    </div>` : ""}
    <img class="navbar__menu" src="../Resources/Svg/menu.svg">
</div>
`;

    document.body.innerHTML += html;

    const logoutButton = document.getElementById("logoutButton");
    if(logoutButton && token) {
        logoutButton.addEventListener("click", logout);
    }

    const adminButton = document.getElementById("adminButton");
    if(adminButton && logged) {
        adminButton.addEventListener("click", admin);
    }

    //         fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': 'Bearer ' + token
    //             }
    //         }).then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         }).then(data => {
    //             const newUrl = data.url;
    //             console.log("Navigating to:", newUrl);
    //             window.location.href = newUrl; 
    //         }).catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    //     });
    // }

    const navbars = document.getElementsByClassName("navbar__links");
    if(navbars.length > 0) {
        navbar = navbars[0];
    }

    const menus = document.getElementsByClassName("navbar__menu");
    if(menus.length > 0) {
        var menu = menus[0];
        menu.addEventListener("click", toggleNavbar);
    }

    const sidebarScrollable = document.querySelector('.sidebar__scrollable');

    sidebarScrollable.addEventListener('scroll', function() {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight;
        const clientHeight = this.clientHeight;

        if (scrollTop > 0) {
            sidebarScrollable.classList.add('scrollable-top');
        } else {
            sidebarScrollable.classList.remove('scrollable-top');
        }

        if (scrollHeight - scrollTop > clientHeight) {
            sidebarScrollable.classList.add('scrollable-bottom');
        } else {
            sidebarScrollable.classList.remove('scrollable-bottom');
        }
});    
}

function toggleNavbar() {
    if(navbar == null)
        return;

    if(navbarHidden) {
        navbarHidden = false;
        navbar.classList.remove("navbar__links--hidden");
    } else {
        navbarHidden = true;
        navbar.classList.add("navbar__links--hidden");
    }
}

function logout() {
    document.cookie = 'jwt=; Max-Age=0; path=/' 
    window.location.replace('/login');
}

function admin() {
    window.location.replace('/admin');
}

// for some reason didnt run? for gettoken

// function getToken() {
//     const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
//     console.log(token);

//     console.log("HERE", token);
//     if(token) {
//         return token;
//     }
//     return null;
// }
