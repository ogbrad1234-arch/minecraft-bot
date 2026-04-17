const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')

function createBot() {
  console.log('[BOT] Creating bot...')

  const bot = mineflayer.createBot({
    host: 'azurion200266.mcsh.io',
    port: 25565,
    username: 'Nodejs',
    version: '1.21.4'
  })

  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    console.log('[BOT] ✅ Spawned in world!')

    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    bot.pathfinder.setMovements(movements)
    console.log('[BOT] Pathfinder ready.')

    setTimeout(() => {
      console.log('[BOT] 📝 Sending /register...')
      bot.chat('/register nodejs')
    }, 4000)

    setTimeout(() => {
      console.log('[BOT] 🔑 Sending /login...')
      bot.chat('/login nodejs')
    }, 7000)

    startBehavior(bot)

    setTimeout(() => {
      console.log('[BOT] ⏹️ 14 seconds up, disconnecting...')
      bot.quit()
    }, 21000)
  })

  bot.on('login', () => {
    console.log(`[BOT] 🌐 Connected as "${bot.username}"`)
  })

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(`[CHAT] <${username}> ${message}`)
  })

  function startBehavior(bot) {
    console.log('[BEHAVIOR] 🤖 Starting anti-detection behavior...')

    function randomDelay(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    }

    function lookAround() {
      if (!bot.entity) return
      bot.look(
        bot.entity.yaw + (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.7,
        true
      )
      setTimeout(lookAround, randomDelay(1500, 4000))
    }

    function randomJump() {
      if (!bot.entity) return
      if (Math.random() < 0.5) {
        console.log('[BEHAVIOR] 🦘 Jumping')
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), randomDelay(100, 400))
      }
      setTimeout(randomJump, randomDelay(3000, 7000))
    }

    function randomWalk() {
      if (!bot.entity) return
      const pos = bot.entity.position

      if (Math.random() < 0.3) {
        setTimeout(randomWalk, randomDelay(4000, 8000))
        return
      }

      const x = pos.x + (Math.random() - 0.5) * 14
      const z = pos.z + (Math.random() - 0.5) * 14
      console.log(`[BEHAVIOR] 🚶 Walking to X:${x.toFixed(1)} Z:${z.toFixed(1)}`)
      bot.pathfinder.setGoal(new goals.GoalXZ(x, z))
      setTimeout(randomWalk, randomDelay(4000, 9000))
    }

    function randomSneak() {
      if (!bot.entity) return
      if (Math.random() < 0.3) {
        console.log('[BEHAVIOR] 🫣 Sneaking...')
        bot.setControlState('sneak', true)
        setTimeout(() => bot.setControlState('sneak', false), randomDelay(1000, 3000))
      }
      setTimeout(randomSneak, randomDelay(6000, 12000))
    }

    function randomStop() {
      if (!bot.entity) return
      if (Math.random() < 0.2) {
        console.log('[BEHAVIOR] ✋ Stopping all movement')
        bot.clearControlStates()
        bot.pathfinder.setGoal(null)
      }
      setTimeout(randomStop, randomDelay(5000, 10000))
    }

    lookAround()
    randomJump()
    randomWalk()
    randomSneak()
    randomStop()
  }

  bot.on('kicked', (reason) => {
    console.log(`[BOT] ⚠️ Kicked: ${reason}`)
    setTimeout(createBot, 5000)
  })

  bot.on('end', (reason) => {
    console.log(`[BOT] 🔌 Disconnected (${reason}). Reconnecting in 5s...`)
    setTimeout(createBot, 5000)
  })

  bot.on('error', (err) => {
    console.error(`[BOT] ❌ Error: ${err.message}`)
    setTimeout(createBot, 5000)
  })
}

createBot()
