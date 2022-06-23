import * as FP from 'fp-ts/lib/function';
import type { CountsAD, DownloadsAD, Releases, ReleasesAD } from '../types/api';
import * as RxAjax from 'rxjs/ajax';
import * as E from 'fp-ts/lib/Either';
import * as Rx from 'rxjs';
import { releasesIO } from '../types/api';
import * as A from 'fp-ts/lib/Array';
import * as RxOp from 'rxjs/operators';

import type * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import type { Observable } from 'rxjs';
import * as AD from '../utils/async';
import {
	GH_API_URL,
	GH_HEADERS,
	INITIAL_COUNTS,
	INITIAL_DATES,
	INITIAL_TOP_DOWNLOADS
} from './const';
import type {
	DatesAD,
	DownloadsChartData,
	DownloadsChartDataAD,
	DownloadsTableData as DownloadsTableData,
	DownloadsTableDataAD,
	TopDownloadsAD
} from '../types/app';
import { ordDownload } from '../utils/ord';
import { toDownloads } from '../utils/api';

/** State to reload data */
const reloadReleases$$ = new Rx.BehaviorSubject('');
const reloadReleases$ = reloadReleases$$.asObservable();
export const reload = () => reloadReleases$$.next('reload');

export const releasesAD$: Observable<ReleasesAD> = FP.pipe(
	reloadReleases$,
	RxOp.switchMap(() =>
		RxAjax.ajax.getJSON<Releases>(`${GH_API_URL}/releases?per_page=100`, GH_HEADERS)
	),
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

export const downloadsAD$: Rx.Observable<DownloadsAD> = FP.pipe(
	releasesAD$,
	RxOp.map(AD.map(toDownloads)),
	RxOp.shareReplay(1)
);

export const totalCountsAD$: Rx.Observable<CountsAD> = FP.pipe(
	downloadsAD$,
	RxOp.map((downloadsAD) =>
		FP.pipe(
			downloadsAD,
			AD.map(
				A.reduce(INITIAL_COUNTS, (acc, { counts: c }) => ({
					...acc,
					win: acc.win + c.win,
					linux: acc.linux + c.linux,
					mac: acc.mac + c.mac
				}))
			)
		)
	),
	RxOp.startWith(AD.pending)
);

export const totalDownloadsAD$: Rx.Observable<AD.AsyncData<Error, number>> = FP.pipe(
	totalCountsAD$,
	RxOp.map((countsAD) =>
		FP.pipe(
			countsAD,
			AD.map((c) => c.win + c.linux + c.mac)
		)
	),
	RxOp.startWith(AD.pending)
);

export const datesAD$: Rx.Observable<DatesAD> = FP.pipe(
	downloadsAD$,
	RxOp.map(
		AD.map(
			FP.flow(
				A.reduce(INITIAL_DATES, (acc, curr) => {
					const start = acc.start < curr.date ? acc.start : curr.date;
					const end = acc.end > curr.date ? acc.end : curr.date;
					return {
						start,
						end
					};
				})
			)
		)
	),
	RxOp.startWith(AD.pending)
);

export const topDownloadsAD$: Rx.Observable<TopDownloadsAD> = FP.pipe(
	downloadsAD$,
	RxOp.map(
		AD.map(
			FP.flow(
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
		)
	),
	RxOp.startWith(AD.pending)
);

export const latestDownloadsAD$: Rx.Observable<TopDownloadsAD> = FP.pipe(
	downloadsAD$,
	RxOp.map(
		AD.map(
			FP.flow(
				A.reduce(INITIAL_TOP_DOWNLOADS, (acc, curr) => {
					if (acc.date > curr.date) return acc;

					return {
						date: curr.date,
						version: curr.version,
						counts: { ...curr.counts }
					};
				})
			)
		)
	),
	RxOp.startWith(AD.pending)
);

/** Initial data of `downloadsChartData$` */
const initialDownloadChartData: DownloadsChartData = {
	labels: [],
	datasets: []
}; /* empty all data */

export const downloadsChartDataAD$: Rx.Observable<DownloadsChartDataAD> = FP.pipe(
	downloadsAD$,
	RxOp.map(
		AD.map(
			FP.flow(
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
		)
	),
	RxOp.startWith(AD.pending)
);

/** Initial data of `downloadsTableData$` */
const initialDownloadTableData: DownloadsTableData = []; /* empty all data */

export const downloadsTableDataAD$: Rx.Observable<DownloadsTableDataAD> = FP.pipe(
	downloadsAD$,
	RxOp.map(
		AD.map(
			FP.flow(
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
		)
	),
	RxOp.startWith(AD.pending)
);

export const totalReleasesAD$: Rx.Observable<AD.AsyncData<Error, number>> = FP.pipe(
	downloadsAD$,
	RxOp.map(AD.map(FP.flow(A.reduce(0, (acc, _) => acc + 1)))),
	RxOp.startWith(AD.pending)
);
