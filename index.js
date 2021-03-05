/*
[ 필수 확인 ]

본 코드는 나긋해님의 코드를 Discord.js v12에 맞게 변경한 코드이며,
SERVER MEMBERS INTENT 활성화를 필요로 합니다.

봇 토큰을 발급받는 페이지에서 하단으로 스크롤하면 Privileged Gateway Intents 라는 항목이 있습니다.
해당 항목 중 SERVER MEMBERS INTENT 를 활성화 해주시면 됩니다.

활성화가 됬다면 우측 버튼이 파란색으로 바뀝니다.

만약 활성화하지 않고 봇을 키시면 켜지지 않습니다.
*/

const Discord = require("discord.js")
const intent_list = new Discord.Intents(["GUILD_MEMBERS", "GUILD_MESSAGES", "GUILDS", "GUILD_INVITES"])
const client = new Discord.Client({ ws: { intents: intent_list } })
const token = process.argv.length == 2 ? process.env.token : "" // heroku를 사용하지 않을꺼라면 const token = "디스코드 봇 토큰" 으로 바꿔주세요.
const welcomeChannelName = "👋hello" // 입장 시 환영메시지를 전송 할 채널의 이름을 입력하세요.
const byeChannelName = "👋bye" // 퇴장 시 메시지를 전송 할 채널의 이름을 입력하세요.
const welcomeChannelComment = "반갑습니다. 꿀벌서버입니다 .✨" // 입장 시 전송할 환영메시지의 내용을 입력하세요.
const byeChannelComment = "잘가세용 ㅋ.✨" // 퇴장 시 전송할 메시지의 내용을 입력하세요.
const roleName = "게스트" // 입장 시 지급 할 역할의 이름을 적어주세요.

client.on("ready", () => {
  console.log("켰다.")
  client.user.setPresence({ activity: { name: "!야 토이 해주세요." }, status: "online" })
})

client.on("guildMemberAdd", (member) => {
  const guild = member.guild
  const newUser = member.user
  const welcomeChannel = guild.channels.cache.find((channel) => channel.name == welcomeChannelName)

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`) // 올바른 채널명을 기입하지 않았다면, Cannot read property 'send' of undefined; 오류가 발생합니다.
  member.roles.add(guild.roles.cache.find((role) => role.name === roleName).id)
})

client.on("guildMemberRemove", (member) => {
  const guild = member.guild
  const deleteUser = member.user
  const byeChannel = guild.channels.cache.find((channel) => channel.name == byeChannelName)

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`) // 올바른 채널명을 기입하지 않았다면, Cannot read property 'send' of undefined; 오류가 발생합니다.
})

