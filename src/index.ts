import select from "@inquirer/select"
import chalk from "chalk"
import { $ } from "execa"
import ora from "ora"
import createNextAppOptions from "./utils/createNextApp"
import getPackageManagers from "./utils/packageManagers"

let opts
let spinner = ora()

// 1. select a package manager
const { manager, runner } = await select({
  message: "Select a package manager",
  choices: await getPackageManagers(),
})

// 2. create a Next.js app
opts = await createNextAppOptions()
spinner.start("Creating a Next.js app")
try {
  spinner.succeed(chalk.green("Successfully created a Next.js app"))
  await $`rm -rf test`
  await $`${runner} create-next-app test --ts --eslint --tailwind ${opts.noSrcDir} --app --import-alias "@/*"`
} catch {
  spinner.fail(chalk.red("Failed to create a Next.js app"))
}
