const postgres = require('postgres');
const fs = require('fs');
const faker = require('@faker-js/faker')
require('dotenv').config({ path: './src/.env' });

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

async function insertBook(title, description, language, publication_date, pages, publisher, edition, reviews, author, genre) {
    await sql`CALL insert_book(${title}, ${description}, ${language}, TO_DATE(${publication_date}, 'MM/DD/YYYY'), ${pages}, ${publisher}, ${edition}, ${reviews}, ${author}, ${genre})`;
}

async function processCSV(path)
{
    const content = fs.readFileSync(path, 'utf8');
    const lines = content.split('\n');
    for (const line of lines.slice(1)) {
        try
        {
            const params = line.split(",");
            const title = params[1];
            const description = '';
            const language = params[6];
            const publication_date = params[10];
            const pages = parseInt(params[7]);
            const publisher = params[11];
            const edition = '';
            const reviews = parseInt(params[9]);
            const author = params[2];
            const genre = faker.faker.music.genre();
            console.log("Inserting " + title);
            await insertBook(title, description, language, publication_date, pages, publisher, edition, reviews, author, genre);
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


async function getLatestReviews(limit = 10) {
    const reviews = await sql`
        SELECT r.id, r.rating, r.description, r.creation_date,
                u.username AS username,
                b.book_id AS book_id, b.title AS book_title
        FROM reviews r
        INNER JOIN users u ON r.user_id = u.user_id
        INNER JOIN books b ON r.book_id = b.book_id
        ORDER BY r.creation_date DESC
        LIMIT ${limit};
    `;
    
    return reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        description: review.description,
        creation_date: review.creation_date,
        user: {
            username: review.username
        },
        book: {
            book_id: review.book_id,
            title: review.book_title
        }
    }));
}

module.exports = {
    processCSV,
    extractBookReviewsCSV,
    extractBookReviewsXML,
    getTopBooks,
    getPopularBooks,
    getLatestReviews,
    sql
}