import shell, { ExecException } from "child_process"
import "colors"
import { format } from "date-fns"
import ora from "ora"
import { exit } from "process"
import { DATE_FORMATS } from "../types/datetime"
import { Log } from "../types/system"

const parseLog = (input: string): Log => {
  return {
    date: new Date(input.substr(0, 31)),
    active: !input.includes("inactive")
  }
}

const getLogs = async (date: Date): Promise<Log[]> => {
  console.log()
  const spinner = ora(
    `Retrieving logs for ${format(date, DATE_FORMATS.DATE).cyan}`
  ).start()

  const formattedDate = format(date, "yyyy-MM-dd")

  return await new Promise((resolve, reject) => {
    try {
      shell.exec(
        `log show --style syslog --predicate 'process == "loginwindow"' --debug --info --start "${formattedDate} 00:00:00" --end "${formattedDate} 23:59:59" | grep -E "going inactive, create activity semaphore|releasing the activity semaphore"`,
        (error: ExecException | null, stdout: string) => {
          const logs = stdout
            .split("\n")
            .filter(line => line !== "")
            .map(parseLog)

          if (logs.length > 0) spinner.succeed()
          else {
            spinner.info(
              `Looks like we couldn't find any logs for ${
                format(date, DATE_FORMATS.DATE).cyan
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
