const supabase = require('./supabasecli');

async function twitterInsertInfo(info){
    const {data, error} = await supabase
        .from('twitter')
        .insert([
            {
                posttext : info[4],
                comments : info[0],
                retweets : info[1],
                likes : info[2],
                views : info[3],
                imglink : info[5],
                scrapedate : info[9],
                vidlink : info[6],
                postlink : info[7],
                postdate : info[8]
            }
        ]);
    if(error) {
        console.log('[ERROR]', error.message);
    } else {
        console.log('supabase twitter table has been updated');
    }

};

module.exports = {twitterInsertInfo};