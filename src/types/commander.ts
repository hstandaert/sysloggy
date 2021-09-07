export type Option<K = string> = {
  name: K
  valueName?: string
  description: string
  defaultValue?: string | boolean
  required?: boolean
}
