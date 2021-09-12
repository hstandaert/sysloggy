import shell, { ExecException } from "child_process"
import "colors"
import { format } from "date-fns"
import ora from "ora"
import { exit } from "process"
import { DateFormats } from "../types/datetime"
import { Log } from "../types/system"
import oneLine from "./oneLine"

const parseLog = (input: string): Log => ({
  date: new Date(input.substr(0, 31)),
  active: input.includes("isActive:1")
})

const getLogs = async (date: Date): Promise<Log[]> => {
  console.log()
  const spinner = ora(
    `Retrieving logs for ${format(date, DateFormats.DATE).cyan}`
  ).start()

  const formattedDate = format(date, "yyyy-MM-dd")

  return new Promise((resolve, reject) => {
    try {
      shell.exec(
        oneLine(`
          log show
            --style syslog
            --predicate
              'process == "loginwindow" &&
              (eventMessage CONTAINS[c] "LWScreenLock UserActivityChanged" && eventMessage CONTAINS[c] "isActive:") ||
              (eventMessage CONTAINS[c] "finished in loginwindow, this is a shutdown or restart")'
            --debug
            --info
            --start "${formattedDate} 00:00:00"
            --end "${formattedDate} 23:59:59"
        `),
        (error: ExecException | null, stdout: string) => {
          const logs = stdout
            .split("\n")
            .filter(line => line !== "")
            .map(parseLog)

          if (logs.length > 0) spinner.succeed()
          else {
            spinner.info(
              `Looks like we couldn't find any logs for ${
                format(date, DateFormats.DATE).cyan
              }. Try a more recent date.`
            )
            exit(0)
          }

          resolve(logs)
        }
      )
    } catch (error) {
      spinner.fail()
      reject(error)
    }
  })
}

export default getLogs
