  const { getLatestReviews, getLatestBooks } = require('./db');

  async function generateRSSFeed() {
      const latestReviews = await getLatestReviews(); 
      const latestBooks = await getLatestBooks(); 

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
        <title>${escapeXml(review.book.title)}</title>
        <link>https://boo.com/book/${review.book.book_id}</link>
        <description>${escapeXml(review.user.username)} reviewed ${escapeXml(review.book.title)} with ${review.rating} stars: ${escapeXml(review.description)}</description>
        <pubDate>${new Date(review.creation_date).toUTCString()}</pubDate>
        <guid>https://boo.com/review/${review.id}</guid>
      </item>
    `;
    });
    

  latestBooks.forEach(book => {
    const coverImageLength = 12345; // Replace with the actual size in bytes if available
    rssContent += `
      <item>
        <title>${escapeXml(book.title)}</title>
        <link>https://boo.com/book/${book.book_id}</link>
        <description>Check out the latest release: ${escapeXml(book.title)} by ${escapeXml(book.author)}. ${escapeXml(book.description)}</description>
        <pubDate>${new Date(book.creation_date).toUTCString()}</pubDate>
        <guid>https://boo.com/book/${book.book_id}</guid>
        <enclosure url="${book.coverimg}" length="0" type="image/jpg"/>
      </item>
    `;
  });

  rssContent += `
    </channel>
  </rss>
  `;

  return rssContent;
}

function escapeXml(unsafe) {
return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
    }
});
}


module.exports = generateRSSFeed;
