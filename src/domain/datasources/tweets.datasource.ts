import { Tweet } from '@domain/models/Tweet';

export interface TweetsDatasource {
	createTweet(tweet: Tweet): Promise<Tweet>;
}
