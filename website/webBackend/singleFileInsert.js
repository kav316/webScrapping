const supabase = require('./supabasecli');
const path = require('path');
const {redditParseInsert, twitterParseInsert} = require('./manualinsert');
const fs = require('fs');

const redditInsertInfo = require('./redditInsertData');
const twitterInsertInfo = require('./twitterInsertData');

//I'm assuming that I"m just going to send the path of the file in here

function singleFileInsert(dir, filePath, fileName){
    if(dir === "twitter"){
        if(fs.existsSync(filePath)){
            const fileJson = JSON.parse(fs.readFileSync(filePath));
            twitterInsertInfo(fileJson, fileName);
        }
    }
    else if(dir === "reddit"){
        const fileJson = JSON.parse(fs.readFileSync(filePath));
        twitterInsertInfo(fileJson, fileName);
    } else {
        console.log('no matching dirname, must either be "twitter" or "reddit"');
    }
}

module.exports = {singleFileInsert};