import type * as AD from '../utils/async';
import type { Counts } from './api';

export type Dates = {
	start: Date;
	end: Date;
};

export type DatesAD = AD.AsyncData<Error, Dates>;

export type TopDownloads = {
	version: string;
	date: Date;
	counts: Counts;
};

export type TopDownloadsAD = AD.AsyncData<Error, TopDownloads>;

export type DownloadsChartData = {
	labels: string[];
	datasets: Array<{ name: string; values: number[] }>;
};

export type DownloadsChartDataAD = AD.AsyncData<Error, DownloadsChartData>;

export type DownloadsTableData = Array<{
	version: string;
	date: string;
	total: number;
	win: number;
	mac: number;
	linux: number;
}>;

export type DownloadsTableDataAD = AD.AsyncData<Error, DownloadsTableData>;
