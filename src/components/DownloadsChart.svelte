<script lang="ts">
	import './DownloadsChart.css';
	import { INITIAL_DOWNLOADS_CHART_DATA } from '../stores/const';
	import type { DownloadsChartDataAD } from '../types/app';
	import * as AD from '../utils/async';
	import * as FP from 'fp-ts/lib/function';
	import * as O from 'fp-ts/lib/Option';

	import Chart from 'svelte-frappe-charts';

	export let subheadline;
	export let data: DownloadsChartDataAD;

	$: chartData = FP.pipe(
		data,
		AD.toOption,
		O.getOrElse(() => INITIAL_DOWNLOADS_CHART_DATA)
	);

	// data.datasets.length > 0 ? data : INITIAL_DOWNLOADS_CHART_DATA;
</script>

<article class="w-full pt-32">
	<h1 class="text-4xl text-center text-gray-800">Timeline</h1>
	<h2 class="text-xl text-center text-gray-400 italic">{subheadline}</h2>
	<Chart
		data={chartData}
		type="bar"
		barOptions={{ stacked: 1, spaceRatio: 0.2, xAxisMode: 'tick' }}
	/>
</article>
