import * as FP from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as S from 'fp-ts/lib/string';

/**
 * Helper to parse total number of something at GH (e.g. of commits or contributors)
 * by parsing link header returned by GH API
 *
 * Idea based on: "The simplest way to get commit count of a GitHub repository through the API"
 * @see https://gist.github.com/0penBrain/7be59a48aba778c955d992aa69e524c5
 */
export const parseTotalFromHeaders = (headers: Record<string, string>): O.Option<number> =>
	FP.pipe(
		O.fromNullable(headers['link'] || headers['Link']),
		O.map((link) =>
			// Parse links from header
			// Based on https://github.com/SamVerschueren/github-parse-link/blob/master/index.js
			FP.pipe(
				link,
				S.split(', '),
				NEA.fromReadonlyNonEmptyArray,
				NEA.reduce({}, (acc, curr) => {
					const match = curr.match('<(.*?)>; rel="(.*?)"');

					if (match && match.length === 3) {
						acc[match[2]] = match[1];
					}

					return acc;
				})
			)
		),
		// get 'last' link
		O.chain((links) => O.fromNullable(links['last'])),
		// Get 'page` param
		O.map((link) => new URL(link).searchParams.get('page')),
		O.chain(O.fromPredicate((v) => !!v /* don't except empty strings */)),
		O.map(parseInt)
	);
