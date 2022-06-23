import * as Rx from 'rxjs';
import * as RxAjax from 'rxjs/ajax';
import * as FP from 'fp-ts/lib/function';
import { GH_API_URL, GH_HEADERS } from './const';
import * as RxOp from 'rxjs/operators';
import * as AD from '../utils/async';
import { parseTotalFromHeaders } from '../utils/gh';

/** State to reload data */
const reload$$ = new Rx.BehaviorSubject('');
const reload$ = reload$$.asObservable();
export const reload = () => reload$$.next('reload');

const URL = `${GH_API_URL}/commits?per_page=1`;

/**
 * Get total no of commits via GH Api
 * @see https://docs.github.com/en/rest/commits/commits#list-commits
 */
export const totalCommitsAD$: Rx.Observable<AD.AsyncData<Error, number>> = FP.pipe(
	reload$,
	RxOp.switchMap(() => RxAjax.ajax.get(URL, GH_HEADERS)),
	RxOp.map(({ responseHeaders }) => parseTotalFromHeaders(responseHeaders)),
	RxOp.map(AD.fromOption(() => Error('Could not parse total commits'))),
	RxOp.catchError((error) =>
		Rx.of(AD.error(Error(`Failed to get contributors from ${URL} ${error}`)))
	),
	RxOp.startWith(AD.pending),
	RxOp.shareReplay(1)
);
