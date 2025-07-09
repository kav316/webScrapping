const https = require('https');
const fs = require('fs');
const path = require('path');
const {chromium} = require('playwright');

url = 'https://x.com/home?lang=en';

async function twitterScrape(url) {
    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext({
        storageState: 'auth.json'
    });
    const page = await context.newPage();

    await page.goto(url);

    await context.storageState({path:'auth.json'});

    await page.waitForSelector('article');

    let previousHeight;

    let seenTweets = new Set();
    let allTweets = [];

    do {
        previousHeight = await page.evaluate('document.body.scrollHeight');

        //do: document.querySelectorAll('article') this is recommended against, but works for now

        const tweets = await page.$$eval('article', articles =>
        articles.map(article =>{

            const text = article.querySelector('[data-testid="tweetText"] span').innerText;
            
            //this section is dedicated to grabbing the metrics of the posts

            let metricsSet = new Set();
            let textMetrics = article.querySelectorAll('[data-testid="app-text-transition-container"] span');

            textMetrics.forEach(node=>{
                if(!metricsSet.has(node.innerText)){
                    metricsSet.add(node.innerText);
                }
            })

            let metricNames = ['Comments', 'Retweets', 'Likes', 'Views'];

            textMetrics = Array.from(metricsSet);
            
            textMetrics = textMetrics.map((element, index) =>{
                return `${metricNames[index]}: ${element}`;
            });

            //end metrics section

            //grab images and videos below

            const img= Array.from(article.querySelectorAll('[data-testid="tweetPhoto"] img'))
            .map(img=>img.src);
            const video = Array.from(article.querySelectorAll('video')).map(video=>video.src);

            return {
                Text : text,
                Metrics : textMetrics,
                Images: img,
                videos: video
            };

        }));

        //remove dup tweets due to some mishap while scrolling
        //I'm not sure that this is necessary, but likely better
        //and yes this is the only since of error check I have right now

        tweets.forEach(tweet=>{
            if(!seenTweets.has(tweet.Text)){
                seenTweets.add(tweet.Text);
                allTweets.push(tweet);
            };
        });

        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(2000);
    } while(await page.evaluate('document.body.scrollHeight') > previousHeight);


    //save this information somewhere and label it by date

    const now = new Date();

    let saveDate = now.getDate().toString() +'-'+ (now.getMonth()+1).toString() +'-'+ now.getFullYear().toString();

    const saveDir = path.join(__dirname, "results");
    const saveFile = path.join(saveDir, saveDate+'.json');

    fs.writeFileSync(saveFile, JSON.stringify(allTweets, null, 2), 'utf-8');

    await browser.close();

};

twitterScrape(url);


module.exports = twitterScrape;