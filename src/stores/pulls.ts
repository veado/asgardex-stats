import * as Rx from 'rxjs';
import * as RxAjax from 'rxjs/ajax';
import type { AsyncData } from 'src/types/async';
import * as FP from 'fp-ts/lib/function';
import { GH_API_URL } from './const';
import * as RxOp from 'rxjs/operators';
import * as E from 'fp-ts/lib/Either';
import { parseTotalFromHeaders } from '../utils/gh';

/** State to reload data */
const reload$$ = new Rx.BehaviorSubject('');
const reload$ = reload$$.asObservable();
export const reload = () => reload$$.next('reload');

/**
 * Get total no of PRs via GH Api
 * @see https://docs.github.com/en/rest/pulls/pulls#list-pull-requests
 */
export const totalPullsAD$: Rx.Observable<AsyncData<number>> = FP.pipe(
	reload$,
	RxOp.switchMap(() => RxAjax.ajax.get(`${GH_API_URL}/pulls?per_page=1&state=closed`)),
	RxOp.map(({ responseHeaders }) => parseTotalFromHeaders(responseHeaders)),
	RxOp.map(E.fromOption(() => Error('Could not parse total no of closed PRs'))),
	RxOp.startWith<AsyncData<number>>('loading'),
	RxOp.shareReplay(1)
);
