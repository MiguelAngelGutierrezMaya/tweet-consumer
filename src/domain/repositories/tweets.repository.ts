import { TweetMessagingRetry } from '@domain/messaging/tweets.messaging';
import { Tweet } from '@domain/models/Tweet';

export interface DataToCreateTweet {
	content: string;
	userId: string;
}

export interface TweetsRepository {
	createTweet(data: DataToCreateTweet): Promise<Tweet>;
}