client.on("message", (message) => {
  if (message.author.bot) return

  if (message.content == "/ping") {
    return message.reply("pong")
  }

  if (message.content == "기호") {
    let img = "https://cdn.discordapp.com/attachments/762245029691129877/786819408332193833/d.png"
    let embed = new Discord.MessageEmbed()
      .setTitle("꿀벌")
      .setURL("http://www.naver.com")
      .setAuthor("네이버", img, "http://www.naver.com")
      .setThumbnail(img)
      .addField("꿀벌 카톡링크", "미완료 ")
      .addField("서버개발자", "해커팀성클킹\n기호\n")
      .setTimestamp()
      .setFooter("꿀벌들이 만듬", img)

    message.channel.send(embed)
  } else if (message.content == "!야 토이") {
    let helpImg = "https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png"
    let commandList = [
      { name: "!야 토이", desc: "help" },
      { name: "/ping", desc: "현재 핑 상태" },
      { name: "기호", desc: "embed 예제1" },
      { name: "야 토이 전체공지", desc: "dm으로 전체 공지 보내기" },
      { name: "야 토이 전체공지2", desc: "dm으로 전체 embed 형식으로 공지 보내기" },
      { name: "!토이", desc: "텍스트 지움" },
      { name: "야 토이 초대코드", desc: "해당 채널의 초대 코드 표기" },
      { name: "야 토이 초대코드2", desc: "봇이 들어가있는 모든 채널의 초대 코드 표기" },
      { name: "핵", desc: "핵툴명령어들" },
    ]
    let commandStr = ""
    let embed = new Discord.MessageEmbed().setAuthor("Help of 토이 BOT", helpImg).setColor("#186de6").setFooter(`토이 BOT ❤️`).setTimestamp()

    commandList.forEach((x) => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`
    })

    embed.addField("Commands: ", commandStr)

    message.channel.send(embed)
  } else if (message.content == "야 토이 초대코드2") {
    client.guilds.cache.array().forEach((x) => {
      x.channels.cache
        .find((x) => x.type == "text")
        .createInvite({ maxAge: 0 }) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
        .then((invite) => {
          message.channel.send(invite.url)
        })
        .catch((err) => {
          if (err.code == 50013) {
            message.channel.send(`**${x.channels.cache.find((x) => x.type == "text").guild.name}** 채널 권한이 없어 초대코드 발행 실패`)
          }
        })
    })
  } else if (message.content == "야 토이 초대코드") {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }
    message.guild.channels.cache
      .get(message.channel.id)
      .createInvite({ maxAge: 0 }) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
      .then((invite) => {
        message.channel.send(invite.url)
      })
      .catch((err) => {
        if (err.code == 50013) {
          message.channel.send(`**${message.guild.channels.cache.get(message.channel.id).guild.name}** 채널 권한이 없어 초대코드 발행 실패`)
        }
      })
  } else if (message.content.startsWith("야 토이 전체공지2")) {
    if (checkPermission(message)) return
    if (message.member != null) {
      // 채널에서 공지 쓸 때
      let contents = message.content.slice("야 토이 전체공지2".length)
      let embed = new Discord.MessageEmbed().setAuthor("공지 of 토이 BOT").setColor("#186de6").setFooter(`토이 BOT ❤️`).setTimestamp()

      embed.addField("공지: ", contents)

      message.member.guild.members.cache.array().forEach((x) => {
        if (x.user.bot) return
        x.user.send(embed)
      })

      return message.reply("공지를 전송했습니다.")
    } else {
      return message.reply("채널에서 실행해주세요.")
    }
  } else if (message.content.startsWith("야 꿀벌전체공지")) {
    if (checkPermission(message)) return
    if (message.member != null) {
      // 채널에서 공지 쓸 때
      let contents = message.content.slice("야 꿀벌 전체공지".length)
      message.member.guild.members.cache.array().forEach((x) => {
        if (x.user.bot) return
        x.user.send(`<@${message.author.id}> ${contents}`)
      })

      return message.reply("공지를 전송했습니다.")
    } else {
      return message.reply("채널에서 실행해주세요.")
    }
  } else if (message.content.startsWith("!토이")) {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }

    if (message.channel.type != "dm" && checkPermission(message)) return

    var clearLine = message.content.slice("!토이 ".length)
    var isNum = !isNaN(clearLine)

    if (isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return
    } else if (!isNum) {
      // c @나긋해 3
      if (message.content.split("<@").length == 2) {
        if (isNaN(message.content.split(" ")[2])) return

        var user = message.content.split(" ")[1].split("<@!")[1].split(">")[0]
        var count = parseInt(message.content.split(" ")[2]) + 1
        let _cnt = 0

        message.channel.messages.fetch().then((collected) => {
          collected.every((msg) => {
            if (msg.author.id == user) {
              msg.delete()
              ++_cnt
            }
            return !(_cnt == count)
          })
        })
      }
    } else {
      message.channel
        .bulkDelete(parseInt(clearLine) + 1)
        .then(() => {
          message.channel.send(`<@${message.author.id}> ${parseInt(clearLine)} 개의 메시지를 삭제했습니다. (이 메시지는 잠시 후 사라집니다.)`).then((msg) => msg.delete({ timeout: 3000 }))
        })
        .catch(console.error)
    }
  }
})

function checkPermission(message) {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> 명령어를 수행할 관리자 권한을 소지하고 있지않습니다.`)
    return true
  } else {
    return false
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str
  limitLen -= tmp.length

  for (let i = 0; i < limitLen; i++) {
    tmp += " "
  }

  return tmp
}
if (message.content == "잠수시작") {
  return message.reply("@everyone 잠수를 시작했습니다")
}
if (message.content == "잠수해제") {
  return message.reply("@everyone 잠수를 해제했습니다")
}
if (message.content == "섹스시작") {
  return message.reply("@everyone 섹스를 시작하셨습니다")
}
if (message.content == "섹스종료") {
  return message.reply("@everyone 섹스를 종료하셨습니다")
}
if (message.content == "게임 서든") {
  return message.reply("@everyone 서든을 시작했습니다")
}
if (message.content == "게임 테런") {
  return message.reply("@everyone 테런을 시작했습니다")
}
if (message.content == "언로드") {
  return message.reply("@everyone 언로드 구매문의:토이#3656")
}
if (message.content == "우디르") {
  return message.reply("@everyone 우디르 구매문의:토이#3656")
}
if (message.content == "랜계") {
  return message.reply("@everyone 랜덤계정 구매문의:토이#3656")
}
if (message.content == "솔") {
  return message.reply("@everyone 솔 구매문의:토이#3656")
}
if (message.content == "길로틴") {
  return message.reply("@everyone 길로틴 구매문의:토이#3656")
}
if (message.content == "테드") {
  return message.reply("@everyone 테드 구매문의:토이#3656")
}
if (message.content == "테라") {
  return message.reply("@everyone 테라 구매문의:토이#3656")
}
if (message.content == "카키") {
  return message.reply("@everyone 카키 구매문의:토이#3656")
}
if (message.content == "오토샷") {
  return message.reply("@everyone 오토샷 구매문의:토이#3656")
}
if (message.content == "영구제") {
  return message.reply("@everyone 영구제 구매문의:토이#3656")
}
if (message.content == "핵") {
  return message.reply("@everyone 언로드,우디르,랜계,솔,길로틴,테드,테라,카키,오토샷 구매문의:토이#3656")
}
client.login(token)
