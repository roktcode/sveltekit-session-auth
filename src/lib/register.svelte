<script>
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	let name;
	let email;
	let password;
	let error;

	async function register() {
		error = undefined;

		try {
			const result = await fetch("/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
					name,
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

<h2>Register</h2>

<input type="text" bind:value={name} placeholder="enter your  name" />
<input type="email" bind:value={email} placeholder="enter your email" />
<input
	type="password"
	bind:value={password}
	placeholder="enter your password"
/>
{#if error}
	<p>{error}</p>
{/if}
<button on:click={register}>Register</button>
