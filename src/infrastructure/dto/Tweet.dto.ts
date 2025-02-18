import { CreateTweetError } from '@infra/utils/errors';
import { UserDto } from './UserDto';
import { Tweet } from '@domain/models/Tweet';

/**
 * Data Transfer Object (DTO) for Tweet entities.
 * Handles validation and transformation of tweet data.
 */
export class TweetDto {
	/**
	 * Creates a new TweetDto instance
	 * @param content The content of the tweet
	 * @param user The user who created the tweet
	 * @param createdAt The date and time the tweet was created
	 * @param updatedAt The date and time the tweet was last updated
	 */
	constructor(
		public readonly content: string,
		public readonly user: UserDto,
		public readonly createdAt: Date,
		public readonly updatedAt: Date
	) {}

	/**
	 * Creates a new TweetDto instance from raw data with validation
	 * @param data An object containing tweet data
	 * @throws {CreateTweetError} When validation fails for content or user
	 * @returns {TweetDto} A new validated TweetDto instance
	 */
	static create(data: { [key: string]: any }): TweetDto {
		const { content, user } = data;

		if (!user) {
			throw new CreateTweetError('User is required');
		}

		if (!content) {
			throw new CreateTweetError('Content is required');
		}

		// Add content validation
		if (typeof content !== 'string') {
			throw new CreateTweetError('Content must be a string');
		}

		// Validate content length
		if (content.length > 1000) {
			throw new CreateTweetError('Content exceeds maximum length of 1000 characters');
		}

		// Check for basic SQL injection patterns
		const suspiciousPattern = /(['"];.*(?:--|\/\*|\*\/|;))|(\b(?:union|drop)\s+(?:all|table|database)\b)/gi;
		if (suspiciousPattern.test(content)) {
			throw new CreateTweetError('Invalid content format');
		}

		const userDto = UserDto.create(user);

		return new TweetDto(content, userDto, new Date(), new Date());
	}

	/**
	 * Converts the DTO to a Tweet entity
	 * @returns {Tweet} A Tweet entity with the DTO's properties
	 */
	toEntity(): Tweet {
		return {
			content: this.content,
			user: this.user.toEntity(),
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}

/**
 * Data Transfer Object (DTO) for creating a new tweet.
 * Handles validation and transformation of tweet creation data.
 */
export class CreateTweetDto {
	/**
	 * Creates a new CreateTweetDto instance
	 * @param content The content of the tweet
	 * @param user The username of the user who created the tweet
	 */
	constructor(public readonly content: string, public readonly user: string) {}

	/**
	 * Creates a new CreateTweetDto instance
	 * @param data An object containing tweet creation data
	 * @throws {CreateTweetError} When validation fails for content or user
	 * @returns {CreateTweetDto} A new validated CreateTweetDto instance
	 */
	static create(data: { [key: string]: any }): CreateTweetDto {
		if (!data.content) {
			throw new CreateTweetError('Content is required');
		}

		if (!data.user) {
			throw new CreateTweetError('User is required');
		}

		return new CreateTweetDto(data.content, data.user);
	}
}
