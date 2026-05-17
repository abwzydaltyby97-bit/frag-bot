const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');

const config = require('./config');

const app = express();

app.use(express.json());

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

app.get('/', (req, res) => {
    res.send('Bot Working');
});

app.post('/webhook', async (req, res) => {

    try {

        const data = req.body;

        const channel = await client.channels.fetch(config.channelId);

        const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('فاتورة جديدة')
        .addFields(
            { name: 'المبلغ', value: `${data.price || '0'}$` },
            { name: 'رقم الفاتورة', value: `${data.invoice || 'غير معروف'}` },
            { name: 'الحالة', value: 'بانتظار الدفع' }
        )
        .setFooter({ text: config.footerText });

        channel.send({
            embeds: [embed]
        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);

        res.json({
            success: false
        });

    }

});

client.once('ready', () => {
    console.log(`${client.user.tag} Ready`);
});

client.login(config.token);

app.listen(config.port, () => {
    console.log(`Webhook running on port ${config.port}`);
});
