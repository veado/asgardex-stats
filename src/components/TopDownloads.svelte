<script lang="ts">
	import type { TopDownloadsAD } from '../types/app';
	import * as FP from 'fp-ts/lib/function';
	import * as AD from '../utils/async';

	import Downloads from './Downloads.svelte';
	import { renderAsyncValue } from '../utils/render';

	export let headline = '';

	export let downloads: TopDownloadsAD;

	$: subheadline = FP.pipe(
		downloads,
		AD.map(
			({ version, date }) =>
				`${version} - ${date.toLocaleDateString('en-us', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}`
		),
		renderAsyncValue
	);

	$: counts = FP.pipe(
		downloads,
		AD.map(({ counts }) => counts)
	);
</script>

<article class="w-full pt-32">
	<h1 class="text-4xl text-center text-gray-800">{headline}</h1>
	<h2 class="text-xl text-center text-gray-400 italic">{subheadline}</h2>
	<Downloads {counts} />
</article>
