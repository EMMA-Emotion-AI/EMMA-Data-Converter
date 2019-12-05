"use strict";

// ====================== //
// = Copyright (c) EMMA = //
// ====================== //

// Core Modules
let fs = require("fs");
let path = require("path");

// Utils
let log = require("../utils/logger");
let config = require("../utils/configHandler").getConfig();

// Categorization of constant config entries
const emotions = [
    {
        directory: path.join(config.dataDirectory, config.positiveDirectory),
        dbTable: config.dbConfig.positiveTable
    },
    {
        directory: path.join(config.dataDirectory, config.negativeDirectory),
        dbTable: config.dbConfig.negativeTable
    }
];

/**
 * Converts the emotion data
 *
 * @param {*} rethink
 * @param {*} connection
 * @param {function} callback
 */
let processEmotionData = function(rethink, connection, callback){
    emotions.forEach(emotion =>{
        // eslint-disable-next-line consistent-return
        fs.readdir(emotion.directory, (err, files) => {
            if (err) return callback(`Unable to scan directory: ${err}`);
            rethink.table(emotion.dbTable)
                .insert(files.map((file) => {
                    let data = JSON.parse(fs.readFileSync(emotion.directory + file, "utf8"));
                    return {
                        text: data.text.toLowerCase(),
                        date: data.datetime
                    };
                }))
                .run(connection)
                .then(() => log.info("Insetrted Files!"));
        });
        return callback(null);
    });
};

module.exports = {
    processEmotionData
};
