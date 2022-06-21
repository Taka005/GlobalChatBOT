const { Client, Intents } = require('discord.js');
require("dotenv").config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

const setting = {

};

let now = new Date();
let h = now.getHours();
let m = now.getMinutes();
let s = now.getSeconds();

client.on('messageCreate', async (message) =>{
  //何か
});

client.on("interactionCreate", async (interaction) =>{
  //何か
});

client.once("ready", async (client) =>{
  let stats = 0; 
  setInterval(() => {
    if(stats == 0){
      client.user.setActivity(`Fixed by Taka005#1203`, {
        type: 'PLAYING'
      });      
      stats = 1;
    }else if(stats == 1){
      client.user.setActivity(`/help || ping:${client.ws.ping}ms`, {
        type: 'PLAYING'
      });
      stats = 2;
    }else if(stats == 2){
      client.user.setActivity(`ver:1.0.0`, {
        type: 'PLAYING'
      });
      stats = 3; 
    }else if(stats == 3){
      client.user.setActivity(`${client.guilds.cache.size}server || ${client.guilds.cache.map((g) => g.memberCount).reduce((a, c) => a + c)}user`,{
        type: 'PLAYING'
      });
      stats = 0;
    }
  }, 8000)
});

client.login(process.env.TOKEN)
   .then(()=> console.info(`\x1b[34m[${h}:${m}:${s}]INFO:ログインに成功しました`))
   .catch(()=> console.error(`\x1b[31m[${h}:${m}:${s}]ERROR:ログインに失敗しました`))

process.on('uncaughtException', (error) => {
  console.error(`\x1b[31m[${h}:${m}:${s}]ERROR: `+error);
  return;
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`\x1b[31m[${h}:${m}:${s}]ERROR: `+`promise[${promise}] reason[${reason.message}]`);
  return;
});