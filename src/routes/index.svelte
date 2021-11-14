<script>
	import Login from "$lib/login.svelte";
	import Register from "$lib/register.svelte";
	import { goto } from "$app/navigation";

	function redirectToProfile() {
		goto("/profile");
	}
</script>

<h1>SvelteKit session authentication</h1>

<Login on:success={redirectToProfile} />
<Register on:success={redirectToProfile} />
