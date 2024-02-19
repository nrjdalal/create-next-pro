#!/usr/bin/env node
import select from "@inquirer/select"
import chalk from "chalk"
import { $ } from "execa"
import ora from "ora"
import createNextAppOptions from "./utils/createNextApp.js"
import getPackageManagers from "./utils/packageManagers.js"

// 0. initializing variables
let opts
const spinner = ora()

// 1. select a package manager
const { manager, runner }: any = await select({
  message: "Select a package manager",
  choices: await getPackageManagers(),
})

// 2. create a Next.js app
opts = await createNextAppOptions()
spinner.start("Creating a Next.js app")
await $`${runner} create-next-app . --ts --eslint --tailwind --app ${opts.noSrcDir} --import-alias "@/*"`
spinner.succeed(chalk.green("Successfully created a Next.js app"))

// 3. install prettier and plugins
spinner.start("Installing prettier and plugins")
await $`${manager} add -D prettier @ianvs/prettier-plugin-sort-imports prettier-plugin-tailwindcss`
spinner.succeed(chalk.green("Successfully installed prettier and plugins"))
