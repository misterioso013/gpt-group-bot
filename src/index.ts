import { Context, Telegraf } from "telegraf";
import {ChatGPTAPI} from 'chatgpt';
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT_TOKEN as string);
const chatgpt = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY as string,
});
bot.start((ctx: Context) => ctx.reply('Welcome!'));

bot.hears('!id', async (ctx: Context) => {
    if(!ctx.chat?.type || !ctx.chat?.id) return;
    if(ctx.chat.type === 'private') {
        ctx.reply(ctx.chat.id.toString());
    } else {
        let message = `<b>Chat ID:</b> <code>${ctx.chat.id}</code>\n`;
        // liste os usuários do grupo e seus IDs
        const members = await ctx.telegram.getChatAdministrators(ctx.chat.id);
        message += `<b>Administradores:</b>\n`;
        for (const member of members) {
            message += `<b>${member.user.first_name}</b>: <code>${member.user.id}</code>\n`;
        }
        ctx.reply(message, {parse_mode: 'HTML'});
    }

});


bot.on('message', async (ctx: Context) => {
    try {
    // Gambiarra isso:
    if (!ctx.message || !('text' in ctx.message)) return;
    const msg = ctx.message.text;
    const get_me = await ctx.telegram.getMe();
    const group_id = process.env.ID_GROUP as string;
    const participants_ids_lit = JSON.parse(process.env.PARTICIPANTS_ID as string) as string[];
    const participants_id = participants_ids_lit.map((id) => parseInt(id));
    
    if (ctx.chat?.type === 'private' && !participants_id.includes(ctx.chat?.id as number)) return;
    if (ctx.chat?.type === 'group' && ctx.chat?.id !== parseInt(group_id)) return;

    if (ctx.chat?.type !== 'private' && !msg.startsWith('!gpt') && ctx.message.reply_to_message?.from?.id !== get_me.id && !msg.includes(get_me.username)) return;

    let message = msg.replace('!gpt', '').replace('@' + get_me.username, 'ChatGPT').trim();

    if (ctx.message.reply_to_message && 'text' in ctx.message.reply_to_message) {
        let name = ctx.message.reply_to_message.from?.first_name
        if(ctx.message.reply_to_message.from?.id === get_me.id) {
            name = 'ChatGPT';
        }
        message = `Previous message:\n${ctx.message.reply_to_message.text} from ${name}\n\nCurrent message for you:\n${message}`;
    }

    const send = await ctx.reply('Thinking...', {reply_to_message_id: ctx.message.message_id});
    console.log(send.message_id);
    const participants_list = process.env.PARTICIPANTS?.replace(/'/g, '"') as string;
    const participants = JSON.parse(participants_list) as string[];
    let response = '';
    let message_edit_per_second = 0;
    let last_edit_time = 0;
    const res = await chatgpt.sendMessage(message, {
        systemMessage: `You are ChatGPT, a large language model trained by OpenAI. You are in a Telegram group with some Brazilian developers called ${participants.join(',')}. If possible, address them by name and answer in Portuguese. Give short and direct answers, summarizing everything as much as possible until asked otherwise.\nCurrent date in brazil: ${new Date().toLocaleDateString('pt-BR')} and current time: ${new Date().toLocaleTimeString('pt-BR')}\nMessage from: ${ctx.message.from?.first_name}`,
        onProgress: (partialResponse) => {
            if (partialResponse.text.length > 0 && message_edit_per_second < 5 && Date.now() - last_edit_time > 1000 && partialResponse.text !== response) {
                response = partialResponse.text;
                message_edit_per_second++;
                last_edit_time = Date.now();
                ctx.telegram.editMessageText(ctx.chat?.id,send.message_id, undefined, response);
            } else if (message_edit_per_second >= 5) {
                message_edit_per_second = 0;
            }
        }
    });

    await ctx.telegram.editMessageText(ctx.chat?.id,send.message_id, undefined, res.text);
    } catch (e: any) {
        await ctx.reply(`<b>Error:</b> <pre>${e.message}</pre>`, {parse_mode: 'HTML'});
    }
})


bot.launch();

console.log('Starting bot...');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));