import conf from "conf"
import { $ } from "execa"

const x = new conf({
  projectName: "create-next-pro",
})

const packageManagerSelect = () => {
  const { useBun, usePnpm, useYarn, useNpm } = x.store

  const selected = [useBun, usePnpm, useYarn, useNpm].filter(Boolean)

  if (!selected.length) {
    console.log("upcoming: add a prompt to select a package manager")
    process.exit(1)
  }

  if (useBun) {
    x.set("manager", "bun")
    x.set("runner", "bun x")
  }

  if (usePnpm) {
    x.set("manager", "pnpm")
    x.set("runner", "pnpm dlx")
  }

  if (useYarn) {
    x.set("manager", "yarn")
    x.set("runner", "yarn dlx")
  }

  if (useNpm) {
    x.set("manager", "npm")
    x.set("runner", "npx")
  }
}

export default packageManagerSelect
