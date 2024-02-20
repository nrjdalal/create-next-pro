import { $ } from "execa"

const getPackageManagers = async () => {
  const packageManagers = ["bun", "pnpm"]
  const availablePackageManagers = []

  for (const packageManager of packageManagers) {
    try {
      await $`which ${packageManager}`
      availablePackageManagers.push({
        name: packageManager,
        value: {
          manager: packageManager,
          runner: packageManager === "bun" ? "bunx" : "pnpx",
        },
      })
    } catch {}
  }

  return availablePackageManagers
}

export default getPackageManagers
