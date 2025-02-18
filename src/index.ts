/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Queue consumer: a Worker that can consume from a
 * Queue: https://developers.cloudflare.com/queues/get-started/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { CreateTweetUseCase, RetryCreateTweetUseCase } from '@app/use-cases/tweets.use-case';
import { TweetMessagingRetry } from '@domain/messaging/tweets.messaging';
import { DataToCreateTweet } from '@domain/repositories/tweets.repository';
import { TweetsDatasourceNeonDBImp } from '@infra/datasources/tweets.neondb.imp';
import { UsersDatasourceNeonDBImp } from '@infra/datasources/users.neondb.imp';
import { TweetsMessagingQueueImp } from '@infra/messaging/tweets.messaging.queue.imp';
import { TweetsRepositoryImp } from '@infra/repositories/tweets.repository.imp';
import { processError } from '@infra/utils/processError';
import { Pool } from '@neondatabase/serverless';

export default {
	async fetch(_: Request): Promise<Response> {
		return new Response('Hello World');
	},

	/**
	 * Processes messages from a Cloudflare Queue to create tweets
	 *
	 * @param batch - A MessageBatch object containing messages to be processed
	 * @param env - Environment variables including database configuration
	 *
	 * Function flow:
	 * 1. Establishes a connection to NeonDB database
	 * 2. Initializes data sources for tweets and users
	 * 3. Sets up tweet repository and messaging system
	 * 4. Processes each message in the batch:
	 *    - Attempts to create a tweet
	 *    - On failure, queues message for retry with error details
	 *    - Acknowledges message processing regardless of outcome
	 * 5. Closes database connection
	 *
	 * @throws Will not throw errors as they are caught and handled internally
	 * @returns Promise<void>
	 */
	async queue(batch: MessageBatch, env: Env): Promise<void> {
		const pool = new Pool({
			connectionString: env.DATABASE_URL,
		});

		// Create datasources
		const tweetsDatasource = new TweetsDatasourceNeonDBImp(pool);
		const usersDatasource = new UsersDatasourceNeonDBImp(pool);

		// Create repository
		const createTweetRepository = new TweetsRepositoryImp(tweetsDatasource, usersDatasource);

		// Create messaging
		const tweetsMessaging = new TweetsMessagingQueueImp(env);

		// Create use cases
		const createTweetUseCase = new CreateTweetUseCase(createTweetRepository);
		const retryCreateTweetUseCase = new RetryCreateTweetUseCase(tweetsMessaging);

		for (const message of batch.messages) {
			// Process message
			console.log(`message ${message.id} processed: ${JSON.stringify(message.body)}`);

			try {
				// Execute use case
				await createTweetUseCase.execute(message.body as DataToCreateTweet);
			} catch (error) {
				const errorMessage = processError(error);

				// Retry use case
				retryCreateTweetUseCase.execute(message.body as TweetMessagingRetry, errorMessage);
			} finally {
				// Acknowledge message
				message.ack();
			}
		}

		await pool.end();
	},
} satisfies ExportedHandler<Env, Error>;
