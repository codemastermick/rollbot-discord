const Discord = require('discord.js');
const bot = new Discord.Client();

const dicebag = require('dicewerx');

const { token } = require('./auth.json');

bot.login(token);

bot.on('ready', () => {
    // List servers the bot is connected to
    console.log("RollBot is running on:")
    bot.guilds.forEach((guild) => {
        console.log(" - " + guild.name);
        guild.channels.forEach(channel => {
            if (channel.type === "text") {
                bot.channels.get(channel.id).send("RollBot is here and ready to throw some dice!");
            }
        });
    });
    bot.user.setActivity("with dice");
});

bot.on('message', (msg) => {
    // So the bot doesn't reply to iteself
    if (msg.author === bot.user) return;
    if (msg.content.toLowerCase().includes('rollbot')) {
        msg.channel.send('Did you need a roll? Use !roll <EXPRESSION>');
    }
    processMessage(msg);
});


function processMessage(msg) {
    // Check if the message starts with the `!` trigger
    if (msg.content.indexOf('!') === 0) {
        // we hit a command
        if (msg.content.includes('!roll')) {
            rollDice(msg);
        } else if (msg.content.includes('!stats')) {
            rollStats(msg);
        } else if (msg.content.includes('!cointoss')) {
            flipCoin(msg);
        }
        else if (msg.content.includes('!help')) {
            helpMessage(msg);
        } else {
            msg.channel.send("I'm sorry, I did not understand what you wanted. Printing help...")
            helpMessage(msg);
        }
    } else {
        // msg was not a command
        msg.channel.send("I'm sorry, I did not understand what you wanted. Printing help...")
        helpMessage(msg);
    }
}

function rollDice(msg) {
    // chop arguments and do roll
    let words = msg.content.split(" ");
    let result;
    try {
        result = dicebag.evaluate(words[1]);
    } catch (error) {
        msg.channel.send('Whoa, something went wrong there: ' + error);
        helpMessage(msg);
    } finally {
        msg.channel.send(result);
    }
}

function flipCoin(msg) {
    const result = dicebag.evaluate("1d2");
    msg.channel.send(result === 1 ? "Heads" : "Tails");
}

function doAFlip(msg) {
    msg.channel.send("¿sıɥʇ ǝʞıן dıןɟ ɐ op oʇ ǝɯ pǝʇuɐʍ noʎ");
}

function rollStats(msg) {
    rolls = [6];
    for (let i = 0; i < 6; i++) {
        rolls[i] = dicebag.evaluate("4d6-L");
    }
    msg.channel.send(`Rolled stats:\n\t\t\t${rolls[0]}\n\t\t\t${rolls[1]}\n\t\t\t${rolls[2]}\n\t\t\t${rolls[3]}\n\t\t\t${rolls[4]}\n\t\t\t${rolls[5]}`.toString());
}

function helpMessage(msg) {
    msg.channel.send("To invoke a roll, type in !roll followed by a standard dice notation expression. If you need information about standard dice notation, please see https://en.wikipedia.org/wiki/Dice_notation \n" +
        "I understand XdY notation, explosive operations (!), drop operations (-L or -H), and basic math. \n" +
        "I can also flip a coin using the !cointoss command.");
}