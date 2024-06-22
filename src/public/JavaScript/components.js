
var navbarHidden = true;
var navbar = null;
let logged = false;

function createSidebar(selected) {
    const selectableItems = [
        '<a class="sidebar__items__container__link" href="/home"><img class="sidebar__items__container__item" src="../Resources/Svg/home.svg"></a>',
        '<a class="sidebar__items__container__link" href="/books"><img class="sidebar__items__container__item" src="../Resources/Svg/book.svg"></a>',
        '<a class="sidebar__items__container__link" href="/search"><img class="sidebar__items__container__item" src="../Resources/Svg/search.svg"></a>',
        '<a class="sidebar__items__container__link" href="/view-groups"><img class="sidebar__items__container__item" src="../Resources/Svg/groups.svg"></a>',
        '<a class="sidebar__items__container__link" href="/help"><img class="sidebar__items__container__item" src="../Resources/Svg/question.svg"></a>',
        '<a class="sidebar__items__container__link" href="/about"><img class="sidebar__items__container__item" src="../Resources/Svg/info.svg"></a>',
        '<a class="sidebar__items__container__link" href="/rssFeed"><img class="sidebar__items__container__item" src="../Resources/Svg/rss.svg"></a>',
        '<a class="sidebar__items__container__link" href="/rssFeed"><img class="sidebar__items__container__item" src="../Resources/Svg/rss.svg"></a>',
        '<a class="sidebar__items__container__link" href="/rssFeed"><img class="sidebar__items__container__item" src="../Resources/Svg/rss.svg"></a>',
        '<a class="sidebar__items__container__link" href="/rssFeed"><img class="sidebar__items__container__item" src="../Resources/Svg/rss.svg"></a>'

    ];

    let html = `
<div class="sidebar">
    <div class="sidebar__items">
         <img class="sidebar__items__profile" src="../Resources/Images/Profile.png">
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

    if(getToken()) {
        logged = true;
        html += `
        <div class="sidebar__items sidebar__items--bottom">
        `

        if(localStorage.getItem('role') === 'admin') {
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

    if(logged === true && localStorage.getItem('role') === 'admin') {
        html += `
            <a class="navbar__links__link" href="/admin">Admin Panel</a>
        `
    }


    html += `
</div>
<div class="navbar">
    <img class="navbar__profile" src="../Resources/Images/Profile.png">
    <img class="navbar__menu" src="../Resources/Svg/menu.svg">
</div>
`;

    document.body.innerHTML += html;

    const logoutButton = document.getElementById("logoutButton");
    if(logoutButton && getToken()) {
        logoutButton.addEventListener("click", logout);
    }

    const adminButton = document.getElementById("adminButton");
    if(adminButton && getToken()) {
        adminButton.addEventListener("click", function(event) {
            event.preventDefault();

            const url = '/admin';

            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                const newUrl = data.url;
                console.log("Navigating to:", newUrl);
                window.location.href = newUrl; 
            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        });
    }

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




    handleNavigation();
    
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
    localStorage.removeItem('jwtToken');
    window.location.replace('/login');
}

function getToken() {
    const token = localStorage.getItem('jwtToken');
    if(token) {
        return token;
    }
    return null;
}

function handleNavigation() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const url = this.getAttribute('href');

            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                const newUrl = data.url;
                console.log("Navigating to:", newUrl);
                window.location.href = newUrl; 
            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        });
    });
}
