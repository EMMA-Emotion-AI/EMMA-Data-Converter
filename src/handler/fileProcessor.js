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

        const processedFiles = [];
        files.forEach((file) => {
            let rawdata = fs.readFileSync(config.dataDirectory + file, "utf8");
            let tweetRaw = JSON.parse(rawdata);

            const processedTweet = {
                text: tweetRaw.text.toLowerCase(),
                date: tweetRaw.datetime
            };
            processedFiles.push(processedTweet);
        });

        rethink.table("positive")
            .insert(processedFiles)
            .run(connection)
            .then(() => log.info("Insetrted Files!"));
        return callback(null);
    });
};

module.exports = {
    processRawTweetData
};
