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
 * Get total no of commits via GH Api
 * @see https://docs.github.com/en/rest/commits/commits#list-commits
 */
export const totalCommitsAD$: Rx.Observable<AsyncData<number>> = FP.pipe(
	reload$,
	RxOp.switchMap(() => RxAjax.ajax.get(`${GH_API_URL}/commits?per_page=1`)),
	RxOp.map(({ responseHeaders }) => parseTotalFromHeaders(responseHeaders)),
	RxOp.map(E.fromOption(() => Error('Could not parse total commits'))),
	RxOp.startWith<AsyncData<number>>('loading'),
	RxOp.shareReplay(1)
);
