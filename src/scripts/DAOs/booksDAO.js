const {sql} = require("../db");

async function getBook(id)
{
    const books = await sql`SELECT * FROM books WHERE book_id = ${id}`;
    if(!books)
        return null;

    return books[0];
}

async function getBooks(ids)
{
    const books = [];
    for (const x of ids) {
        const book = await getBook(x);
        if(!book)
            continue;

        books.push(book);
    }

    return books;
}

module.exports = {
    getBook,
    getBooks
}