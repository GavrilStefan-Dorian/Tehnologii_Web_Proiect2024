const {sendFile, readFileContents, sendHTML, isResource, getUser} = require("../utils");
const Route = require("../route");
const {getBooks, getCategories, getGenreBooks, getGenre, getCategoryBooks} = require("../DAOs/booksDAO");

const viewBooksRoute = new Route((req) => {
    if(isResource(req.url))
        return;
    const params = req.url.split('/');
    if(params[1] !== "view_books")
        return false;
    if(params.length !== 4)
        return false;
    req.type = params[2];
    req.category = params[3];
    return true;
}, 'GET', async (req, res) => {
    try
    {
        let contents = readFileContents('./public/Pages/view_books.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        contents = getUser(req, contents);

        let books = null;
        let title = "";

        switch(req.type)
        {
            case "genre":
            {
                books = await getGenreBooks(req.category);
                title = (await getGenre(req.category)).name.replaceAll("'", "");
                break;
            }

            case "category":
            {
                books = await getCategoryBooks(req.category);
                switch(req.category)
                {
                    case "1":
                    {
                        title = "New and Popular";
                        break;
                    }

                    case "2":
                    {
                        title = "All-Time Sellers";
                        break;
                    }

                    case "3":
                    {
                        title = "Recent releases";
                        break;
                    }
                }
                break;
            }
        }

        let builder = `const books=${JSON.stringify(books)}`;
        contents = contents.replace("[|title|]", `const title="${title}";`);
        contents = contents.replace("[|books|]", builder);

        sendHTML(contents, res);
    }
    catch (ex)
    {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

module.exports = viewBooksRoute;