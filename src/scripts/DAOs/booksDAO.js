const {sql, getPopularBooks, getTopBooks, getRecentBooks} = require("../db");

async function getBook(id, user = null)
{
    let books = [];
    if(!user)
        books = await sql`SELECT * FROM books WHERE book_id = ${id}`;
    else books = await sql`SELECT books.*, CASE 
        WHEN liked_books.book_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS liked, CASE 
        WHEN bookmarked_books.book_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS bookmarked, CASE 
        WHEN book_reading_status.book_id IS NOT NULL THEN book_reading_status.status
        ELSE NULL
    END AS status FROM (SELECT * FROM books Where book_id = ${id}) books
    LEFT JOIN (SELECT * FROM liked_books WHERE user_id = ${user}) liked_books ON liked_books.book_id = books.book_id
    LEFT JOIN (SELECT * FROM bookmarked_books WHERE user_id = ${user}) bookmarked_books ON bookmarked_books.book_id = books.book_id
    LEFT JOIN (SELECT * FROM book_reading_status WHERE user_id = ${user}) book_reading_status ON book_reading_status.book_id = books.book_id;`;

    if(!books)
        return null;

    return books[0];
}

async function getUserReviews(user, book)
{
    const reviews = await sql`SELECT users.user_id, username, id, book_id, rating, description, creation_date FROM users LEFT JOIN reviews on users.user_id = reviews.user_id WHERE users.user_id = ${user}`;
    if(!reviews)
        return null;

    return reviews;
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



async function getGenreBooks(id)
{
    const books = await sql`SELECT * FROM genres g NATURAL JOIN bookgenres bg NATURAL JOIN books b WHERE g.genre_id = ${id}`;
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

async function getCategoryBooks(id)
{
    let books = null;
    switch(id)
    {
        case "1":
        {
            books = await getPopularBooks();
            break;
        }

        case "2":
        {
            books = await getTopBooks();
            break;
        }

        case "3":
        {
            books = await getRecentBooks();
            break;
        }
    }

    if(!books)
        return null;

    return books;
}

async function getLikedBooks(user_id)
{
    return sql`SELECT * FROM liked_books WHERE user_id = ${user_id};`;
}

async function getBookmarkedBooks(user_id)
{
    return sql`SELECT * FROM bookmarked_books WHERE user_id = ${user_id};`;
}

async function getBookStatuses(user_id)
{
    return sql`SELECT * FROM book_reading_status WHERE user_id = ${user_id};`;
}

module.exports = {
    getBook,
    getBooks,
    getReviews,
    getCategories,
    getGenreBooks,
    getGenre: getCategory,
    getCategoryBooks,
    getLikedBooks,
    getBookmarkedBooks,
    getBookStatuses,
    getUserReviews
}