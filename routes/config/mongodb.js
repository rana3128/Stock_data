const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost/Stock_data";


let state = { db: null };

/**
 * Method to connect to the mongodb
 * @param {*} url
 * @returns connection object
 */

exports.connect = (callback) => {

    if (state.db) return callback();

    MongoClient.connect(url, (err, connection) => {
        if (err) {
            console.log(err);
            return callback(err);
        }

        state.db = connection;//assign the connection object

        console.log(`MongoDB Connected----------------------------`);

        return callback();
    })
}

/**
 * Method to get the connection object of the mongodb
 * @returns db object
 */
exports.get = () => { return state.db.db('Stock_data')}

/**
 * Method to close the mongodb connection
 */
exports.close = (callback) => {

    if (state.db) {
        state.db.close((err, result) => {
            state.db = null;
            state.mode = null;
            return callback(err);
        })
    }
}