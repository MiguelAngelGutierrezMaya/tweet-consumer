import { CreateTweetError, CreateUserError, UserNotFoundError } from './errors';

export const processError = (error: unknown): string => {
	if (error instanceof CreateTweetError) {
		console.error(error, CreateTweetError.name);
		return CreateTweetError.name + ' - ' + error.message;
	}

	if (error instanceof CreateUserError) {
		console.error(error, CreateUserError.name);
		return CreateUserError.name + ' - ' + error.message;
	}

	if (error instanceof UserNotFoundError) {
		console.error(error, UserNotFoundError.name);
		return UserNotFoundError.name + ' - ' + error.message;
	}

	if (error instanceof Error) {
		console.error(error, error.name);
		return error.name + ' - ' + error.message;
	}

	console.error(error, 'Unknown error');
	return 'Unknown error';
};
