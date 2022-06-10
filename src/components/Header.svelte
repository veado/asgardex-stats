<script lang="ts">
	import logo from '../assets/logo.png';
	import Card from './Card.svelte';
	import CardsContainer from './CardsContainer.svelte';
	import * as AD from '../utils/async';
	import * as FP from 'fp-ts/lib/function';
	import { renderAsyncValue } from '../utils/render';

	export let releases: AD.AsyncData<Error, number>;
	$: releasesTxt = FP.pipe(releases, renderAsyncValue);
	$: releasesLoading = FP.pipe(releases, AD.isPending);
	$: releasesError = FP.pipe(releases, AD.isError);

	export let downloads: AD.AsyncData<Error, number>;
	$: downloadsTxt = FP.pipe(downloads, renderAsyncValue);
	$: downloadsLoading = FP.pipe(downloads, AD.isPending);
	$: downloadsError = FP.pipe(downloads, AD.isError);

	export let pulls: AD.AsyncData<Error, number>;
	$: pullsTxt = FP.pipe(pulls, renderAsyncValue);
	$: pullsLoading = FP.pipe(pulls, AD.isPending);
	$: pullsError = FP.pipe(pulls, AD.isError);

	export let commits: AD.AsyncData<Error, number>;
	$: commitsTxt = FP.pipe(commits, renderAsyncValue);
	$: commitsLoading = FP.pipe(commits, AD.isPending);
	$: commitsError = FP.pipe(commits, AD.isError);
</script>

<header class="bg-gray-100 dark:bg-gray-700 w-full py-6 ">
	<!-- logo -->
	<div class="w-full flex justify-center items-center">
		<img src={logo} class="h-14 w-14 m-2" alt="logo" />
		<div class="flex items-center">
			<h1 class="text-4xl font-bold text-gray-800 mr-2 pr-2 border-r-2 border-gray-700">
				ASGARDEX
			</h1>
			<span class="text-3xl">stats</span>
		</div>
	</div>

	<div class="container mx-auto max-w-6xl my-10 px-6">
		<CardsContainer>
			<Card
				dropshadow
				title="Releases"
				text={releasesTxt}
				loading={releasesLoading}
				error={releasesError}
			/>
			<Card
				dropshadow
				title="Downloads"
				text={downloadsTxt}
				loading={downloadsLoading}
				error={downloadsError}
			/>
			<Card
				dropshadow
				title="Pull requests"
				text={pullsTxt}
				loading={pullsLoading}
				error={pullsError}
			/>
			<Card
				dropshadow
				title="Commits"
				text={commitsTxt}
				loading={commitsLoading}
				error={commitsError}
			/>
		</CardsContainer>
	</div>
</header>
