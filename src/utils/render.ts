import * as FP from 'fp-ts/lib/function';
import * as AD from './async';

export const renderAsyncValue = <E, A>(md: AD.AsyncData<E, A>): string =>
	FP.pipe(
		md,
		AD.foldA(
			() => '...',
			(_: E) => 'error',
			(a: A) => a.toString()
		)
	);
