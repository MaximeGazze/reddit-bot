import fetch from 'node-fetch';
import cheerio from 'cheerio';

const findf1 = async () => {
  const res = await fetch('https://www.reddit.com/r/mechmarket/new/');
  const html = await res.text();

  const $ = cheerio.load(html);
  const h3 = $('h3').text();
  const h3split = h3.split('[H]');
  const subh3split = h3split.map(item => item.substring(0, item.indexOf('[')));
  subh3split.shift();
  const foundItem = subh3split.find(item => {
    const lower = item.toLowerCase();
    return lower.indexOf('purple') != -1;
  });
  console.log(subh3split);
  if (foundItem) console.log('itemFound');
};

findf1();
