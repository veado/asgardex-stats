<script lang="ts">
	import 'gridjs/dist/theme/mermaid.css';
	import Grid from 'gridjs-svelte';
	import type { DownloadsTableData } from '../types/app';
	import { BREAKPOINTS } from '../stores/const';
	export let data: DownloadsTableData = [];

	let w = 0; // bind clientWidth
	$: hiddenMedium = w < BREAKPOINTS.medium;
	$: hiddenSmall = w < BREAKPOINTS.small;
</script>

<article class="w-full pt-32" bind:clientWidth={w}>
	<h1 class="text-4xl text-center text-gray-800">Details</h1>
	<Grid
		{data}
		sort
		search
		columns={[
			{ id: 'version', name: 'Version' },
			{
				id: 'date',
				name: 'Date',
				// Hidden Columns
				// https://gridjs.io/docs/examples/hidden-columns
				hidden: hiddenMedium,
				// Column specific sort config
				// https://gridjs.io/docs/config/sort/#column-specific-sort-config
				sort: {
					compare: (_a, _b) => {
						// for type safety we have to check if a|b is really a string
						if (typeof _a !== 'string' || typeof _b !== 'string') return 0;
						const a = new Date(_a);
						const b = new Date(_b);
						if (a > b) {
							return 1;
						} else if (b > a) {
							return -1;
						} else {
							return 0;
						}
					}
				},
				// Cell formatting
				// https://gridjs.io/docs/examples/cell-formatting/
				formatter: (cell) => {
					return typeof cell === 'string'
						? `${new Date(cell).toLocaleDateString('en-us', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
						  })}`
						: cell;
				}
			},
			{ id: 'total', name: 'Total' },
			{ id: 'win', name: 'Windows', hidden: hiddenSmall },
			{ id: 'mac', name: 'macOS', hidden: hiddenSmall },
			{ id: 'linux', name: 'Linux', hidden: hiddenSmall }
		]}
	/>
</article>
