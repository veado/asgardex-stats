import * as RxAjax from 'rxjs/ajax';
import * as FP from 'fp-ts/lib/function';
import type { Assets, Counts, Download, Downloads, OS, Releases } from '../types/api';

import * as RxOp from 'rxjs/operators';
import * as E from 'fp-ts/lib/Either';
import * as Rx from 'rxjs';
import { releasesIO } from '../types/api';
import * as A from 'fp-ts/lib/Array';
import type * as Ord from 'fp-ts/lib/Ord';
import type * as Eq from 'fp-ts/lib/Eq';
import * as S from 'fp-ts/lib/string';
import * as D from 'fp-ts/lib/Date';

import * as O from 'fp-ts/lib/Option';

import type * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import type { Observable } from 'rxjs';
import type { Option } from 'fp-ts/lib/Option';
import * as AD from '../utils/async';
import {
	GH_API_URL,
	INITIAL_COUNTS,
	INITIAL_DATES,
	INITIAL_TOP_DOWNLOADS,
	INITIAL_TOTAL_DOWNLOADS
} from './const';
import type {
	Dates,
	DownloadsChartData,
	DownloadsTableData as DownloadsTableData,
	TopDownloads,
	TotalDownloads
} from '../types/app';

/** State to reload data */
const reloadReleases$$ = new Rx.BehaviorSubject('');
const reloadReleases$ = reloadReleases$$.asObservable();
export const reloadData = () => reloadReleases$$.next('reload');

export const releasesAD$: Observable<AD.AsyncData<Error, Releases>> = FP.pipe(
	reloadReleases$,
	RxOp.switchMap(() => RxAjax.ajax.getJSON<Releases>(`${GH_API_URL}/releases`)),
	RxOp.catchError((error) =>
		Rx.of(E.left(Error(`Failed to get data from ${GH_API_URL} ${error}`)))
	),
	RxOp.map(releasesIO.decode),
	RxOp.map((result) =>
		// t.Errors -> Error
		E.mapLeft((_: t.Errors) => {
			return Error(`Failed to load release data ${PathReporter.report(result)}`);
		})(result)
	),
	RxOp.map(AD.fromEither),
	RxOp.startWith(AD.pending),
	RxOp.shareReplay(1)
);

/**
 * Data of Releases w/o any states - just data, which can be 'empty'
 */
const releases$: Observable<Releases | []> = FP.pipe(
	releasesAD$,
	Rx.map(AD.toOption),
	Rx.map(O.getOrElse(() => []))
);

const toCounts = (assets: Assets): Counts =>
	FP.pipe(
		assets,
		A.reduce(INITIAL_COUNTS, (acc, curr) => {
			const { browser_download_url: path, download_count } = curr;

			return FP.pipe(
				toOS(path),
				O.map((os) => ({ ...acc, [os]: download_count })),
				O.getOrElse(() => acc)
			);
		})
	);

const toDownloads = (releases: Releases): Downloads =>
	FP.pipe(
		releases,
		A.reduce([], (acc, curr) => {
			const { draft, tag_name, published_at, assets } = curr;

			if (draft) return acc;

			const download = {
				version: tag_name,
				date: published_at,
				counts: toCounts(assets)
			};

			return [...acc, download];
		})
	);

const isLinux = (path: string) => path.match(/^.*\.(deb|AppImage)$/);
const isMac = (path: string) => path.match(/^.*\.dmg$/);
const isWin = (path: string) => path.match(/^.*\.exe$/);

const toOS = (path: string): Option<OS> => {
	if (isLinux(path)) return O.some('linux');
	if (isMac(path)) return O.some('mac');
	if (isWin(path)) return O.some('win');
	return O.none;
};

export const downloads$: Rx.Observable<Downloads> = FP.pipe(releases$, RxOp.map(toDownloads));

export const totalCounts$: Rx.Observable<Counts> = FP.pipe(
	downloads$,
	RxOp.map((downloads) =>
		FP.pipe(
			downloads,
			A.reduce(INITIAL_COUNTS, (acc, { counts: c }) => ({
				...acc,
				win: acc.win + c.win,
				linux: acc.linux + c.linux,
				mac: acc.mac + c.mac
			}))
		)
	),
	RxOp.startWith(INITIAL_COUNTS)
);

export const totalDownloads$: Rx.Observable<TotalDownloads> = FP.pipe(
	downloads$,
	RxOp.map((downloads) =>
		FP.pipe(
			downloads,
			A.reduce(INITIAL_TOTAL_DOWNLOADS, (acc, curr) => {
				const startDate = acc.startDate < curr.date ? acc.startDate : curr.date;
				const endDate = acc.endDate > curr.date ? acc.endDate : curr.date;
				const ac = acc.counts;
				const cc = curr.counts;
				const counts: Counts = {
					...ac,
					win: ac.win + cc.win,
					linux: ac.linux + cc.linux,
					mac: ac.mac + cc.mac
				};

				return {
					startDate,
					endDate,
					counts
				};
			})
		)
	),
	RxOp.startWith(INITIAL_TOTAL_DOWNLOADS)
);

