const fs = require('fs');
const path = require('path');

async function wordCount(givenPath){

    const stopWords = new Set([
        'a', 'an', 'the', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'on', 'for', 'with',
        'and', 'or', 'but', 'at', 'by', 'it', 'this', 'that', 'from', 'as', 'be', 'has', 'have',
        'had', 'do', 'does', 'did', 'so', 'if', 'out', 'up', 'down', 'i', 'you', 'he', 'she', 'they',
        'we', 'my', 'your', 'our', 'their', 'not', 'me', 'his', 'her', 'them', 'its', 'what', 'why', 'will',
        'which', 'when', 'than', 'going', 'could', 'after', 'how'
    ]);

    let contentArray = [];

    if(fs.readdirSync(givenPath)){
        const dirPath = fs.readdirSync(givenPath);
        for(file of dirPath){
            const filePath = path.join(givenPath, file);
            const fileObj = fs.readFileSync(filePath, 'utf8');
            const jsonObj = JSON.parse(fileObj);
            contentArray.push(jsonObj);
        }
    } else{
        console.log('[ERROR] dir does not exist');
    }

    let wordCount = {};

    for(x of contentArray){
        for(content of x){
            if(content.text){
                let words = content.text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
                for(let word of words){
                    if (stopWords.has(word)) {
                        continue;
                    }
                    wordCount[word] = (wordCount[word] || 0) + 1;
                }
            } else {
                continue;
            }
        }
    }

    const sortedWords = Object.entries(wordCount).sort((a,b)=> b[1]-a[1]);

    console.log(sortedWords);


};

let pathExample = path.join(__dirname, 'redditScrapping', 'results');

wordCount(pathExample);