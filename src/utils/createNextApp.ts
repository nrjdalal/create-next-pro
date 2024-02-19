import confirm from '@inquirer/confirm'

const createNextAppOptions = async () => {
  const noSrcDir = await confirm({
    message: '(Recommended) Continue without `/src` directory?',
  })
  return {
    noSrcDir: noSrcDir ? '--no-src-dir' : '--src-dir',
  }
}

export default createNextAppOptions
