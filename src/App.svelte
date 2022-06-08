<script lang="ts">
	import DownloadsChart from './components/DownloadsChart.svelte';
	import DownloadsTable from './components/DownloadsTable.svelte';
	import Header from './components/Header.svelte';
	import TopDownloads from './components/TopDownloads.svelte';
	import TotalDownloads from './components/TotalDownloads.svelte';

	import {
		downloadsChartData$,
		downloadsGridData$,
		latestDownloads$,
		topDownloads$,
		totalDownloads$,
		totalReleases$,
		dates$,
		reloadData
	} from './stores/releases';

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
	<!-- header -->

	<Header />
	<!-- <p>releasesAD$ {JSON.stringify($releasesAD$)}</p> -->
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
	<DownloadsTable data={$downloadsGridData$} />
</main>
