import { Client, Intents } from 'discord.js';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { config } from 'dotenv';
config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const fetchRequest = () => {
  const interval = setInterval(async () => {
   const res = await fetch('https://www.reddit.com/r/mechmarket/new/');
    const html = await res.text();

    const $ = cheerio.load(html);
    const h3 = $('h3').text();
    const h3split = h3.split('[H]');
    const subh3split = h3split.map(item => item.substring(0, item.indexOf('[')));
    subh3split.shift();
    const foundItem = subh3split.find(item => {
      const lower = item.toLowerCase();
      return lower.indexOf('paypal') != -1;
    });

    const currentDate = new Date();
    console.log(currentDate);
    console.log(subh3split);

    if (foundItem) {
      client.users.fetch(process.env.userid).then(user => {
        user.send('https://www.reddit.com/r/mechmarket/new/');
      });;
      clearInterval(interval);
    }
  }, 5000);
};

client.on('ready', () => {
  console.log('Starting job');
  fetchRequest();
});

client.on('messageCreate', async (message) => {
  console.log('message');
  if (!message.content.startsWith('/') || message.author.bot) return;

  const args = message.content.slice(1).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'start') {
    message.channel.send('Restarting job');
    fetchRequest();
  }
});

client.login(process.env.token);
