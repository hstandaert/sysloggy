import Table from "cli-table"
import "colors"
import { format, formatDuration, parse } from "date-fns"
import emoji from "node-emoji"
import { exit } from "process"
import { OptionValues } from "./options"
import { DATE_FORMATS } from "./types/datetime"
import { Log, LogGroup } from "./types/system"
import getLogs from "./util/getLogs"
import isDateValid from "./util/isDateValid"
import msToTime from "./util/msToTime"

const groupLogs = (logs: Log[], isToday: boolean) => {
  const groups: LogGroup[] = []

  let index = 0
  while (index < logs.length) {
    const startLog = logs[index]
    const endLog = logs[index + 1]

    if (!startLog.active) {
      logs.shift()
      continue
    }

    if (endLog || isToday) {
      groups.push({
        start: startLog.date,
        end: endLog ? endLog.date : new Date()
      })
    }

    index += 2
  }

  return groups
}

const sysloggy = async (options: OptionValues) => {
  const logDate = parse(options.date, DATE_FORMATS.DATE, new Date())
  if (!isDateValid(logDate)) {
    console.log()
    console.log(
      `${emoji.get("x")} Woops, looks like ${
        options.date.red
      } isn't a valid date. Make sure you format it like '${DATE_FORMATS.DATE}'`
    )
    exit(1)
  }

  const logs = await getLogs(logDate)
  const groups: LogGroup[] = groupLogs(
    logs,
    logDate.toDateString() === new Date().toDateString()
  )

  const table = new Table({ head: ["Start".cyan, "End".cyan, "Duration".cyan] })
  let total = 0
  table.push(
    ...groups.map(({ start, end }) => {
      const distance = Math.abs(start.getTime() - end.getTime())
      total += distance

      return [
        format(start, DATE_FORMATS.DATETIME),
        format(end, DATE_FORMATS.DATETIME),
        formatDuration(msToTime(distance)).magenta
      ]
    })
  )

  console.log()
  console.log(table.toString())

  const totalTime = msToTime(total)
  console.log()
  console.log(
    `${emoji.get("mantelpiece_clock")}  You were active for ${
      formatDuration(totalTime).magenta
    } in total`
  )

  const diffFromWorkingHours = Math.abs(28800000 - total)
  if (totalTime.hours > 8) {
    console.log(
      `${emoji.get("white_check_mark")} That means you've worked ${
        formatDuration(msToTime(diffFromWorkingHours)).green
      } more than you had to!`
    )
  } else {
    console.log(
      `${emoji.get("x")} Unfortunately, you still need to work ${
        formatDuration(msToTime(diffFromWorkingHours)).red
      } to complete your working day`
    )
  }
}

export default sysloggy
