const postgres = require('postgres');
const fs = require('fs');
const csv = require('csv-parser')
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
    await sql`CALL insert_book(${bookId}::varchar, ${title}::varchar, ${series}::varchar, ${author}::varchar, ${rating}::float, ${description}::varchar, ${language}::varchar, ${isbn}::varchar, ${bookFormat}::varchar, ${edition}::varchar, ${pages}::int, ${publisher}::varchar, TO_DATE(${publishDate}, 'MM/DD/YY'), ${numRatings}::int, ${coverImg}::varchar, ${price}::float)`;
    let i = 0;
    for(i = 0; i < genres.length; i++)
    {
        await sql`CALL insert_book_genre(${bookId}::varchar, ${genres[i]}::varchar)`;
    }
}

async function processCSV(path)
{
    const results = [];
    fs.createReadStream(path)
        .pipe(csv())
        .on('data', async (data) => {
            results.push(data);
        })
        .on('end', async () => {
            for(let i = 0; i < results.length; i++)
            {
                try {
                    console.log(`Inserting ${i}/${results.length}`);
                    let data = results[i];
                    await insertBook(
                        data["bookId"],
                        data["title"],
                        data["series"],
                        data["author"],
                        parseFloat(data["rating"]),
                        data["description"],
                        data["language"],
                        data["isbn"],
                        data["genres"].replace('[', '').replace(']', '').split(', '),
                        data["bookFormat"],
                        data["edition"],
                        parseInt(data["pages"]),
                        data["publisher"],
                        data["publishDate"],
                        parseInt(data["numRatings"]),
                        data["coverImg"],
                        parseFloat(data["price"]),
                    );
                }
                catch (ex)
                {
                    console.log(ex);
                }
            }
        });
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
    getPopularBooks,
    sql
}