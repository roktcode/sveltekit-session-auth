import cookie from "cookie";
import { Tedis } from "tedis";

const db = new Tedis({ host: "127.0.0.1", port: 6379 });

export async function handle({ request, resolve }) {
	// get the cookies from request headers
	const cookies = cookie.parse(request.headers.cookie || "");

	request.locals.user = {};

	console.log(cookies.session_id);

	if (!cookies.session_id) {
		request.locals.user.authenticated = false;
	} else {
		const userSession = JSON.parse(await db.get(cookies.session_id));

		if (userSession) {
			request.locals.user.authenticated = true;
			request.locals.user.email = userSession.email;
			request.locals.user.name = userSession.name;
		}
	}

	const response = await resolve(request);

	return { ...response };
}

export function getSession(request) {
	const user = request.locals.user;
	if (!user.authenticated) {
		return {
			authenticated: false,
		};
	}

	return {
		authenticated: true,
		email: user.email,
		name: user.name,
	};
}
