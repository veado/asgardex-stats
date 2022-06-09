<script lang="ts">
	import DownloadsChart from './components/DownloadsChart.svelte';
	import DownloadsTable from './components/DownloadsTable.svelte';
	import Header from './components/Header.svelte';
	import TopDownloads from './components/TopDownloads.svelte';
	import TotalDownloads from './components/TotalDownloads.svelte';

	import {
		downloadsChartData$,
		downloadsTableData$,
		latestDownloads$,
		topDownloads$,
		totalDownloads$,
		totalReleases$,
		dates$,
		reloadData
	} from './stores/releases';

	import { totalCommitsAD$ } from './stores/commits';
	import { totalContributorsAD$ } from './stores/contributors';
	import { totalPullsAD$ } from './stores/pulls';

	$: from = $dates$.start.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	$: to = $dates$.end.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
</script>

<main class="flex flex-col h-screen">
	<Header />

	<div>commits {JSON.stringify($totalCommitsAD$)}</div>
	<div>contributors {JSON.stringify($totalContributorsAD$)}</div>
	<div>pulls {JSON.stringify($totalPullsAD$)}</div>

	<button class="btn btn-lg" on:click={() => reloadData()}>RELOAD</button>
	<h1>{$totalReleases$} Releases</h1>
	<h2>From {from} to {to}</h2>
	<!-- total downloads -->
	<TotalDownloads downloads={$totalDownloads$} />
	<!-- top downloads -->
	<TopDownloads downloads={$topDownloads$} headline="Top downloads" />
	<!-- latest downloads -->
	<TopDownloads downloads={$latestDownloads$} headline="Latest downloads" />
	<!-- chart -->
	<DownloadsChart data={$downloadsChartData$} />
	<!-- table -->
	<DownloadsTable data={$downloadsTableData$} />
</main>
