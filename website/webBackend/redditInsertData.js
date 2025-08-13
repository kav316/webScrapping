const supabase = require('./supabasecli');

async function redditInsertInfo(info){
    const {data, error} = await supabase
        .from('reddit')
        .insert([
            {
                posttext : info[4],
                score : info[0],
                postdate : info[2],
                scrapedate : info[5],
                postlink : info[3],
                commentcount : info[1]
            }
        ]);
    if(error) {
        console.log('[ERROR]', error.message);
    } else {
        console.log('supabase reddit table has been updated');
    }

};

module.exports = {redditInsertInfo};