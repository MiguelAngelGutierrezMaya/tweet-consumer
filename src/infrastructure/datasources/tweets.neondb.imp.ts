import { TweetsDatasource } from '@domain/datasources/tweets.datasource';
import { Tweet } from '@domain/models/Tweet';
import { Pool } from '@neondatabase/serverless';

/**
 * Implementation of TweetsDatasource interface using NeonDB as the database.
 * This class handles all tweet-related database operations.
 */
export class TweetsDatasourceNeonDBImp implements TweetsDatasource {
	/**
	 * Creates a new instance of TweetsDatasourceNeonDBImp
	 * @param pool - NeonDB connection pool instance for database operations
	 */
	constructor(private readonly pool: Pool) {}

	/**
	 * Creates a new tweet in the database
	 * @param tweet - The tweet object to be created
	 * @returns Promise<Tweet> - The created tweet with all database fields
	 * @throws Will throw an error if the database operation fails
	 */
	async createTweet(tweet: Tweet): Promise<Tweet> {
		const { rows } = await this.pool.query('INSERT INTO tweets (content, user_id) VALUES ($1, $2) RETURNING *', [
			tweet.content,
			tweet.user.id,
		]);

		return rows[0] as Tweet;
	}
}
