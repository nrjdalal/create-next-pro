import fs, { PathLike } from "fs"
import packageManagerSelect from "@/lib/packageManagerSelect.js"
import { program } from "commander"
import conf from "conf"

const x = new conf({
  projectName: "create-next-pro",
})

// clear the config if it exists
x.clear()

type Opts = {
  srcDir?: boolean
  useBun?: boolean
  usePnpm?: boolean
  useYarn?: boolean
  useNpm?: boolean
}

program
  .name("create-next-pro")
  .argument("<directory>")
  .option("--src-dir", "Initialize inside a `src/` directory")
  .option("--use-bun", "Explicitly tell the CLI to bootstrap the app using bun")
  .option(
    "--use-pnpm",
    "Explicitly tell the CLI to bootstrap the app using pnpm",
  )
  .option(
    "--use-yarn",
    "Explicitly tell the CLI to bootstrap the app using yarn",
  )
  .option("--use-npm", "Explicitly tell the CLI to bootstrap the app using npm")
  .usage("<directory> [options]")
  .parse(process.argv)

const opts: Opts = program.opts()

// useBun, usePnpm, useYarn and useNpm are mutually exclusive
if (
  [opts.useBun, opts.usePnpm, opts.useYarn, opts.useNpm].filter(Boolean)
    .length > 1
) {
  console.log("error: use only one package manager")
  process.exit(1)
}

// update the config with existing options
x.set(opts)

// current working directory + cli directory
x.set("directory", process.cwd() + "/" + program.args[0])
// create the directory if it doesn't exist
!fs.existsSync(x.get("directory") as PathLike) &&
  fs.mkdirSync(x.get("directory") as PathLike, { recursive: true })
// exit if the directory is not empty
if (fs.readdirSync(x.get("directory") as PathLike).length) {
  console.log("error: directory is not empty")
  process.exit(1)
}

try {
  packageManagerSelect()
  // createNextApp()
} catch {}
