import cookie from "cookie";
import stringHash from "string-hash";
import { v4 as uuid } from "uuid";
import { Tedis } from "tedis";

const db = new Tedis({ host: "127.0.0.1", port: 6379 });

export async function post({ body }) {
	const user = JSON.parse(await db.get(body.email));

	if (!user) {
		return {
			status: 401,
			body: { message: "incorrect email/password" },
		};
	}

	if (user.password !== stringHash(body.password)) {
		return {
			status: 401,
			body: {
				message: "unauthorized",
			},
		};
	}

	const cookieId = uuid();

	await db.set(
		cookieId,
		JSON.stringify({
			email: body.email,
			name: user.name,
		})
	);

	const headers = {
		"Set-Cookie": cookie.serialize("session_id", cookieId, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
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
