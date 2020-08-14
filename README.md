# Rimuru
Scrape task creator **Open Weeb Repository** projects

### What this service do?
1. Send RabbitMQ message for every active project
2. Moving scrape task to archive is it have too much error

## Environment Config
1. ``DB_CONN`` Mongo DB Connection
1. ``APP_NPROCESS_CHUNK`` How many detail page scrapping run in one time
1. ``APP_CRONTIME`` Default crontime will be overriden by args 
1. ``QUEUE_CONN`` Amqp connection 
1. ``QUEUE_PROJECT_SCRAPPER`` project scrapper queue name
