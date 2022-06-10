import * as Rx from 'rxjs';
import * as RxAjax from 'rxjs/ajax';
import * as AD from '../utils/async';
import * as FP from 'fp-ts/lib/function';
import { GH_API_URL } from './const';
import * as RxOp from 'rxjs/operators';
import { parseTotalFromHeaders } from '../utils/gh';

/** State to reload data */
const reload$$ = new Rx.BehaviorSubject('');
const reload$ = reload$$.asObservable();
export const reload = () => reload$$.next('reload');

const URL = `${GH_API_URL}/contributors?per_page=1`;

/**
 * Get total no of contributors via GH Api
 */
export const totalContributorsAD$: Rx.Observable<AD.AsyncData<Error, number>> = FP.pipe(
	reload$,
	RxOp.switchMap(() => RxAjax.ajax.get(URL)),
	RxOp.map(({ responseHeaders }) => parseTotalFromHeaders(responseHeaders)),
	RxOp.map(AD.fromOption(() => Error('Could not parse total no. of contributors'))),
	RxOp.catchError((error) =>
		Rx.of(AD.error(Error(`Failed to get contributors from ${URL} ${error}`)))
	),
	RxOp.startWith(AD.pending),
	RxOp.shareReplay(1)
);
