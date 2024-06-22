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

async function getReviews(bookId)
{
    const books = await sql`SELECT * FROM reviews NATURAL JOIN users WHERE book_id = ${bookId};`;
    if(!books)
        return null;

    return books;
}

async function getCategories()
{
    const categories = await sql`SELECT * FROM genres ORDER BY name;`;
    if(!categories)
        return null;

    return categories;
}

async function getCategoryBooks(id)
{
    const books = await sql`SELECT * FROM books NATURAL JOIN genres WHERE genre_id = ${id}`;
    if(!books)
        return null;

    return books;
}

async function getCategory(id)
{
    const categories = await sql`SELECT * FROM genres WHERE genre_id = ${id}`;
    if(!categories)
        return null;

    return categories[0];
}

module.exports = {
    getBook,
    getBooks,
    getReviews,
    getCategories,
    getCategoryBooks,
    getCategory
}