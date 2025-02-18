import { TweetMessaging, TweetMessagingRetry } from '@domain/messaging/tweets.messaging';
import { Tweet } from '@domain/models/Tweet';
import { DataToCreateTweet, TweetsRepository } from '@domain/repositories/tweets.repository';

/**
 * Use case for creating a new tweet.
 * Handles the creation of a tweet by delegating to the TweetsRepository.
 */
export class CreateTweetUseCase {
	/**
	 * Creates a new CreateTweetUseCase instance
	 * @param tweetsRepository The repository for tweets
	 */
	constructor(private readonly tweetsRepository: TweetsRepository) {
		this.tweetsRepository = tweetsRepository;
	}

	/**
	 * Executes the create tweet use case
	 * @param data The data to create a tweet
	 * @returns The created tweet
	 */
	async execute(data: DataToCreateTweet): Promise<Tweet> {
		return await this.tweetsRepository.createTweet(data);
	}
}

/**
 * Use case for retrying the creation of a tweet.
 * Handles the retry of a tweet by delegating to the TweetsMessaging.
 */
export class RetryCreateTweetUseCase {
	/**
	 * Creates a new RetryCreateTweetUseCase instance
	 * @param tweetsMessaging The messaging for tweets
	 */
	constructor(private readonly tweetsMessaging: TweetMessaging) {
		this.tweetsMessaging = tweetsMessaging;
	}

	/**
	 * Executes the retry create tweet use case
	 * @param data The data to retry a tweet
	 * @param errorMessage The error message
	 * @returns void
	 */
	async execute(data: TweetMessagingRetry, errorMessage: string): Promise<void> {
		await this.tweetsMessaging.sendRetryTweetToQueue(data, errorMessage);
	}
}
