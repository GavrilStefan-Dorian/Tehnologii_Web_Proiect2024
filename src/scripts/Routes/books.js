const {sendFile, readFileContents, sendHTML, getUserBookData} = require("../utils");
const Route = require("../route");
const {getBooks} = require("../DAOs/booksDAO");

function buildList(name, books)
{
    let html = `createBookList("${name}", [`;
    books.forEach(x => {
        html += `createBook("${x.book_id}", "${x.title}", "${x.author}", "${x.coverimg}", "${x.rating}", "${x.numratings}"),`;
    })
    html += ']),';
    return html;
}

const booksRoute = new Route('/books', 'GET', async (req, res) => {
    try
    {
        let contents = readFileContents('./public/Pages/books.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }

        let booksBuilder = "const bookLists = [";
        booksBuilder += buildList("To Read", await getBooks(["2767052-the-hunger-games", "2.Harry_Potter_and_the_Order_of_the_Phoenix", "2657.To_Kill_a_Mockingbird", "1885.Pride_and_Prejudice", "41865.Twilight", "19063.The_Book_Thief", "170448.Animal_Farm", "10614.Misery", "11127.The_Chronicles_of_Narnia", "30.J_R_R_Tolkien_4_Book_Boxed_Set", "18405.Gone_with_the_Wind", "11870085-the-fault-in-our-stars"]));
        booksBuilder += buildList("Reading", await getBooks(["2767052-the-hunger-games", "2.Harry_Potter_and_the_Order_of_the_Phoenix", "2657.To_Kill_a_Mockingbird", "1885.Pride_and_Prejudice", "41865.Twilight", "19063.The_Book_Thief", "170448.Animal_Farm", "10614.Misery", "11127.The_Chronicles_of_Narnia", "30.J_R_R_Tolkien_4_Book_Boxed_Set", "18405.Gone_with_the_Wind", "11870085-the-fault-in-our-stars"]));
        booksBuilder += buildList("Finished", await getBooks(["2767052-the-hunger-games", "2.Harry_Potter_and_the_Order_of_the_Phoenix", "2657.To_Kill_a_Mockingbird", "1885.Pride_and_Prejudice", "41865.Twilight", "19063.The_Book_Thief", "170448.Animal_Farm", "10614.Misery", "11127.The_Chronicles_of_Narnia", "30.J_R_R_Tolkien_4_Book_Boxed_Set", "18405.Gone_with_the_Wind", "11870085-the-fault-in-our-stars"]));
        booksBuilder += "];";

        contents = contents.replace("[|books|]", booksBuilder);

        sendHTML(contents, res);
    }
    catch (ex)
    {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

module.exports = booksRoute;