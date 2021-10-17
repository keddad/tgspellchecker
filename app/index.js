const TelegramBot = require('node-telegram-bot-api');
const yaspeller = require('yaspeller');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

function genReport(data) {
    console.log(JSON.stringify(data));
    repeated = data.filter(x => x.code == 2);
    data = data.filter(x => x.s.length > 0);
    out = "Вот что я нашел:\n" + data.reduce((prev, cur) => { return prev + cur.word + " => " + cur.s[0] + "\n" }, "");

    if (repeated.length > 0) {
        out += "Кроме того, я нашел возможные повторы:\n";
        out += repeated.reduce((prev, cur) => { return prev + "\"" + cur.word + "\" на позиции " + cur.pos }, "")
    }

    return out;
}

bot.onText(/\/check*/, (msg, match) => {
    const chatId = msg.chat.id;
    const orig = msg.reply_to_message

    if (orig && orig.text) {
        yaspeller.checkText(
            orig.text,
            (err, data) => {
                if (err) {
                    bot.sendMessage(chatId, "Ошибка при проверке " + err);
                } else if (data.length > 0) {
                    bot.sendMessage(chatId, genReport(data));
                } else {
                    bot.sendMessage(chatId, "Выглядит нормально.")
                }
            },
            { lang: 'ru', format: 'plain', ignoreText: [new RegExp("[А-Я]{2,}", "g")], options: { findRepeatWords: true } }
        );
    } else {
        bot.sendMessage(chatId, "Эта команда должна быть в ответ на текстовое сообщение для проверки");
    }
});
