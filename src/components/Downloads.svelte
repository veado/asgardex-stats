<script lang="ts">
	import * as AD from '../utils/async';
	import * as FP from 'fp-ts/lib/function';

	import type { CountsAD } from '../types/api';
	import Card from './Card.svelte';
	import CardsContainer from './CardsContainer.svelte';
	import { renderAsyncValue } from '../utils/render';

	export let counts: CountsAD;

	$: total = FP.pipe(
		counts,
		AD.map((c) => c.win + c.linux + c.mac),
		renderAsyncValue
	);

	$: mac = FP.pipe(
		counts,
		AD.map((c) => c.mac),
		renderAsyncValue
	);

	$: win = FP.pipe(
		counts,
		AD.map((c) => c.win),
		renderAsyncValue
	);

	$: linux = FP.pipe(
		counts,
		AD.map((c) => c.linux),
		renderAsyncValue
	);

	$: loading = FP.pipe(counts, AD.isPending);
	$: error = FP.pipe(counts, AD.isError);
</script>

<CardsContainer>
	<Card border title="Total" text={total} {loading} {error} />
	<Card border title="Windows" text={win} {loading} {error} />
	<Card border title="macOS" text={mac} {loading} {error} />
	<Card border title="Linux" text={linux} {loading} {error} />
</CardsContainer>
