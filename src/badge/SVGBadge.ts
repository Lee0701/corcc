import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {emoji} from './Emoji';
import {
	pwd,
	mkdirPath,
} from '../util/type/Path';
import {tryCatch} from '../util/TryCatch';
import {colors} from './Color';
import {isNumberOnly} from '../util/string/Check';
const thousands = require('thousands');
const {badgen} = require('badgen');

type s = string;
type n = number;
type b = boolean;
type f = Function;
function getSvg({
	title,
	value,
}: any) {
	const svgString = badgen({
		label: `${title}`, // <Text>
		labelColor: 'ADF', // <Color RGB> or <Color Name> (default: '555')
		status: `${value}`, // <Text>, required
		color: `${colors[title]??''}`,
		style: 'flat', // 'flat' or 'classic' (default: 'classic')
		// icon: 'data:image/svg+xml;base64,...', // Use icon (default: undefined)
		// iconWidth: 13, // Set this if icon is not square (default: 13)
		scale: 1, // Set badge scale (default: 1)
	});
	return svgString;
}

const g = {
	s: getSvg,
};

const saveBadges = (jsonPath: string) => {
	const read = ((f: f, p: s) => {
		return f(p).toString();
	})(fs.readFileSync, jsonPath);
	const json = JSON.parse(read);
	Object.entries(json).forEach(([k, v]) => {
		const P = (b: s, c: s) => {
			return ((a: s, c: n): s => {
				return a.substring(0, c);
			})(b, ((a: s, c: s): n => {
				return a.lastIndexOf(c);
			})(b, c));
		};
		const badge = (() => {
			const file = ((j: s): s => {
				return path.join(pwd, ((p: s, k: s) => {
					const r = (o: s, a: s, b: s): s => {
						return o.replace(a, b);
					};
					return ((p: s, k: s): s => {
						return r(p, '.json', `/${k}.svg`);
					})(((p: s): s => {
						return r(p, 'latest', 'badge');
					})(p), k);
				})(j, k));
			})(jsonPath);
			const e = ((e, n: s) => {
				return e[n];
			})(emoji, k);
			const svg = ((f, p) => {
				return f(p);
			})(g.s, {
				title: `${e}`,
				value: ((a: b, b: s, c: f) => {
					return a ? c(b) : b;
				})(((a) => {
					return isNumberOnly(a);
				})(`${v}`), `${v}`, thousands),
			});
			const directory = ((p: s) => {
				// eslint-disable-next-line new-cap
				return P(p, '/');
			})(file);
			return {
				file, directory, svg,
			};
		})();
		tryCatch({
			func: mkdirPath,
			params: badge.directory,
			catchFunc: (() => { }),
		});
		tryCatch({
			func: execSync,
			params: ((p: s) => {
				`echo '' > ${p}/.gitkeep`;
			})(badge.directory),
			catchFunc: (() => { }),
		});
		fs.writeFileSync(badge.file, badge.svg);
	});
};

export {saveBadges};
