"use strict";

let rethink = require("rethinkdb");

let config = require("./utils/configHandler").getConfig();
let log = require("./utils/logger");
let fileProcessor = require("./handler/fileProcessor");

rethink.connect({
    host: config.dbConfig.host,
    port: config.dbConfig.port,
    db: config.dbConfig.db
}).then(connection => {
    log.done("Connected");
    fileProcessor.processRawTweetData(rethink, connection, (err) => {
        if (err) log.error(err);
    });
});
