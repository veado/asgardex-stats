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
	import Footer from './components/Footer.svelte';

	$: from = $dates$.start.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
	$: to = $dates$.end.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
</script>

<main class="flex flex-col">
	<Header />
	<div class="container mx-auto max-w-6xl px-6">
		<h1 class="text-7xl text-center mt-24 text-gray-800 ">Downloads</h1>
		<!-- total downloads -->
		<TotalDownloads
			downloads={$totalDownloads$}
			headline="All releases"
			subheadline="{from} - {to}"
		/>
		<!-- top downloads -->
		<TopDownloads downloads={$topDownloads$} headline="Top release" />
		<!-- latest downloads -->
		<TopDownloads downloads={$latestDownloads$} headline="Latest release" />
		<!-- chart -->
		<DownloadsChart data={$downloadsChartData$} />
		<!-- table -->
		<DownloadsTable data={$downloadsTableData$} />
	</div>
	<Footer />
</main>
