<script lang="ts">
	import logo from '../assets/logo.png';
	import Card from './Card.svelte';
	import CardsContainer from './CardsContainer.svelte';
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
			<Card dropshadow title="Releases" text="22" />
			<Card dropshadow title="Downloads" text="3003" />
			<Card dropshadow title="Pull requests" text="2002" />
			<Card dropshadow title="Commits" text="1001" />
		</CardsContainer>
	</div>
</header>
