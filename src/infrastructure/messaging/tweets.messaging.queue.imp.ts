import { TweetMessaging, TweetMessagingRetry } from '@domain/messaging/tweets.messaging';

const MAX_RETRIES = 3;

/**
 * Implementation of the TweetMessaging interface that handles tweet message queue operations
 * with retry mechanism and dead letter queue (DLQ) support.
 */
export class TweetsMessagingQueueImp implements TweetMessaging {
	private readonly maxRetries = MAX_RETRIES;

	/**
	 * Creates an instance of TweetsMessagingQueueImp.
	 * @param env - Environment configuration containing queue references
	 */
	constructor(private readonly env: Env) {}

	/**
	 * Handles retry logic for failed tweet operations by either:
	 * 1. Requeuing the message with an incremented retry count if under max retries
	 * 2. Sending to Dead Letter Queue (DLQ) if max retries exceeded
	 *
	 * @param data - The tweet message data with retry information
	 * @param errorMessage - The error message from the failed attempt
	 * @returns Promise<void>
	 */
	async sendRetryTweetToQueue(data: TweetMessagingRetry, errorMessage: string): Promise<void> {
		const retryCount = data.retryCount || 0;

		console.log('retryCount', retryCount, this.maxRetries);

		if (retryCount < this.maxRetries) {
			console.log('retryCount < maxRetries');
			// Retry by sending back to the queue with incremented retry count
			const retryBody = {
				...data,
				retryCount: retryCount + 1,
			};
			await this.env.CREATE_TWEETS_QUEUE.send(retryBody);
		} else {
			console.log('retryCount >= maxRetries');
			// Send to DLQ after max retries
			if (this.env.CREATE_TWEETS_QUEUE_DLQ) {
				await this.env.CREATE_TWEETS_QUEUE_DLQ.send({
					originalMessage: data,
					error: errorMessage,
					failedAttempts: retryCount,
				});
			}
		}
	}
}
