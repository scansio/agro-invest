import IServerConfig from './libs/types/IServerConfig'
import MainServer from './server/MainServer'
import { serverTerminatorEvent } from './server/serverTerminatorEvent'
import { run } from './utils/postBuild'

const argv = process.argv
const serverNameArg = argv.find((arg) => arg.startsWith('--server='))
const actionArg = argv.find((arg) => arg.startsWith('--action='))
const serverName = serverNameArg?.split('=')[1]
const action = actionArg?.split('=')[1] || 'start'

const servers: IServerConfig[] = [{ name: 'MainServer', module: MainServer }]

if (action === 'createIndexHtmls') {
  run()
} else if (action === 'start') {
  const found = serverName && servers.find((serverConfig) => serverName === serverConfig.name)

  if (found) {
    found.module()
  } else {
    for (const serverConfig of servers) {
      serverConfig.module()
    }
  }
} else if (action === 'stop') {
  if (serverName) {
    serverTerminatorEvent(serverName)
  } else {
    for (const serverConfig of servers) {
      serverTerminatorEvent(serverConfig.name)
    }
  }
} else {
  console.error('Error: Invalid action. Use --action=start or --action=stop.')
}
