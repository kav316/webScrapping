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

    let stopCount = 1;

    /*

        ok I get whats happening now, I can't get it done right now but notes for future me:
        The posts are being kept as objects, in order to properly scrape reddit, fetch object, then query each object
        or at least thats my understanding so far.
        Thats why below it's not easy to just fetch, the elements are not being shown in plane html
        but instead as objects.

    */

    let redditPosts = new Set();

    let scrollCount = 0;
    do{ 

        scrollCount +=1;

        newPosts = await page.$$eval('article', articles =>{
        
        return articles.map(article=>article.innerText.trim())
        .filter(text => text.length > 0);
        
        /* This is the target function, but not the complete answer
        let meh = [];

        for( x of articles){
            meh.push(x.innerText);
        }

        return meh;
        */
        });

        newPosts.forEach(post=>redditPosts.add(post));

        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

        await page.waitForTimeout(2000);

    } while (await page.evaluate('document.body.scrollHeight') > previousHeight && scrollCount < stopCount);

    const redditPostsArray = [...redditPosts];

    console.log(redditPosts);

    const now = new Date();

    let saveDate = now.getDate().toString() +'-'+ (now.getMonth()+1).toString() +'-'+ now.getFullYear().toString();
    
    const saveDir = path.join(__dirname, "results");
    const saveFile = path.join(saveDir, saveDate+'.json');
    fs.writeFileSync(saveFile, JSON.stringify(redditPostsArray, null, 2), 'utf-8');

    browser.close();

})();