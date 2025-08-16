const supabase = require('./supabasecli');
const {debugConnectivity} = require('./debugUtils/connectDebug')

debugConnectivity(supabase);

async function redditInsertInfo(info){
  try {
    const { error } = await supabase
      .from('reddit')
      .insert([{
        posttext   : info[4],
        score      : info[0],
        postdate   : info[2],
        scrapedate : info[5],
        postlink   : info[3],
        commentcount: info[1],
      }], { returning: 'minimal' });

    if (error) {
      console.error('[ERROR]', error.message, error);
    } else {
      console.log('supabase reddit table has been updated');
    }
  } catch (e) {
    // This catches Undici-level failures before PostgREST
    console.error('[NETWORK THROW]', e.message);
    console.error('cause:', e.cause);         // ← root error code/details
    console.dir(e, { depth: 5 });
  }

};

module.exports = {redditInsertInfo};