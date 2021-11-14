<script>
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	let email;
	let password;
	let error;

	async function login() {
		error = undefined;

		try {
			const result = await fetch("/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (result.ok) {
				dispatch("success");
			} else {
				error = "an error occured";
			}
		} catch (e) {
			console.log(e);
			error = "an error occured";
		}
	}
</script>

<h2>Login</h2>

<input type="email" bind:value={email} placeholder="enter your email" />
<input
	type="password"
	bind:value={password}
	placeholder="enter your password"
/>
{#if error}
	<p>{error}</p>
{/if}
<button on:click={login}>Login</button>
