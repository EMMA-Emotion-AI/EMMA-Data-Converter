"use strict";

let fs = require("fs");

let log = require("../utils/logger");
let config = require("../utils/configHandler").getConfig();

let getEmotionConfigData = function(emotion){
    switch(emotion){
        case "+":  return {
            directory: config.dataDirectory + config.positiveDirectory,
            dbTable: config.positiveTable
        };
        case "-":  return {
            directory: config.dataDirectory + config.negativeDirectory,
            dbTable: config.negativeTable
        };
        default : return null;
    }
};

let processEmotionData = function(rethink, connection, emotion){
    const configData = getEmotionConfigData(emotion);
    fs.readdir(config.dataDirectory, (err, files) => {
        if (err) return callback(`Unable to scan directory: ${err}`);

        rethink.table(configData.dbTable)
            .insert(files.map((file) => {
                let data = JSON.parse(fs.readFileSync(configData.directory + file, "utf8"));
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


/**
 * Process the actual data.
 *
 * @param {*} rethink
 * @param {*} connection
 */
let processRawTweetData = function(rethink, connection, callback){
    processEmotionData(rethink, connection, "+");
    processEmotionData(rethink, connection, "-");
};

module.exports = {
    processRawTweetData
};
