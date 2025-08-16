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

module.exports = {parseMetrics};