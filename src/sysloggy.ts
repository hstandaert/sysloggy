import Table from "cli-table"
import "colors"
import { format, formatDistanceStrict } from "date-fns"
import { Log, LogGroup } from "types/system"
import { OptionValues } from "./options"
import getLogs from "./util/getLogs"

const groupLogs = (logs: Log[]) => {
  const groups: LogGroup[] = []

  let index = 0
  while (index < logs.length) {
    const startLog = logs[index]
    const endLog = logs[index + 1]

    if (!startLog.active) {
      logs.shift()
      continue
    }

    groups.push({
      start: startLog.date,
      end: endLog ? endLog.date : new Date()
    })

    index += 2
  }

  return groups
}

const sysloggy = async (options: OptionValues) => {
  const logs = await getLogs(options.last)
  const groups: LogGroup[] = groupLogs(logs)

  const table = new Table({ head: ["Start".cyan, "End".cyan, "Duration".cyan] })
  table.push(
    ...groups.map(group => [
      format(group.start, "dd/MM/yyyy HH:mm"),
      format(group.end, "dd/MM/yyyy HH:mm"),
      formatDistanceStrict(group.start, group.end).magenta
    ])
  )

  console.log()
  console.log(table.toString())
}

export default sysloggy
