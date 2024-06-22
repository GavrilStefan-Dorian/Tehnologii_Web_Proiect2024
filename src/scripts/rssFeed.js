const { getLatestReviews } = require('./db');

async function generateRSSFeed() {
    const latestReviews = await getLatestReviews(); 
    // const latestBooks = getLatestBooks(); 

    const pubDate = new Date().toUTCString();

    let rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Book Review RSS Feed</title>
        <description>Latest reviews and book updates</description>
        <link>https://boo.com</link>
        <atom:link href="https://localhost:3000/rssFeed" rel="self" type="application/rss+xml" />
        <language>en-us</language>
        <pubDate>${pubDate}</pubDate>
        <lastBuildDate>${pubDate}</lastBuildDate>
    `;


    latestReviews.forEach(review => {
        rssContent += `
          <item>
            <title>New Review: ${review.book.title}</title>
            <link>https://boo.com/book/${review.book.book_id}</link>
            <description>${review.user.username} reviewed ${review.book.title} with ${review.rating} stars: ${review.description}</description>
            <pubDate>${new Date(review.creation_date).toUTCString()}</pubDate>
            <guid>https://boo.com/review/${review.id}</guid>
          </item>
        `;
    });

    // latestBooks.forEach(book => {
    //     rssContent += `
    //       <item>
    //         <title>New Book: ${book.title}</title>
    //         <link>https://boo.com/book/${book.book_id}</link>
    //         <description>Check out the latest release: ${book.title} by ${book.author}</description>
    //         <pubDate>${new Date(book.publication_date).toUTCString()}</pubDate>
    //         <guid>https://boo.com/book/${book.book_id}</guid>
    //       </item>
    //     `;
    // });

    rssContent += `
      </channel>
    </rss>
    `;

    return rssContent;
}

module.exports = generateRSSFeed;
