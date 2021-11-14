<script context="module">
	export async function load({ session }) {
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: "/auth/unauthorized",
			};
		} else {
			return {
				props: {
					email: session.email,
					name: session.name,
				},
			};
		}
	}
</script>

<script>
	export let email;
	export let name;

	// onMount(async () => {
	// 	const res = await fetch("/user");
	// 	const user = await res.json();
	// 	name = user.name;
	// });
</script>

<h2>Profile</h2>
<p>Hello, {name}! you are logged in with {email}</p>
