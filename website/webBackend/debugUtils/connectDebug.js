
async function debugConnectivity(supabase) {
  try {
    // lightweight call; will fail fast if URL/key/proxy/cert are wrong
    const { error } = await supabase.from('reddit').select('id').limit(1);
    if (error) {
      console.error('[PING ERROR]', error);
    } else {
      console.log('[PING OK] Supabase reachable');
    }
  } catch (e) {
    console.error('[PING THROW]', e.message);
    console.error('cause:', e.cause);         // ← prints ENOTFOUND/ECONNREFUSED/etc.
    console.dir(e, { depth: 5 });
  }
}

module.exports = {debugConnectivity};