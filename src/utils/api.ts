import * as FP from 'fp-ts/lib/function';
import { INITIAL_COUNTS } from '../stores/const';
import type { Asset, Counts, Download, Downloads, OS, Release } from '../types/api';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';

export const isLinux = (file: string) => /^.*\.(deb|AppImage)$/.test(file);
export const isMac = (file: string) => /^.*\.dmg$/.test(file);
export const isWin = (file: string) => /^.*\.exe$/.test(file);

export const toOS = (file: string): O.Option<OS> => {
	if (isLinux(file)) return O.some('linux');
	if (isMac(file)) return O.some('mac');
	if (isWin(file)) return O.some('win');
	return O.none;
};

export const toCounts = (assets: Array<Pick<Asset, 'download_count' | 'name'>>): Counts =>
	FP.pipe(
		assets,
		A.reduce(INITIAL_COUNTS, (acc, curr) => {
			const { download_count, name } = curr;

			return FP.pipe(
				toOS(name),
				O.map((os) => ({ ...acc, [os]: acc[os] + download_count })),
				O.getOrElse(() => acc)
			);
		})
	);

export const toDownloads = (
	releases: Array<Pick<Release, 'draft' | 'html_url' | 'tag_name' | 'published_at' | 'assets'>>
): Downloads =>
	FP.pipe(
		releases,
		A.reduce([], (acc, curr) => {
			Array<Pick<Release, 'draft' | 'html_url' | 'tag_name' | 'published_at' | 'assets'>>;
			const { draft, html_url, tag_name, published_at, assets } = curr;

			if (draft) return acc;

			const download: Download = {
				version: tag_name,
				date: published_at,
				counts: toCounts(assets),
				releaseUrl: html_url
			};

			return [...acc, download];
		})
	);
