import confirm from "@inquirer/confirm"

const createNextAppOptions = async () => {
  const srcDir = await confirm({
    message: "Recommended: Use `/src` directory?",
  })
  return {
    srcDir: srcDir ? "--src-dir" : "--no-src-dir",
  }
}

export default createNextAppOptions
