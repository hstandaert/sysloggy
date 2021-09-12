#!/usr/bin/env node

import { Command } from "commander"
import packageJson from "./package.json"
import options, { OptionValues } from "./src/options"
import sysloggy from "./src/sysloggy"
import parseOption from "./src/util/parseOption"

const program = new Command()

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description)
  .showHelpAfterError()

options.forEach(({ required, ...option }) => {
  const args = parseOption(option)

  if (required) {
    program.requiredOption(...args)
  } else {
    program.option(...args)
  }
})

program.parse()
sysloggy(program.opts<OptionValues>())
