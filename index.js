const { Client, Intents } = require('discord.js');
const { WebhookClient } = require("discord.js");
const fs = require("fs");
const main = require("../../data/global/main.json");
const sub = require("../../data/global/sub.json");
require("dotenv").config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('messageCreate', async (message) =>{
  if(!message.channel.type === "GUILD_TEXT" || message.author.bot || !main[message.channel.id]) return;

  if(message.content.length > 300){
    return message.react("❌")
      .catch(()=>{}) 
  }

  const content = message.content
    .replace(/@everyone|@here/g,"[メンション]")
    .replace(/死ね|カス|クズ|ゴミ|ごみ|黙れ|消えろ|うんち|ウンコ|ウンチ|死んどけ/g,"[NG]")
    .replace(/(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|(?:discord|discordapp)\.com\/invite)\/(\w+)/g,"[招待リンク]")
    
  if(!message.attachments.first()){
    Object.keys(main).forEach(async (channels)=>{
      if(channels == message.channel.id) return;

      const webhooks = new WebhookClient({id: main[channels][0], token: main[channels][1]});
      await webhooks.send({
        embeds:[{
          color: message.member.displayHexColor,
          author: {
            name: `${message.author.tag}(${message.author.id})`,
            icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description: content,
          footer: {
            text:`${message.guild.name}<${message.guild.id}>`,
            icon_url:message.guild.iconURL() ||"https://cdn.discordapp.com/embed/avatars/0.png"
          },
          timestamp: new Date()
        }]      
      }).catch(()=>{
        delete main[channels];
        const guild = Object.keys(sub).filter((key)=> sub[key] == channels);
        delete sub[guild];
        fs.writeFileSync("./data/global/main.json", JSON.stringify(main), "utf8");
        fs.writeFileSync("./data/global/sub.json", JSON.stringify(sub), "utf8");
        delete require.cache[require.resolve("../../data/global/sub.json")];
        delete require.cache[require.resolve("../../data/global/main.json")];
      })
    })
    message.react("✅")
      .catch(()=>{});
    return;
  }else if(message.attachments.first().height && message.attachments.first().width){
    const attachment = message.attachments.map(attachment => attachment);
    Object.keys(main).forEach(async (channels)=>{
      if(channels == message.channel.id) return;
      const webhooks = new WebhookClient({id: main[channels][0], token: main[channels][1]});

      await webhooks.send({
        embeds:[
          {
            color: message.member.displayHexColor,
            author: {
              name: `${message.author.tag}(${message.author.id})`,
              icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
            },
            description: content,
            footer: {
              text: `${message.guild.name}<${message.guild.id}>`,
              icon_url:message.guild.iconURL() ||"https://cdn.discordapp.com/embed/avatars/0.png"
            },
            timestamp: new Date()
          },
          {
            title: attachment[0].name,
            image: {
              url: attachment[0].url
            }
          }
        ]
      }).catch(()=>{
        delete main[channels];
        const guild = Object.keys(sub).filter((key)=> sub[key] == channels);
        delete sub[guild];
        fs.writeFileSync("./data/global/main.json", JSON.stringify(main), "utf8");
        fs.writeFileSync("./data/global/sub.json", JSON.stringify(sub), "utf8");
        delete require.cache[require.resolve("../../data/global/sub.json")];
        delete require.cache[require.resolve("../../data/global/main.json")];
      })
    })
    message.react("✅")
      .catch(()=>{});
    return;
  }else{
    const attachment = message.attachments.map(attachment => attachment);

    Object.keys(main).forEach(async (channels)=>{
      if(channels == message.channel.id) return;
      const webhooks = new WebhookClient({id: main[channels][0], token: main[channels][1]});
      await webhooks.send({
        embeds:[{
          color: message.member.displayHexColor,
          author: {
            name: `${message.author.tag}(${message.author.id})`,
            icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description: content,
          footer: {
            text:`${message.guild.name}<${message.guild.id}>` ,
            icon_url:message.guild.iconURL() ||"https://cdn.discordapp.com/embed/avatars/0.png"
          },
          fields: [
            {
              name: "**添付ファイル**",
              value: `[${attachment[0].name}](${attachment[0].url})`
            }
          ],
          timestamp: new Date()
        }]
      }).catch(()=>{
        delete main[channels];
        const guild = Object.keys(sub).filter((key)=> sub[key] == channels);
        delete sub[guild];
        fs.writeFileSync("./data/global/main.json", JSON.stringify(main), "utf8");
        fs.writeFileSync("./data/global/sub.json", JSON.stringify(sub), "utf8");
        delete require.cache[require.resolve("../../data/global/sub.json")];
        delete require.cache[require.resolve("../../data/global/main.json")];
      })
    })
    message.react("✅")
      .catch(()=>{});
    return;
  }
});

client.once("ready", async (client) =>{
  let stats = 0; 
  setInterval(() => {
    if(stats == 0){
      client.user.setActivity(`開発:Taka005#1203`, {
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
   .then(()=> console.info(`\x1b[34mINFO:ログインに成功しました`))
   .catch(()=> console.error(`\x1b[31mERROR:ログインに失敗しました`))

process.on('uncaughtException', (error) => {
  console.error(`\x1b[31mERROR: `+error);
  return;
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`\x1b[31mERROR: `+`promise[${promise}] reason[${reason.message}]`);
  return;
});