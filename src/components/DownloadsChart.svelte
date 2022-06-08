<script lang="ts">
	import './DownloadsChart.css';
	import { INITIAL_DOWNLOADS_CHART_DATA } from '../stores/const';
	import type { DownloadsChartData } from '../types/app';
	import Chart from 'svelte-frappe-charts';

	export let data: DownloadsChartData = INITIAL_DOWNLOADS_CHART_DATA;

	$: chartData = data.datasets.length > 0 ? data : INITIAL_DOWNLOADS_CHART_DATA;
</script>

<article>
	<h1>All downloads</h1>
	<Chart
		data={chartData}
		type="bar"
		barOptions={{ stacked: 1, spaceRatio: 0.2, xAxisMode: 'tick' }}
	/>
</article>
