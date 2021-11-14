import cookie from "cookie";
import stringHash from "string-hash";
import { v4 as uuid } from "uuid";
import { Tedis } from "tedis";

const db = new Tedis({ host: "127.0.0.1", port: 6379 });

export async function post({ body }) {
	// 1. get the user from  redis database (string)
	// 2. parse the string into an object
	// 3. if user exists, dont't create new account

	const user = JSON.parse(await db.get(body.email));

	if (user) {
		return {
			status: 409,
			body: { message: "user with that email already exists" },
		};
	}

	await db.set(
		body.email,
		JSON.stringify({
			email: body.email,
			password: stringHash(body.password),
			name: body.name,
		})
	);

	// genearte random cookieId
	const cookieId = uuid();

	// save the cookieId to the db
	// so that we can recognize it later
	// set the cookieId as a key, and
	// an object with user email as a value
	await db.set(
		cookieId,
		JSON.stringify({
			email: body.email,
			name: body.name,
		})
	);

	const headers = {
		"Set-Cookie": cookie.serialize("session_id", cookieId, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7, // valid for a week
			sameSite: "lax",
			path: "/",
		}),
	};

	return {
		status: 200,
		headers,
		body: {
			message: "Success",
		},
	};
}
