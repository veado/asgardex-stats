<script lang="ts">
	export let title = '';
	export let text = '';
	export let border = false;
	export let dropshadow = false;
	export let loading = false;
	export let error = false;
</script>

<figure
	class="bg-white rounded-xl p-4 dark:bg-slate-800 {border ? 'border border-gray-200"' : ''}"
	class:drop-shadow-md={dropshadow}
>
	<h1 class="text-2xl text-center text-gray-500">{title}</h1>
	<h2 class="text-5xl text-center {loading || error ? 'text-gray-300' : 'text-gray-800'}">
		{text}
	</h2>
</figure>
