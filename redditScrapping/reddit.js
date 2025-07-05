const fs = require('fs');
const path = require('path');
const {chromium} = require('playwright');

url = 'https://www.reddit.com/r/stocks/';

(async ()=>{
    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext({
        storageState: 'auth.json'
    });

    const page = await context.newPage();

    await page.goto(url);

    await context.storageState({path:'auth.json'});

    await page.waitForSelector('article');

    let previousHeight;

    let stopCount = 10;

    let scrollCount = 0;

    do{ 

        scrollCount +=1;

        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(2000);
    } while (await page.evaluate('document.body.scrollHeight') > previousHeight && scrollCount < stopCount);

    const redditPost = await page.$$eval('article', articles =>{
        articles.map(article=>{
            const text = article.querySelector('a')?.innterText || "";

            return {
                post : text
            };
        });
    });

    console.log(redditPost);

    await page.pause();

    browser.close();

})();