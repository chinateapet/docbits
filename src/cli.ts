import { red } from 'chalk'

// @ts-ignore when building
import pkg from '../package.json'

import {
	replaceBits,
	DefaultOptions,
	ReplaceOptions,
	WriteOptions,
	writeResult,
} from './replaceBits'

export async function cli(args = process.argv.slice(2)) {
	const { help, version }: { help?: string; version?: string } = {
		...consumeOptionArgument('help', { short: 'h' }),
		...consumeOptionArgument('version', { short: 'v' }),
	}

	function consumeOptionArgument(
		name: string,
		{ short }: { short?: string },
	) {
		let i = args.indexOf(`--${name}`)
		if (i === -1 && short) {
			i = args.indexOf(`-${short}`)
		}
		return i !== -1 ? { [name]: args.splice(i, 2)[1] ?? true } : {}
	}

	if (help) {
		showHelp()
		return
	}

	if (version) {
		console.log(`${pkg.name}@${pkg.version}`)
		return
	}

	function showHelp() {
		console.log(pkg.description)
		console.log()
		console.log('Usage:')
		console.log(`  ${pkg.name} [options]`)
		console.log()
		console.log('Options:')
		console.log(`  -h, --help`)
		console.log(`  -v, --version`)
		/* prettier-ignore */
		console.log(`  -b, --bitsDirName  default: "${DefaultOptions.BitsDirName}"`)
		/* prettier-ignore */
		console.log(`  -r, --root         default: "${DefaultOptions.Root}"`)
		/* prettier-ignore */
		console.log(`  -o, --outputDir    default: "${DefaultOptions.OutputDir}"`)
	}

	const replaceOptions = ({
		...consumeOptionArgument('bitsDirName', { short: 'b' }),
		...consumeOptionArgument('root', { short: 'r' }),
	} as unknown) as ReplaceOptions

	const writeOptions = ({
		...consumeOptionArgument('outputDir', { short: 'o' }),
	} as unknown) as WriteOptions

	if (args.length) {
		bail('too many arguments')
		return
	}

	function bail(message: string) {
		console.error(red(message))
		console.log()
		showHelp()
	}

	console.log(JSON.stringify(replaceOptions), JSON.stringify(writeOptions))

	return writeResult(replaceBits(replaceOptions), writeOptions)
}
