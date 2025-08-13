const supabase = require('./supabasecli');
const {redditInsertInfo} = require('./redditInsertData');
const {twitterInsertInfo} = require('./twitterInsertData');
const path = require('path');
const fs = require('fs');

const mainDirPath = path.join(__dirname, '..', '..');
const redditDirPath = path.join(mainDirPath, 'redditScrapping');
const twitterDirPath = path.join(mainDirPath, 'twitterScrapping');

async function manualInsert(chosenPath){
    if(fs.existsSync(chosenPath)){
        const results = path.join(chosenPath, 'results');
        const files = fs.readdirSync(results);
        if(chosenPath == redditDirPath){
            for(file of files){
                const fullPath = path.join(results, file);
                redditParseInsert(fs.readFileSync(fullPath, 'utf-8'), file)
            }
        } else {
            for(file of files){
                const fullPath = path.join(results, file);
                twitterParseInsert(fs.readFileSync(fullPath, 'utf-8'), file)
            }
        }
    }
}

async function redditParseInsert(jsonobj, fileName){
    const posts = JSON.parse(jsonobj);

    posts.forEach(file => {

        let infoarray = [];

        if(!file['Score']){
            infoarray[0] = file['score'];
            //console.log(file['score']);
        } else {
            infoarray[0] = file['Score'];
            //console.log(file['Score']);
        }

        if(!file['Comment Count']){
            infoarray[1] = file['comment count'];
            //console.log(file['comment count']);
        } else {
            infoarray[1] = file['Comment Count'];
            //console.log(file['Comment Count']);
        }

        if(!file['Date']){
            infoarray[2] = file['date'];
            //console.log(file['date']);
        } else {
            infoarray[2] = file['Date'];
            //console.log(file['Date']);
        }

        if(!file['Link']){
            infoarray[3] = file['link'];
            //console.log(file['date']);
        } else {
            infoarray[3] = file['Link'];
            //console.log(file['Date']);
        }

        infoarray[4] = file['text'];

        infoarray[5] = fileName.split('.', 1)[0];

        redditInsertInfo(infoarray);

    })


}
//change this one
async function twitterParseInsert(jsonobj, fileName){
    const posts = JSON.parse(jsonobj);

    posts.forEach(file => {

        let infoarray = [];

        //grabbing metrics:

        const m = Array.isArray(file.metrics) ? file.metrics : [];

        infoarray[0] = parseMetrics(m[0]); //comments
        infoarray[1] = parseMetrics(m[1]); //retweets
        infoarray[2] = parseMetrics(m[2]); //likes
        infoarray[3] = parseMetrics(m[3]); //views

        //grabbing post text:

        infoarray[4] = file['text'];

        //grab images and videos

        infoarray[5] = file['images'];
        infoarray[6] = file['videos'];

        // grab postlink and date

        infoarray[7] = file['postlink'];
        infoarray[8] = file['postdate'];

        //grab scrapedate

        infoarray[9] = fileName.split('.', 1)[0];

        //send it off to organize the insert and be done with it

        twitterInsertInfo(infoarray);

    });


};

function parseMetrics(metric) {
  if (metric == null) return 0;

  // normalize: string, lower, strip commas
  let str = metric.toString().trim().toLowerCase().replace(/,/g, '');

  // strip common labels (start of string) like "comments:", "retweets:", "likes:", "views:"
  str = str.replace(/^(comments?|retweets?|likes?|views?)\s*:?\s*/i, '').trim();

  // at this point we expect things like: "10k", "7.8m", "378m", "233", ""
  if (str === '') return 0;

  const match = str.match(/^(\d*\.?\d+)\s*([kmbg])?$/); // number + optional k/m/b/g
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const suffix = match[2];

  switch (suffix) {
    case 'k': return Math.round(value * 1_000);
    case 'm': return Math.round(value * 1_000_000);
    case 'b':
    case 'g': return Math.round(value * 1_000_000_000);
    default:  return Math.round(value);
  }
}


manualInsert(twitterDirPath);