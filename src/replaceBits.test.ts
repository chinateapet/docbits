import { readFile as _readFile } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'

import mkdirp from 'mkdirp'

import pkg from '../package.json'

import { replaceBits } from './replaceBits'

const readFile = promisify(_readFile)

describe(replaceBits.name, () => {
	const fixturesPath = 'src/__fixtures__'
	const outputDir = join(tmpdir(), pkg.name)

	mkdirp.sync(outputDir)

	describe('nested bits', () => {
		beforeAll(() =>
			replaceBits({
				outputDir,
				root: `${fixturesPath}/nested`,
			}),
		)

		test('home', async () => {
			const buffer = await readFile(`${outputDir}/home.md`)

			expect(buffer.toString()).toMatch('root table of contents')
		})

		test('project-x', async () => {
			const buffer = await readFile(`${outputDir}/project-x/home.md`)

			expect(buffer.toString()).toMatch('table of contents for project-x')
		})
	})

	it("throws if bit doesn't exist", () => {
		return expect(
			replaceBits({
				outputDir,
				root: `${fixturesPath}/missing-bit`,
			}),
		).rejects.toThrow('bit ${does-not-exist} not found relative to')
	})
})
