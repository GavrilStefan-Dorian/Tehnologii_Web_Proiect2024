const postgres = require('postgres');
const fs = require('fs');
const faker = require('@faker-js/faker')
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});

async function insertBook(bookId, title, series, author, rating, description, language, isbn, genres, bookFormat, edition, pages, publisher, publishDate, numRatings, coverImg, price) {
    await sql`CALL insert_book(${bookId}, ${title}, ${series}, ${author}, ${rating}, ${description}, ${language}, ${isbn}, ${bookFormat}, ${edition}, ${pages}, ${publisher}, TO_DATE(${publishDate}, 'MM/DD/YY'), ${numRatings}, ${coverImg}, ${price})`;
    let i = 0;
    for(i = 0; i < genres.length; i++)
    {
        await sql`CALL insert_book_genre(${bookId}, ${genres[i]})`;
    }
}

async function processCSV(path)
{
    const content = fs.readFileSync(path, 'utf8').replaceAll('"', '');
    const lines = content.split('\n');
    let i = 1;
    const booksTotal = lines.length;
    for (const line of lines.slice(1)) {
        try
        {
            const params = line.split(/,(?!\s)/);
            const bookId = params[0];
            const title = params[1];
            const series = params[2];
            const author = params[3];
            const rating = parseFloat(params[4]);
            const description = params[5];
            const language = params[6];
            const isbn = params[7];
            const genres = params[8].replace('[', '').replace(']', '').split(', ');
            const bookFormat = params[10];
            const edition = params[11];
            const pages = parseInt(params[12]);
            const publisher = params[13];
            const publishDate = params[14];
            const numRatings = parseInt(params[17]);
            const coverImg = params[21];
            const price = parseFloat(params[24]);
            console.log(`Inserting ${i++}/${booksTotal}`);
            await insertBook(bookId, title, series, author, rating, description, language, isbn, genres, bookFormat, edition, pages, publisher, publishDate, numRatings, coverImg, price);
        }
        catch (e) {
            console.log(e);
        }
    }
}

async function extractBookReviewsCSV(bookID)
{
    return await sql`SELECT get_book_reviews_csv(${bookID})`;
}

async function extractBookReviewsXML(bookID)
{
    return await sql`SELECT get_book_reviews_xml(${bookID})`;
}

async function getTopBooks(category)
{
    return await sql`SELECT get_books_by_rating(${category})`;
}

async function getPopularBooks(category)
{
    return await sql`SELECT get_popular_books(${category})`;
}

module.exports = {
    processCSV,
    extractBookReviewsCSV,
    extractBookReviewsXML,
    getTopBooks,
    getPopularBooks
}