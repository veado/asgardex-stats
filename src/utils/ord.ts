import type * as Ord from 'fp-ts/lib/Ord';
import * as D from 'fp-ts/lib/Date';
import { eqDownload } from './eq';
import type { Download } from '../types/api';

export const ordDownload: Ord.Ord<Download> = {
	equals: eqDownload.equals,
	// comparing by dates
	compare: (x, y) => D.Ord.compare(x.date, y.date)
};
