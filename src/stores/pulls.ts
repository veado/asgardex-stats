import * as Rx from 'rxjs';
import * as RxAjax from 'rxjs/ajax';
import * as AD from '../utils/async';
import * as FP from 'fp-ts/lib/function';
import { GH_API_URL, GH_HEADERS } from './const';
import * as RxOp from 'rxjs/operators';
import { parseTotalFromHeaders } from '../utils/gh';

/** State to reload data */
const reload$$ = new Rx.BehaviorSubject('');
const reload$ = reload$$.asObservable();
export const reload = () => reload$$.next('reload');

const URL = `${GH_API_URL}/pulls?per_page=1&state=closed`;

/**
 * Get total no of PRs via GH Api
 * @see https://docs.github.com/en/rest/pulls/pulls#list-pull-requests
 */
export const totalPullsAD$: Rx.Observable<AD.AsyncData<Error, number>> = FP.pipe(
	reload$,
	RxOp.switchMap(() => RxAjax.ajax.get(URL, GH_HEADERS)),
	RxOp.map(({ responseHeaders }) => parseTotalFromHeaders(responseHeaders)),
	RxOp.map(AD.fromOption(() => Error('Could not parse total no of closed PRs'))),
	RxOp.catchError((error) =>
		Rx.of(AD.error(Error(`Failed to get pull data from ${URL} ${error}`)))
	),
	RxOp.startWith(AD.pending),
	RxOp.shareReplay(1)
);
