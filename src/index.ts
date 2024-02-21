#!/usr/bin/env node
import fs from "fs/promises"
import select from "@inquirer/select"
import chalk from "chalk"
import { $ } from "execa"
import ora from "ora"
import createNextAppOptions from "./utils/createNextApp.js"
import getPackageManagers from "./utils/packageManagers.js"

// ~ initializing variables
let draft: any, opts: any, src: string
const spinner = ora()

// ~ select a package manager
const { manager, runner }: any = await select({
  message: "Select a package manager",
  choices: await getPackageManagers(),
})

// ~ create a Next.js app
opts = await createNextAppOptions()
opts.noSrcDir !== "--no-src-dir" ? (src = "src/") : (src = "")
spinner.start("Creating a Next.js app")
await $`${runner} create-next-app . --ts --eslint --tailwind --app ${opts.noSrcDir} --import-alias @/*`
spinner.succeed(chalk.green("Successfully created app"))

// ~ add prettier to the app
spinner.start("Adding prettier")
await $`${manager} add -D prettier @ianvs/prettier-plugin-sort-imports prettier-plugin-tailwindcss`
spinner.succeed(chalk.green("Successfully added prettier"))

// ~ configure prettier
spinner.start("Configuring prettier")
draft = `/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
}
`
await fs.writeFile("prettier.config.js", draft, "utf-8")
spinner.succeed(chalk.green("Successfully configured prettier"))

// ~ add shadcn-ui to the app
spinner.start("Adding shadcn-ui to the app")
await $`${runner} shadcn-ui init -d`
spinner.succeed(chalk.green("Successfully added shadcn-ui"))

// ~ add next-themes to the app
spinner.start("Adding next-themes to the app")
await $`${manager} add next-themes`
spinner.succeed(chalk.green("Successfully added next-themes"))

// ~ configure next-themes
spinner.start("Configuring next-themes")
draft = `"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import * as React from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
`
await fs.mkdir(src + "components/ui", { recursive: true })
await fs.writeFile(src + "components/ui/theme-provider.tsx", draft, "utf-8")

// ~ add drizzle to the app
spinner.start("Adding drizzle to the app")
await $`${manager} add drizzle-orm postgres`
await $`${manager} add -D drizzle-kit`
spinner.succeed(chalk.green("Successfully added drizzle"))

// ~ configure drizzle
spinner.start("Configuring drizzle")
draft = `import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const queryClient = postgres("postgres://postgres:adminadmin@0.0.0.0:5432/db")
export const db = drizzle(queryClient)
`
await fs.mkdir(src + "lib/db/drizzle", { recursive: true })
await fs.writeFile(src + "lib/db/drizzle/index.ts", draft, "utf-8")
spinner.succeed(chalk.green("Successfully configured drizzle"))

// ~ cleanup
spinner.start("Cleaning up")
try {
  await fs.rm(".git", { recursive: true, force: true })
  await $`git init`
  await $`git add .`
  await $`git commit -m "Init via ${runner} create-next-pro"`
} catch {}
spinner.succeed(chalk.green("Successfully cleaned up"))
