import { Option } from "../types/commander"

type ParsedOptionTuple = [
  flags: string,
  description?: string,
  defaultValue?: string | boolean
]

const parseOption = ({
  name,
  valueName,
  description,
  defaultValue
}: Option): ParsedOptionTuple => {
  return [
    `-${name.charAt(0).toUpperCase()}, --${name}${
      valueName && ` <${valueName}>`
    }`,
    description,
    defaultValue
  ]
}

export default parseOption
