import { format } from "date-fns"
import { Option } from "./types/commander"
import { DateFormats } from "./types/datetime"

const options = (<T>(o: readonly Option<T>[]) => o)([
  {
    name: "date",
    valueName: "dd/mm/YYYY",
    description: "Date to show logs for. Defaults to today",
    defaultValue: format(new Date(), DateFormats.DATE)
  }
] as const)

export type OptionValues = Record<typeof options[number]["name"], string>

export default options
