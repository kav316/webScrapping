const https = require('https');
const fs = require('fs');
const path = require('path');
const {chromium} = require('playwright');

url = 'https://x.com/home?lang=en';

async function twitterScrape(url) {

    const storagePath = path.join(__dirname, 'auth.json');

    const browser = await chromium.launch({headless: false, slowMo: 50});
    const context = await browser.newContext({
        storageState: storagePath
    });
    const page = await context.newPage();

    await page.goto(url);

    await context.storageState({path:storagePath});

    await page.waitForSelector('article');

    let previousHeight;

    let seenTweets = new Set();
    let allTweets = [];

    do {
        previousHeight = await page.evaluate('document.body.scrollHeight');

        //do: document.querySelectorAll('article') this is recommended against, but works for now
        //also i just cant make a clean way to grab the links for twitter. They definitely do exist
        //but the amount of effort I would need to find them, match them with the correct tweet
        //a bit much for what kind of project this is as I don't really need the posts themselves

        const tweets = await page.$$eval('article', articles =>
        articles.map(article =>{
            let text = 'N/A';
            try {
                text = article.querySelector('[data-testid="tweetText"] span').innerText;
            } catch {
                text = 'N/A';
            }
            
            
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

            //grabbing post time so that I can use that info to grab the post itself due to how twitter saves a post's link

            let timeAnchor = article.querySelector('time')?.closest('a');

            const link = timeAnchor
                ? new URL(timeAnchor.getAttribute('href'), location.origin).href
                : null;

            //grabbing time of post because why not

            const time = article.querySelector('time');

            const postDate = time?.getAttribute('datetime') || null;

            return {
                text : text,
                metrics : textMetrics,
                images: img,
                videos: video,
                postlink : link,
                postdate : postDate
            };

        }));

        //remove dup tweets due to some mishap while scrolling
        //I'm not sure that this is necessary, but likely better
        //and yes this is the only kind of error check I have right now

        tweets.forEach(tweet=>{
            if(!seenTweets.has(tweet.text)){
                seenTweets.add(tweet.text);
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


module.exports = twitterScrape;