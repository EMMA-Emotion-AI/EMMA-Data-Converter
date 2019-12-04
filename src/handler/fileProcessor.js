"use strict";

let fs = require("fs");

let log = require("../utils/logger");
let config = require("../utils/configHandler").getConfig();

/**
 * Process the actual data.
 *
 * @param {*} rethink
 * @param {*} connection
 */
let processRawTweetData = function(rethink, connection, callback){
    fs.readdir(config.dataDirectory, (err, files) => {
        if (err) return callback(`Unable to scan directory: ${err}`);

        files.forEach((file) => {
            let rawdata = fs.readFileSync(config.dataDirectory + file, "utf8");
            let tweetRaw = JSON.parse(rawdata);

            const newData = {
                text: tweetRaw.text.toLowerCase(),
                date: tweetRaw.datetime
            };

            rethink.table("positive")
                .insert(newData)
                .run(connection)
                .then(() => log.info("insetrted"));
        });
        return callback(null);
    });
};

module.exports = {
    processRawTweetData
};
