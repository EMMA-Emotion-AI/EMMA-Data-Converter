"use strict";

// ====================== //
// = Copyright (c) EMMA = //
// ====================== //

// Dependencies
let rethink = require("rethinkdb");

// Utils
let config = require("./utils/configHandler").getConfig();
let log = require("./utils/logger");

// Handler
let fileProcessor = require("./handler/fileProcessor");

rethink.connect({
    host: config.dbConfig.host,
    port: config.dbConfig.port,
    db: config.dbConfig.db
}).then(connection => {
    log.done("Connected to RethinkDB!");
    fileProcessor.processEmotionData(rethink, connection, (err) => {
        if (!err) return;
        log.error(err);
        process.exit(1);
    });
});
