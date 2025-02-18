# 🚀 Tweet Creation Service Documentation

A Cloudflare Workers service that handles tweet creation using hexagonal architecture, Wrangler, and NeonDB.

## 📋 Project Overview

This service implements a queue-based tweet creation system with the following features:

- ✨ Hexagonal Architecture
- 🔄 Queue-based processing with retry mechanism
- 🗄️ NeonDB integration for data persistence
- ⚡ Cloudflare Workers for serverless execution
- 🔍 User validation before tweet creation

## 🏗️ Architecture

The project follows a hexagonal (ports and adapters) architecture:

- 🎯 **Use Cases**:
  - `CreateTweetUseCase`: Handles new tweet creation
  - `RetryCreateTweetUseCase`: Manages failed tweet creation attempts
- 🔌 **Queues**:
  - `create-tweets`: Main queue for tweet creation
  - `create-tweets-dlq`: Dead Letter Queue for failed attempts
- 🗃️ **Database**: NeonDB for user and tweet storage

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Cloudflare Workers account
- NeonDB account and database

## ⚙️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/MiguelAngelGutierrezMaya/tweet-consumer
cd tweet-creation-service
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Create a `.env` file**

```bash
DATABASE_URL=your_neon_db_connection_string
```

4. **Configure Wrangler**
   Ensure your `wrangler.jsonc` contains:

```jsonc
{
	"name": "tweet-creation-service",
	"queues": {
		"consumers": [
			{
				"queue": "create-tweets",
				"max_batch_size": 10,
				"max_batch_timeout": 30,
				"max_retries": 5,
				"dead_letter_queue": "create-tweets-dlq"
			}
		],
		"producers": [
			{
				"queue": "create-tweets",
				"binding": "CREATE_TWEETS_QUEUE"
			},
			{
				"queue": "create-tweets-dlq",
				"binding": "CREATE_TWEETS_QUEUE_DLQ"
			}
		]
	}
}
```

## 🚀 Running the Project

1. **Local Development**

```bash
pnpm run dev
```

## 🚀 Deployment

```bash
pnpm run deploy
```

## 🔄 Queue Processing Flow

1. 📥 Message received in `create-tweets` queue
2. 🔍 Validate user existence in NeonDB
3. ✍️ Attempt to create tweet
4. If successful:
   - ✅ Tweet is persisted
   - 📤 Message is acknowledged
5. If failed:
   - ❌ Error is processed
   - 🔄 Message is sent to retry queue
   - 📤 Original message is acknowledged

### Error Handling

- Messages that fail processing are sent to `create-tweets-dlq`
- Each retry attempt includes the original payload and error details
- Messages in DLQ can be manually reprocessed if needed

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🆘 Support

For support, please contact me at [gutierrezmayamiguelangel@gmail.com]