export const dates$: Rx.Observable<Dates> = FP.pipe(
	downloads$,
	RxOp.map((downloads) =>
		FP.pipe(
			downloads,
			A.reduce(INITIAL_DATES, (acc, curr) => {
				const start = acc.start < curr.date ? acc.start : curr.date;
				const end = acc.end > curr.date ? acc.end : curr.date;

				return {
					start,
					end
				};
			})
		)
	),
	RxOp.startWith(INITIAL_DATES)
);

export const topDownloads$: Rx.Observable<TopDownloads> = FP.pipe(
	downloads$,
	RxOp.map((downloads) =>
		FP.pipe(
			downloads,
			A.reduce(INITIAL_TOP_DOWNLOADS, (acc, curr) => {
				const cc = curr.counts;
				const ccTotal = cc.win + cc.linux + cc.mac;
				const ac = acc.counts;
				const acTotal = ac.win + ac.linux + ac.mac;

				if (acTotal > ccTotal) return acc;

				return {
					date: curr.date,
					version: curr.version,
					counts: { ...cc }
				};
			})
		)
	),
	RxOp.startWith(INITIAL_TOP_DOWNLOADS)
);

export const latestDownloads$: Rx.Observable<TopDownloads> = FP.pipe(
	downloads$,
	RxOp.map((downloads) =>
		FP.pipe(
			downloads,
			A.reduce(INITIAL_TOP_DOWNLOADS, (acc, curr) => {
				if (acc.date > curr.date) return acc;

				return {
					date: curr.date,
					version: curr.version,
					counts: { ...curr.counts }
				};
			})
		)
	),
	RxOp.startWith(INITIAL_TOP_DOWNLOADS)
);

export const eqDownload: Eq.Eq<Download> = {
	// comparing by versions - they are like ids
	equals: (x, y) => S.Eq.equals(x.version, y.version)
};

export const ordDownload: Ord.Ord<Download> = {
	equals: eqDownload.equals,
	// comparing by dates
	compare: (x, y) => D.Ord.compare(x.date, y.date)
};

/** Initial data of `downloadsChartData$` */
const initialDownloadChartData: DownloadsChartData = {
	labels: [],
	datasets: []
}; /* empty all data */

export const downloadsChartData$: Rx.Observable<DownloadsChartData> = FP.pipe(
	downloads$,
	RxOp.map((downloads) =>
		FP.pipe(
			downloads,
			A.sort(ordDownload),
			A.reduce(initialDownloadChartData, (acc, curr) => {
				const labels = [
					...acc.labels,
					`${curr.version} (${curr.date.toLocaleDateString('en-us', {
						year: 'numeric',
						month: 'short',
						day: '2-digit'
					})})`
				];
				const vw = curr.counts.win;
				const vm = curr.counts.mac;
				const vl = curr.counts.linux;

				const datasets =
					acc.datasets.length === 3
						? [
								{ ...acc.datasets[0], values: [...acc.datasets[0].values, vw] },
								{ ...acc.datasets[1], values: [...acc.datasets[1].values, vm] },
								{ ...acc.datasets[2], values: [...acc.datasets[2].values, vl] }
						  ]
						: [
								{ name: 'Win', values: [vw] },
								{ name: 'macOS', values: [vm] },
								{ name: 'Linux', values: [vl] }
						  ];

				return {
					...acc,
					labels,
					datasets
				};
			})
		)
	),
	RxOp.startWith(initialDownloadChartData)
);

/** Initial data of `downloadsTableData$` */
const initialDownloadTableData: DownloadsTableData = []; /* empty all data */

export const downloadsTableData$: Rx.Observable<DownloadsTableData> = FP.pipe(
	downloads$,
	RxOp.map((downloads) =>
		FP.pipe(
			downloads,
			A.sort(ordDownload),
			A.reverse,
			A.reduce(initialDownloadTableData, (acc, curr) => {
				const vw = curr.counts.win;
				const vm = curr.counts.mac;
				const vl = curr.counts.linux;
				const vt = vw + vm + vl;

				return [
					...acc,
					{
						version: curr.version,
						date: curr.date.toString(),
						total: vt,
						win: vw,
						mac: vm,
						linux: vl
					}
				];
			})
		)
	),
	RxOp.startWith(initialDownloadTableData)
);

export const totalReleases$: Rx.Observable<number> = FP.pipe(
	downloads$,
	RxOp.map((downloads) =>
		FP.pipe(
			downloads,
			A.reduce(0, (acc, _) => acc + 1)
		)
	),
	RxOp.startWith(0)
);
