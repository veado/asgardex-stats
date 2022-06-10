<script lang="ts">
	import DownloadsChart from './components/DownloadsChart.svelte';
	import DownloadsTable from './components/DownloadsTable.svelte';
	import Header from './components/Header.svelte';
	import TopDownloads from './components/TopDownloads.svelte';
	import TotalDownloads from './components/TotalDownloads.svelte';

	import {
		downloadsChartDataAD$,
		downloadsTableDataAD$,
		latestDownloadsAD$,
		topDownloadsAD$,
		totalCountsAD$,
		totalReleasesAD$,
		totalDownloadsAD$,
		datesAD$,
		reload as reloadReleases
	} from './stores/releases';

	import { totalCommitsAD$, reload as reloadCommits } from './stores/commits';
	import { totalPullsAD$, reload as releodPulls } from './stores/pulls';
	import Footer from './components/Footer.svelte';
	import * as FP from 'fp-ts/lib/function';
	import * as AD from './utils/async';
	import { renderAsyncValue } from './utils/render';

	$: subheadlineFromTo = FP.pipe(
		$datesAD$,
		AD.map(({ start, end }) => {
			const from = start.toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
			const to = end.toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
			return `${from} - ${to}`;
		}),
		renderAsyncValue
	);
</script>

<main class="flex flex-col">
	<Header
		releases={$totalReleasesAD$}
		downloads={$totalDownloadsAD$}
		pulls={$totalPullsAD$}
		commits={$totalCommitsAD$}
	/>
	>
	<div class="container mx-auto max-w-6xl px-6">
		<h1 class="text-7xl text-center mt-24 text-gray-800 ">Downloads</h1>
		<!-- total downloads -->
		<TotalDownloads
			counts={$totalCountsAD$}
			headline="All releases"
			subheadline={subheadlineFromTo}
		/>
		<!-- top downloads -->
		<TopDownloads downloads={$topDownloadsAD$} headline="Top release" />
		<!-- latest downloads -->
		<TopDownloads downloads={$latestDownloadsAD$} headline="Latest release" />
		<!-- chart -->
		<DownloadsChart data={$downloadsChartDataAD$} subheadline={subheadlineFromTo} />
		<!-- table -->
		<DownloadsTable data={$downloadsTableDataAD$} subheadline={subheadlineFromTo} />
	</div>
	<Footer />
</main>
