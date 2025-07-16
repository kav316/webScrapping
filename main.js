const fs = require('fs');
const path = require('path');

const twitterScrape = require('./twitterScrapping/twitter')
const redditScrape = require('./redditScrapping/reddit');

const twitterURL = 'https://x.com/home?lang=en';
const redditURL = 'https://www.reddit.com/r/stocks/'

twitterScrape(twitterURL);
redditScrape(redditURL);

const redditJsonDir = path.join(__dirname, 'redditScrapping', 'results');
const twitterJsonDir = path.join(__dirname, 'twitterScrapping', 'results');



//the combination and saving of all the different scrapping's
//I should essentially be able to run and return all types of json, that will be saved
// and organized by the date