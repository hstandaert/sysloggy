import { Option } from "./types/commander"

const options = (<T>(o: readonly Option<T>[]) => o)([
  {
    name: "last",
    valueName: "period",
    description: "Period of time to go back. Defaults to 1 day",
    defaultValue: "1d"
  }
] as const)

export type OptionValues = Record<typeof options[number]["name"], string>

export default options
