export const config = {
    port: process.env.PORT || 3001,
    mongoDBUri: process.env.MONGO_URL || 'mongodb://mongo:27017',
    mongoDB: process.env.MONGO_DB_NAME || 'BD-SweetMedical',
}