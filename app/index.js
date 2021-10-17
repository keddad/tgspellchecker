const TelegramBot = require('node-telegram-bot-api');
const yaspeller = require('yaspeller');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

function genReport(data) {
    return "Вот что я нашел:\n" + data.reduce((prev, cur) => { return prev + cur.word + " => " + cur.s[0] + "\n" }, "")
}

bot.onText(/\/check*/, (msg, match) => {
    const chatId = msg.chat.id;
    const orig = msg.reply_to_message

    if (orig && orig.text) {
        yaspeller.checkText(
            orig.text,
            (err, data) => {
                console.log(err);
                console.log(data);
                if (err) {
                    bot.sendMessage(chatId, "Ошибка при проверке " + err);
                } else if (data.length > 0) {
                    bot.sendMessage(chatId, genReport(data));
                } else {
                    bot.sendMessage(chatId, "Выглядит нормально.")
                }
            },
            { lang: 'ru', format: 'plain', ignoreText: [new RegExp("[А-Я]{2,}", "g")] }
        );
    } else {
        bot.sendMessage(chatId, "Эта команда должна быть в ответ на текстовое сообщение для проверки");
    }
});
