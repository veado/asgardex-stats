import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';

export type AsyncData<T> = 'loading' | E.Either<Error, T>;

export const isLoading = <T>(ad: AsyncData<T>): boolean => ad === 'loading';
export const isError = <T>(ad: AsyncData<T>): boolean => ad !== 'loading' && E.isLeft(ad);

export const toOptionAD = <T>(ad: AsyncData<T>): O.Option<T> => {
	if (ad === 'loading') return O.none;
	return O.fromEither(ad);
};
