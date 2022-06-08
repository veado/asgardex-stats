<script lang="ts">
	import { INITIAL_COUNTS } from '../stores/const';

	import type { Counts } from '../types/api';

	export let counts: Counts = INITIAL_COUNTS;

	$: total = counts.win + counts.linux + counts.mac;
</script>

<div class="stats shadow">
	<div class="stat">
		<div class="stat-title">Total</div>
		<div class="stat-value">{total}</div>
	</div>

	<div class="stat">
		<div class="stat-title">macOS</div>
		<div class="stat-value">{counts.mac}</div>
	</div>

	<div class="stat">
		<div class="stat-title">Linux</div>
		<div class="stat-value">{counts.linux}</div>
	</div>

	<div class="stat">
		<div class="stat-title">Windows</div>
		<div class="stat-value">{counts.win}</div>
	</div>
</div>
