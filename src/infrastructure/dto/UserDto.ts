import { User } from '@domain/models/User';
import { CreateUserError } from '@infra/utils/errors';

/**
 * Data Transfer Object (DTO) for User entities.
 * Handles validation and transformation of user data.
 */
export class UserDto {
	/**
	 * Creates a new UserDto instance
	 * @param id The unique identifier of the user
	 * @param username The username of the user
	 */
	constructor(public readonly id: string, public readonly username: string) {}

	/**
	 * Creates a new UserDto instance from raw data with validation
	 * @param data An object containing user data
	 * @throws {CreateUserError} When validation fails for id or username
	 * @returns {UserDto} A new validated UserDto instance
	 */
	static create(data: { [key: string]: any }): UserDto {
		const { id, username } = data;

		if (!id) {
			throw new CreateUserError('Id is required');
		}

		if (!username) {
			throw new CreateUserError('Username is required');
		}

		// Validate username min length
		if (username.length < 3) {
			throw new CreateUserError('Username must be at least 3 characters long');
		}

		// Validate username max length
		if (username.length > 50) {
			throw new CreateUserError('Username must be less than 50 characters long');
		}

		// Only allow alphanumeric, underscore, and hyphen
		if (!username.match(/^[a-zA-Z0-9_-]+$/)) {
			throw new CreateUserError('Username must contain only alphanumeric, underscore, and hyphen');
		}

		return new UserDto(id, username);
	}

	/**
	 * Converts the DTO to a User entity
	 * @returns {User} A User entity with the DTO's properties
	 */
	toEntity(): User {
		return {
			id: this.id,
			username: this.username,
		};
	}
}
