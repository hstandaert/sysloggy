import shell, { ExecException } from "child_process"
import "colors"
import ora from "ora"
import { Log } from "../types/system"

const parseLog = (input: string): Log => {
  return {
    date: new Date(input.substr(0, 31)),
    active: !input.includes("inactive")
  }
}

const getLogs = async (period: string): Promise<Log[]> => {
  const spinner = ora(`Retrieving logs for last ${period.cyan}`).start()

  return await new Promise((resolve, reject) => {
    shell.exec(
      `log show --style syslog --predicate 'process == "loginwindow"' --debug --info --last ${period} | grep -E "going inactive, create activity semaphore|releasing the activity semaphore"`,
      (error: ExecException | null, stdout: string) => {
        if (error) {
          spinner.fail()
          reject(error)
          return
        }

        const logs = stdout
          .split("\n")
          .filter(line => line !== "")
          .map(parseLog)
        spinner.succeed()
        resolve(logs)
      }
    )
  })
}

export default getLogs
