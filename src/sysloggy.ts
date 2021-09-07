import { OptionValues } from "./options"
import getLogs from "./util/getLogs"

const sysloggy = async (options: OptionValues) => {
  const logs = await getLogs(options.last)
  console.log(logs) // @TODO: remove this console.log
}

export default sysloggy
