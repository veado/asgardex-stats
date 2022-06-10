import type * as Eq from 'fp-ts/lib/Eq';
import * as S from 'fp-ts/lib/string';
import type { Download } from '../types/api';

export const eqDownload: Eq.Eq<Download> = {
	// comparing by versions - they are like ids
	equals: (x, y) => S.Eq.equals(x.version, y.version)
};
