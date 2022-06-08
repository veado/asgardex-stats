import type { Counts } from './api';

export type TotalDownloads = {
	startDate: Date;
	endDate: Date;
	counts: Counts;
};

export type Dates = {
	start: Date;
	end: Date;
};

export type TopDownloads = {
	version: string;
	date: Date;
	counts: Counts;
};

export type DownloadsChartData = {
	labels: string[];
	datasets: Array<{ name: string; values: number[] }>;
};

export type DownloadsTableData = Array<{
	version: string;
	date: string;
	total: number;
	win: number;
	mac: number;
	linux: number;
}>;
