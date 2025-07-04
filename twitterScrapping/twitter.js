const https = require('https');
const fs = require('fs');
const path = require('path');
const {chromium} = require('playwright');

url = 'https://x.com/home?lang=en';

async function twitterScrape(url) {
    const browser = await chromium.launch({headless: false, slowMo: 50});
    const context = await browser.newContext({
        storageState: 'auth.json'
    });
    const page = await context.newPage();

    await page.goto(url);

    await context.storageState({path:'auth.json'});

    await page.waitForSelector('article');

    let previousHeight;

    do {
        previousHeight = await page.evaluate('document.body.scrolHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(2000);
    } while(await page.evaluate('document.body.scrollHeight') > previousHeight);

    const tweets = await page.$$eval('article', articles =>
        articles.map(article =>{

            const text = article.innerText;
            const img= Array.from(article.querySelectorAll('[data-testid="tweetPhoto"] img'))
            .map(img=>img.src);
            const video = Array.from(article.querySelectorAll('video')).map(video=>video.src);

            return {
                text,
                images: img,
                videos: video
            };

        })
    );

    console.log(tweets);

    //save this information somewhere and label it by date

    const now = new Date();

    let saveDate = now.getDate().toString() +'-'+ (now.getMonth()+1).toString() +'-'+ now.getFullYear().toString();

    const saveDir = path.join(__dirname, "results");
    const saveFile = path.join(saveDir, saveDate+'.json');

    fs.writeFileSync(saveFile, JSON.stringify(tweets, null, 2), 'utf-8');

    await browser.close();

};

twitterScrape(url);


module.exports = twitterScrape;