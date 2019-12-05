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

        rethink.table("positive")
            .insert(files.map((file) => {
                let data = JSON.parse(fs.readFileSync(config.dataDirectory + file, "utf8"));
                return {
                    text: data.text.toLowerCase(),
                    date: data.datetime
                };
            }))
            .run(connection)
            .then(() => log.info("Insetrted Files!"));

        return callback(null);
    });
};

module.exports = {
    processRawTweetData
};
