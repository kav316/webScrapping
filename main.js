const fs = require('fs');
const path = require('path');

const twitterScrape = require('./twitterScrapping/twitter')
const redditScrape = require('./redditScrapping/reddit');

const singleFileInsert = require('./website/webBackend/singleFileInsert');

const twitterURL = 'https://x.com/home?lang=en';
const redditURL = 'https://www.reddit.com/r/stocks/';

//implement promise for the following async function, pretty close but timing won't do what it actually needs to do

(async () =>{
    const newTwitterFile = await twitterScrape(twitterURL);
    const newRedditFile = await redditScrape(redditURL);

    const redditJsonDir = path.join(__dirname, 'redditScrapping', 'results');
    const twitterJsonDir = path.join(__dirname, 'twitterScrapping', 'results');

    singleFileInsert("reddit", path.join(redditJsonDir, newRedditFile), newRedditFile);
    singleFileInsert("twitter", path.join(twitterJsonDir, newTwitterFile), newTwitterFile);
})();



//the combination and saving of all the different scrapping's
//I should essentially be able to run and return all types of json, that will be saved
// and organized by the date