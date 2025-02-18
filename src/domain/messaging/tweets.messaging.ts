import { DataToCreateTweet } from '@domain/repositories/tweets.repository';

export interface TweetMessagingRetry extends DataToCreateTweet {
	retryCount: number;
}

export interface TweetMessaging {
	sendRetryTweetToQueue(data: TweetMessagingRetry, errorMessage: string): Promise<void>;
}
