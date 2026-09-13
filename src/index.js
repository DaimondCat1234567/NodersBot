import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { getIndex, updateIndex } from './data.js'
import { translate } from './lib/translations/index.js'
import bot from './bot.js'
import DashAttach from 'dashattach'
import dotenv from 'dotenv'

dotenv.config()

const { CHAT8787_ID, MODERS_CHAT_ID, MODERS_LOGS_CHAT } = process.env

const emoji = {
    views: "👁️‍🗨️",
    forks: "🌀",
    fires: "🔥"
}

const log = (text, parse_mode) => {
    bot.telegram.sendMessage(MODERS_LOGS_CHAT, text, { parse_mode: parse_mode ? parse_mode : "HTML" })
}

bot.telegram.sendMessage(CHAT8787_ID, "Бот запущен", { parse_mode: "HTML" })
bot.telegram.sendMessage(MODERS_CHAT_ID, "Бот запущен", { parse_mode: "HTML" })
log("Бот запущен")

bot.command('start', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    ctx.reply("Добро пожаловать в Модерс Бота!\nОтправьте /help для получения помощи по боту.", { parse_mode: "HTML" })
})

bot.command('help', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    ctx.reply(`<b>Команды:</b>
/info [id] - информация о выбранном пользователе
/me - ваша информация
/ban [user] - заблокировать пользователя
/unban [user] - разблокировать пользователя
/mute [user] - запретить пользователю писать
/unmute [user] - разрешить пользователю писать
/setpermission [user] [permission] [value (true/false строчными)] - изменить права пользователя
/dashproject [id] - получить проект на <a href="https://dashblocks.org">Dash</a>
/dashuser [id/username] - получить пользователя на <a href="https://dashblocks.org">Dash</a>
Исходный код: https://github.com/shaman2016scratch/moders-tg-bot
    `, { parse_mode: "HTML" })
})

bot.command('info', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const userId = ctx.message.text.replace("/info ", "")
    const user = data.users[userId.toString()]
    if (user) {
        ctx.reply(`<b>Информация о пользователе</b>\nID: ${user.id || 0}\nUsername: ${user.username}\nИмя: ${user.firstName}\nВ боте с ${new Date(user.joined)}\nРепутация: ${user.reputation}`, { parse_mode: "HTML" })
    } else {
        ctx.reply(`Пользователя не существует`)
    }
})

bot.hears('+', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    if (ctx.message.reply_to_message) {
        if (!Object.keys(data.users).includes(ctx.message.reply_to_message.from.id.toString())) {
            data.users[ctx.message.reply_to_message.from.id.toString()] = {
                id: ctx.message.reply_to_message.from.id,
                username: ctx.message.reply_to_message.from.username,
                firstName: ctx.message.reply_to_message.from.first_name,
                language: "en",
                joined: new Date(),
                reputation: 0
            }
            await updateIndex(data)
        }
        data.users[ctx.message.reply_to_message.from.id.toString()].reputation++
        await updateIndex(data)
        const sendUser = (ctx.message.from.username ? `@${ctx.message.from.username}` : `tg://user?id=${ctx.message.from.id}`)
        const targetUser = (ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `tg://user?id=${ctx.message.reply_to_message.from.id}`)
        ctx.reply(`${sendUser} увеличил репутацию ${targetUser}.\nНовая репутация: ${data.users[ctx.message.reply_to_message.from.id.toString()].reputation}`, { parse_mode: "HTML" })
    }
})

bot.hears('-', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    if (ctx.message.reply_to_message) {
        if (!Object.keys(data.users).includes(ctx.message.reply_to_message.from.id.toString())) {
            data.users[ctx.message.reply_to_message.from.id.toString()] = {
                id: ctx.message.reply_to_message.from.id,
                username: ctx.message.reply_to_message.from.username,
                firstName: ctx.message.reply_to_message.from.first_name,
                language: "en",
                joined: new Date(),
                reputation: 0
            }
            await updateIndex(data)
        }
        data.users[ctx.message.reply_to_message.from.id.toString()].reputation--
        await updateIndex(data)
        const sendUser = (ctx.message.from.username ? `@${ctx.message.from.username}` : `tg://user?id=${ctx.message.from.id}`)
        const targetUser = (ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `tg://user?id=${ctx.message.reply_to_message.from.id}`)
        ctx.reply(`${sendUser} уменьшил репутацию ${targetUser}.\nНовая репутация: ${data.users[ctx.message.reply_to_message.from.id.toString()].reputation}`, { parse_mode: "HTML" })
    }
})

