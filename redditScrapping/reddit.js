const fs = require('fs');
const path = require('path');
const {chromium} = require('playwright');

url = 'https://www.reddit.com/r/stocks/';

(async ()=>{
    const browser = await chromium.launch({headless: false, slowMo: 50});
    const context = await browser.newContext({
        storageState: 'auth.json'
    });

    const page = await context.newPage();

    await page.goto(url);

    await context.storageState({path:'auth.json'});

    await page.waitForSelector('article');

    let previousHeight;

    do{
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollheight)');
        await page.waitForTimeout(5000);
    } while (await page.evaluate('document.body.scrollHeight') > previousHeight);

    const redditPost = await page.$$eval('article', articles =>{
        articles.map(article=>{
            const text = article.innerText;

            return {
                post : text
            };
        });
    });

    console.log(redditPost);

    browser.close();

})();