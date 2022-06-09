<script lang="ts">
	import { INITIAL_COUNTS } from '../stores/const';

	import type { Counts } from '../types/api';
	import Card from './Card.svelte';
	import CardsContainer from './CardsContainer.svelte';

	export let counts: Counts = INITIAL_COUNTS;

	$: total = counts.win + counts.linux + counts.mac;
</script>

<CardsContainer>
	<Card border title="Total" text={total.toString()} />
	<Card border title="macOS" text={counts.mac.toString()} />
	<Card border title="Windows" text={counts.win.toString()} />
	<Card border title="Linux" text={counts.linux.toString()} />
</CardsContainer>