bot.command('me', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const userId = ctx.message.from.id
    const user = data.users[userId.toString()]
    ctx.reply(`<b>Информация о пользователе</b>\nID: ${user.id || 0}\nUsername: ${user.username}\nИмя: ${user.firstName}\nВ боте с ${new Date(user.joined)}\nРепутация: ${user.reputation}`, { parse_mode: "HTML" })
})

bot.command('addbotadmin', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    if (data.admins.includes(ctx.message.from.id)) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.replace("/info ", "")
        data.admins.push(userId)
        await updateIndex(data)
    }
})

bot.command('setreputation', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    if (data.admins.includes(ctx.message.from.id)) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        const rep = ctx.message.reply_to_message ? Number(ctx.message.text.split(" ")[1]) : Number(ctx.message.text.split(" ")[2])
        data.users[userId.toString()].reputation = rep
        await updateIndex(data)
    }
})

bot.command('ban', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        const time = ctx.message.reply_to_message ? Number(ctx.message.text.split(" ")[1]) : Number(ctx.message.text.split(" ")[2])
        try {
            await ctx.banChatMember(userId, time)
            ctx.reply(`Пользователь ${userId} забанен!`)
        } catch (e) {
            ctx.reply(`Error with ban chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('unban', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        try {
            await ctx.unbanChatMember(userId)
            ctx.reply(`Пользователь ${userId} разбанен!`)
        } catch (e) {
            ctx.reply(`Error with unban chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('mute', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        try {
            await ctx.restrictChatMember(userId, { permissions: { can_send_messages: false } })
            ctx.reply(`Пользователь ${userId} замучен!`)
        } catch (e) {
            ctx.reply(`Error with mute chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('unmute', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        try {
            await ctx.restrictChatMember(userId, { permissions: { can_send_messages: true } })
            ctx.reply(`Пользователь ${userId} размучен!`)
        } catch (e) {
            ctx.reply(`Error with unmute chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('setpermission', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    let permissions = {}
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        const permission = ctx.message.reply_to_message ? ctx.message.text.split(" ")[1] : ctx.message.text.split(" ")[2]
        const val = ctx.message.reply_to_message ? ctx.message.text.split(" ")[2] : ctx.message.text.split(" ")[3]
        permissions[permission] = Boolean(val)
        try {
            await ctx.restrictChatMember(userId, { permissions })
            ctx.reply(`Успех при смене прав ${userId}!`)
        } catch (e) {
            ctx.reply(`Error with set permissions user chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('dashproject', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const projectId = ctx.message.text.split(" ")[1]
    try {
        const info = {
            author: await DashAttach.info.projects.getAuthorUsername(projectId),
            forks: await DashAttach.info.projects.stats.forks(projectId),
            views: await DashAttach.info.projects.stats.views(projectId),
            fires: await DashAttach.info.projects.stats.fires(projectId),
            description: await DashAttach.info.projects.getDescription(projectId),
            name: await DashAttach.info.projects.getName(projectId),
            url: await DashAttach.info.projects.getFileURL(projectId)
        }
        ctx.reply(`<b>Проект <a href="https://dashblocks.org/#${projectId}">${info.name}</a></b>\n${emoji.views} ${info.views} ${emoji.forks} ${info.forks} ${info.fires}${emoji.fires}\n\n<b>Автор: </b><a href="https://dashblocks.org/user#${info.author}">${info.author}</a>\n<b>Описание: </b>${info.description}\n\nСкачать: ${info.url}`, { parse_mode: "HTML" })
    } catch (e) {
        ctx.reply(`Error with get dash project info: ${e.message}`)
        console.error(e)
    }
})

bot.command('dashuser', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const userId = ctx.message.text.split(" ")[1]
    try {
        const info = {
            username: await DashAttach.info.users.getUsername(await DashAttach.info.users.getId(userId)),
            id: await DashAttach.info.users.getId(userId),
            description: await DashAttach.info.users.getDescription(userId),
            featured: {
                id: (await DashAttach.info.users.getRecommendedProject(userId)).id,
                name: await DashAttach.info.projects.getName((await DashAttach.info.users.getRecommendedProject(userId)).id)
            }
        }
        ctx.reply(`<b>Пользователь <a href="https://dashblocks.org/user#${info.id}">${info.username}</a></b>\n\n<b>Описание: </b>${info.description}\nРекомендуемый проект: <a href="https://dashblocks.org/#${info.featured.id}">${info.featured.name}</a>`, { parse_mode: "HTML" })
    } catch (e) {
        ctx.reply(`Error with get dash user info: ${e.message}`)
        console.error(e)
    }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))