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

    let stopCount = 2;

    /*

        ok I get whats happening now, I can't get it done right now but notes for future me:
        The posts are being kept as objects, in order to properly scrape reddit, fetch object, then query each object
        or at least thats my understanding so far.
        Thats why below it's not easy to just fetch, the elements are not being shown in plane html
        but instead as objects.

    */

    let scrollCount = 0;
    console.log(testvar);
    do{ 

        scrollCount +=1;

        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

        await page.waitForTimeout(5000);

    } while (await page.evaluate('document.body.scrollHeight') > previousHeight && scrollCount < stopCount);

    const redditPost = await page.$$eval('article', articles =>{
        articles.map(article=>{
            const text = article.innerText;

            return {
                post : text
            };
        });
    });

    console.log(typeof(redditPost));
    
    await page.pause();

    browser.close();

})();