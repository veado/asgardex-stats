<script lang="ts">
	import background from '../assets/background.png';
	import logo from '../assets/logo.png';
	// import logo from '../assets/logo.svg';
</script>

<div class="hero bg-neutral">
	<div class="max-w-md">
		<div class="hero " style="background-image: url({logo});">
			<!-- <div class="hero bg-neutral"> -->
			<div class="hero-overlay bg-opacity-80" />
			<div class="hero-content text-center text-neutral-content">
				<div class="max-w-md">
					<div class="flex items-center justify-center">
						<!-- <img src={logo} class="h-14 w-14 m-2" alt="logo" /> -->
						<!-- <img src={logo} class="h-32 w-32 m-5" alt="logo" /> -->
						<!-- <img src={logo} class="h-12 w-12" alt="logo" /> -->
						<h1 class="m-2 text-6xl font-bold bg-primary-200">ASGARDEX</h1>
					</div>
					<div class="flex items-center justify-center">
						<!-- <img src={logo} class="h-16 w-16 m-5" alt="logo" /> -->
						<span class="text-4xl">st</span>
						<!-- <img src={logo} class="h-8 w-8" alt="logo" /> -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
							/>
						</svg>
						<span class="text-4xl">ts*</span>
					</div>
					<p class="mt-5 text-sm italic">
						* Statistics of <a
							href="https://github.com/thorchain/asgardex-electron/releases"
							class="underline">ASGARDEX desktop</a
						> releases
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
