const supabase = require('./supabasecli');

async function connect(){
    const {data, error} = await supabase
        .from('logs')
        .select('*')
        .limit(1);
    if(error){
        console.log('[ERROR] could not connect', error);
    } else{
        console.log('connection success', data);
    }
}

connect();