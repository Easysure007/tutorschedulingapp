import { MongoClient } from 'mongodb'

/**
 * YOUR DATABASE CONNECTION URL NEEDS TO BE SECURELY STORED AND NOT EXPOSED
 * TO VERSION CONTROL TOOLS
 * 
 * GET YOUR MONGODB CONNECTION URL AND DATABASE NAME FROM YOUR ENVIRONMENT VARIABLES
 */
let uri: string = process.env.MONGODB_URI || "http://localhost:27017"
let dbName = process.env.MONGODB_DB

let cachedClient: any = null
let cachedDb: any = null

/**
 * SINCE THE APPLICATION RELY ON THE DATABASE, 
 * SIMPLY BREAK THE CODE WHEN THOSE VARIABLES ARE NOT SET IN 
 * ENVIRONMENT
 */
if (!uri) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

if (!dbName) {
    throw new Error(
        'Please define the MONGODB_DB environment variable inside .env.local'
    )
}

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb }
    }

    /**
     * ATTEMPT CONNECTING TO THE MONGODB
     */
    const client = await MongoClient.connect(uri, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })

    const db = await client.db(dbName)

    cachedClient = client
    cachedDb = db

    /**
     * EXPORT THE SUCCESSFUL CONNECTION TO BE USED ACROSS THE APPLICATION
     */
    return { client, db }
}