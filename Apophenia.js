const fs = require('fs');
const path = require('path');

async function wordCount(givenPath){

    let contentArray = [];

    if(fs.readdirSync(givenPath)){
        const dirPath = fs.readdirSync(givenPath);
        for(file of dirPath){
            const filePath = path.join(givenPath, file);
            const fileObj = fs.readFileSync(filePath, 'utf8');
            const jsonObj = JSON.parse(fileObj);
            for(post of jsonObj){
                post.text = post.Title;
                delete post.Title;
            }
            contentArray.push(jsonObj);
            fs.writeFileSync(filePath, JSON.stringify(jsonObj, null, 2), 'utf8');
            
            
        }
    } else{
        console.log('[ERROR] dir does not exist');
    }

    //for(x of contentArray){
    //    console.log(x);
    //}

};

let pathExample = path.join(__dirname, 'redditScrapping', 'results');

wordCount(pathExample);