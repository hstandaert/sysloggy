#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "./package.json";

const program = new Command();

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description)
  .showHelpAfterError()
  .parse();

if (process.argv.length < 3) {
  program.help();
}
