import { UsersDatasource } from '@domain/datasources/users.datasource';
import { User } from '@domain/models/User';
import { UserNotFoundError } from '@infra/utils/errors';
import { Pool } from '@neondatabase/serverless';

/**
 * Implementation of UsersDatasource interface using NeonDB as the database.
 * This class handles user-related database operations.
 */
export class UsersDatasourceNeonDBImp implements UsersDatasource {
	/**
	 * Creates a new instance of UsersDatasourceNeonDBImp
	 * @param pool - NeonDB connection pool instance
	 */
	constructor(private readonly pool: Pool) {}

	/**
	 * Finds a user by their username in the database
	 * @param username - The username to search for
	 * @returns Promise<User> - The user object if found
	 * @throws {UserNotFoundError} - If no user is found with the given username
	 */
	async findByUsername(username: string): Promise<User> {
		const { rows } = await this.pool.query('SELECT id, username FROM users WHERE username = $1', [username]);

		if (rows.length === 0) {
			throw new UserNotFoundError('User not found');
		}

		return {
			id: rows[0].id,
			username: rows[0].username,
		} as User;
	}
}
