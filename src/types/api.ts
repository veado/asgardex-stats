/**
 * API types of https://api.github.com/repos/thorchain/asgardex-electron/releases
 */

import * as t from 'io-ts';
import * as FP from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

// `dateIO` based on `DateFromISOString`
// @see https://github.com/gcanti/io-ts-types/blob/master/src/DateFromISOString.ts
export const dateIO = new t.Type<Date, string, unknown>(
	'DateIO',
	(u): u is Date => u instanceof Date,
	(u, c) =>
		FP.pipe(
			t.string.validate(u, c),
			E.chain((s) => {
				const d = new Date(s);
				return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
			})
		),
	(a) => a.toISOString()
);

export const assetIO = t.type({
	name: t.string,
	browser_download_url: t.string,
	download_count: t.number,
	created_at: dateIO
});

export type Asset = t.TypeOf<typeof assetIO>;

export const assetsIO = t.array(assetIO);
export type Assets = t.TypeOf<typeof assetsIO>;

export const releaseIO = t.type({
	html_url: t.string,
	tag_name: t.string,
	draft: t.boolean,
	published_at: dateIO,
	assets: assetsIO
});

export const releasesIO = t.array(releaseIO);

export type Releases = t.TypeOf<typeof releasesIO>;

export type OS = 'mac' | 'linux' | 'win';
export type Counts = Record<OS, number>;

export type Download = {
	version: string;
	date: Date;
	releaseUrl: string;
	counts: Counts;
};

export type Downloads = Download[];
