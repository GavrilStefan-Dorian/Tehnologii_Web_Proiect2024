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

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else if (contentType && contentType.includes('text/html')) {
                    return response.text();
                } else {
                    throw new Error('Unsupported content type: ' + contentType);
                }
            }).then(data => {
                if (typeof data === 'string') {
                    window.location.href = url;

                } else {
                    const newUrl = data.url;
                    console.log("Navigating to:", newUrl);
                    window.location.href = newUrl;
                }
            }).catch(error => {
                window.location.href = '/';
                console.error('Error fetching data:', error);
            });
        });
    });
}

function getToken() {
    const token = localStorage.getItem('jwtToken');
    if(token) {
        return token;
    }
    return null;
}
