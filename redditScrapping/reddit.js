const fs = require('fs');
const path = require('path');
const {chromium} = require('playwright');

url = 'https://www.reddit.com/r/stocks/';

async function redditScrape (){
    const storagePath = path.join(__dirname, 'auth.json');

    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext({
        storageState: storagePath
    });

    const page = await context.newPage();

    await page.goto(url);


    await context.storageState({path:storagePath});

    await page.waitForSelector('article');

    let previousHeight;

    let stopCount = 20;

    /*

        ok I get whats happening now, I can't get it done right now but notes for future me:
        The posts are being kept as objects, in order to properly scrape reddit, fetch object, then query each object
        or at least thats my understanding so far.
        Thats why below it's not easy to just fetch, the elements are not being shown in plane html
        but instead as objects.

    */

    let redditSet = new Set();

    let redditPosts = []


    //to limit amount of scrolling since it will just keep going on reddit
    let scrollCount = 0;
    do{ 

        scrollCount +=1;

        let posts = await page.$$eval('shreddit-post', posts =>{
        
        //the hard part here was to make sure I would get the correct img, unforutantely will require more work
        //but since as of now the reddit posts I'm scrapping doesn't even have images in their posts its fine as is for now

        //ok grabbing the particular stuff is quite length and annoying but as a note to future me:
        //lets simplify how we are going to grab all the extra info:
        // after we grab article, you need to also grab shreddit-post, thats actually where evryhitng is kept (minus the image but I think this path should get us there);
        //so in total we have to: document.querySelectorAll('shreddit-post')[n].getAttribute('comment-count'); (where n is just the iteration of the post I'm currently on)

        return posts.map(post=>{
            const postText = post.getAttribute('post-title');
            const comtcnt = post.getAttribute('comment-count');
            const score = post.getAttribute('score');
            const postDate = post.getAttribute('created-timestamp');
            const link = post.getAttribute('content-href');


            return {
                text : postText,
                'comment count' : comtcnt,
                score : score,
                date : postDate,
                link : link
            };

        });

        });

        posts.forEach(post=>{
            if(!redditSet.has(post)){
                redditSet.add(post);
                redditPosts.push(post);
            };
        });

        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

        await page.waitForTimeout(2000);

    } while (await page.evaluate('document.body.scrollHeight') > previousHeight && scrollCount < stopCount);

    console.log(redditPosts);

    const now = new Date();

    let saveDate = now.getDate().toString() +'-'+ (now.getMonth()+1).toString() +'-'+ now.getFullYear().toString();
    
    const saveDir = path.join(__dirname, "results");
    const saveFile = path.join(saveDir, saveDate+'.json');
    fs.writeFileSync(saveFile, JSON.stringify(redditPosts, null, 2), 'utf-8');

    browser.close();

};

module.exports = redditScrape;