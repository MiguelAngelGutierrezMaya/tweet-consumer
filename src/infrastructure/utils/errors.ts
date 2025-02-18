export class CreateTweetError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class CreateUserError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class UserNotFoundError extends Error {
	constructor(message: string) {
		super(message);
	}
}
