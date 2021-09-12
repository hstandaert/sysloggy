type IOnelineOptions = {
  spaces?: boolean
}

const oneLine = (
  string: string,
  { spaces }: IOnelineOptions = { spaces: true }
) => string.replace(/\s+/g, spaces ? " " : "").trim()

export default oneLine
