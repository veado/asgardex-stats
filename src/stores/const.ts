import type { Counts } from '../types/api';
import type { Dates, DownloadsChartData, TopDownloads } from '../types/app';

export const GH_API_URL = 'https://api.github.com/repos/thorchain/asgardex-electron';

const GH_TOKEN = import.meta.env?.VITE_GH_TOKEN ?? '';

export const GH_HEADERS = GH_TOKEN
	? {
			authorization: `token ${GH_TOKEN}`
	  }
	: undefined;

// Breakpoints based on Bootstrap
// https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints
export const BREAKPOINTS = {
	// Small devices (landscape phones, 576px and up)
	small: 576,
	// Medium devices (tablets, 768px and up)
	medium: 768,
	// Large devices (desktops, 992px and up)
	large: 992,
	// Extra large devices (large desktops, 1200px and up)
	xlarge: 1200
};

export const INITIAL_COUNTS: Counts = {
	win: 0,
	linux: 0,
	mac: 0
};

export const INITIAL_TOP_DOWNLOADS: TopDownloads = {
	version: '',
	date: new Date('2020-01-01T00:00:00'), // anytime before first release,
	counts: INITIAL_COUNTS
};

export const INITIAL_DOWNLOADS_CHART_DATA: DownloadsChartData = {
	labels: [''],
	datasets: [
		{ name: '', values: [0] },
		{ name: '', values: [0] },
		{ name: '', values: [0] }
	]
};

export const INITIAL_DATES: Dates = {
	start: new Date('2022-06-09T00:00:00'), // anytime in the "middle" of previous releases
	end: new Date('2020-01-01T00:00:00') // anytime before first release
};
