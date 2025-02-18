import { TweetsDatasource } from '@domain/datasources/tweets.datasource';
import { UsersDatasource } from '@domain/datasources/users.datasource';
import { Tweet } from '@domain/models/Tweet';
import { DataToCreateTweet, TweetsRepository } from '@domain/repositories/tweets.repository';
import { CreateTweetDto, TweetDto } from '@infra/dto/Tweet.dto';
import { CreateTweetError } from '@infra/utils/errors';

/**
 * Implementation of the TweetsRepository interface that provides functionality for creating tweets
 * and interacting with the underlying datasources.
 */
export class TweetsRepositoryImp implements TweetsRepository {
	/**
	 * Creates an instance of TweetsRepositoryImp.
	 * @param tweetsDatasource - The datasource for tweets
	 * @param usersDatasource - The datasource for users
	 */
	constructor(private readonly tweetsDatasource: TweetsDatasource, private readonly usersDatasource: UsersDatasource) {}

	/**
	 * Creates a new tweet for a given user
	 *
	 * @param data - The data required to create a tweet
	 * @throws {CreateTweetError} When the tweet creation fails
	 * @returns {Promise<Tweet>} The newly created tweet
	 *
	 * @description
	 * This method performs the following steps:
	 * 1. Validates and transforms the input data into a DTO
	 * 2. Finds the user by username
	 * 3. Creates a tweet DTO with the content and user
	 * 4. Persists the tweet in the datasource
	 */
	async createTweet(data: DataToCreateTweet): Promise<Tweet> {
		const createTweetDto = CreateTweetDto.create(data);

		const user = await this.usersDatasource.findByUsername(createTweetDto.user);

		const tweetToCreate = TweetDto.create({
			content: createTweetDto.content,
			user,
		});

		const tweet = await this.tweetsDatasource.createTweet(tweetToCreate.toEntity());

		if (!tweet) {
			throw new CreateTweetError('Tweet not created');
		}

		return tweet;
	}
}
