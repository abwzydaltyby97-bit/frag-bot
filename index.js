const express = require('express')
const {
Client,
GatewayIntentBits,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
} = require('discord.js')

const config = require('./config')

const app = express()
app.use(express.json())

const client = new Client({
intents: [GatewayIntentBits.Guilds]
})

client.once('ready', () => {
console.log(`${client.user.tag} is online`)
})

app.post('/webhook', async (req, res) => {
try {

const data = req.body

const channel = await client.channels.fetch(config.channelId)

const embed = new EmbedBuilder()
.setColor(config.embedColor)
.setTitle('فاتورة جديدة')
.addFields(
{
name: 'المبلغ',
value: `${data.price || '0'} دولار`,
inline: true
},
{
name: 'رقم الفاتورة',
value: `${data.invoice_id || 'غير معروف'}`,
inline: true
},
{
name: 'الحالة',
value: `${data.status || 'بانتظار الدفع'}`
}
)
.setFooter({
text: config.footerText
})
.setTimestamp()

const row = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setLabel('ادفع الآن')
.setStyle(ButtonStyle.Link)
.setURL(data.payment_url || 'https://google.com')
)

await channel.send({
embeds: [embed],
components: [row]
})

res.status(200).json({
success: true
})

} catch (err) {

console.log(err)

res.status(500).json({
error: 'Error'
})

}
})

app.listen(config.port, () => {
console.log(`Webhook running on port ${config.port}`)
})

client.login(config.token)