const _ = require('lodash');

module.exports = {
    options: {
        isNew: true
    },

    buildQuery: function() {
        return {
            recursive: false,
            pageSize: CONFIG.get('eventFetchSize'),
            pageNumber: 0,
            query: {
                $and: [{
                    $or: [{
                        state: ENUMS.EventState.NEW
                    }, {
                        state: ENUMS.EventState.ERROR
                    }]
                }, {
                    hits: { $lt: 5 }
                }]
            }
        };
    },

    processEvents: function(request, callback) {
        let _self = this;
        request.response = {
            success: [],
            failed: []
        };
        console.log('   INFO: Starting process to handle events : ');
        if (!request.options || !UTILS.isBlank(request.options)) {
            request.options = this.buildQuery();
        }
        DAO.EventDao.get(request).then(events => {
            console.log('   INFO: Total events to be processed : ', (events instanceof Array) ? events.length : 1);
            if (events instanceof Array && events.length <= 0) {
                callback('None of the events available', null, request);
            } else if (UTILS.isBlank(events)) {
                callback('None of the events available', null, request);
            } else {
                _self.broadcastEvents(events, (error, processedEvents) => {
                    _self.handleProcessedEvents(request, processedEvents, (message) => {
                        callback(null, message);
                    });
                });
            }
        }).catch(error => {
            callback(error, null, request);
        });
    },

    handleProcessedEvents: function(request, processedEvents, callback) {
        let success = [];
        let successIds = [];
        let failed = [];
        let promisses = [];
        processedEvents.forEach(processedEvent => {
            let event = JSON.parse(JSON.stringify(processedEvent));
            if (event.state === ENUMS.EventState.FINISHED.key) {
                successIds.push(event._id);
                request.response.success.push(event._id);
                delete event._id;
                delete event.__v;
                delete event.__t;
                success.push(event);
            } else {
                failed.push(event);
                request.response.failed.push(event._id);
            }
        });
        if (success.length > 0) {
            let input = {
                tenant: request.tenant,
                models: success
            };
            promisses.push(DAO.EventLogDao.save(input));
        }
        if (success.length > 0) {
            let input = {
                tenant: request.tenant,
                ids: successIds
            };
            promisses.push(DAO.EventDao.removeById(input));
        }
        if (failed.length > 0) {
            let input = {
                tenant: request.tenant,
                models: failed
            };
            promisses.push(DAO.EventDao.update(input));
        }
        Promise.all(promisses).then(result => {
            callback(request.response);
        }).catch(error => {
            console.log('   ERROR: Failed while saving success events into eventLog : ', error);
            callback(request.response);
        });
    },

    broadcastEvents: function(events, callback) {
        let _self = this;
        let processed = [];
        events.forEach(event => {
            processed.push(
                new Promise((resolve, reject) => {
                    _self.broadcastEvent(event, (err, response) => {
                        if (err) {
                            event.state = ENUMS.EventState.ERROR;
                            event.log.push(err.toString());
                        } else {
                            event.state = ENUMS.EventState.FINISHED;
                            event.log.push('Published Successfully');
                        }
                        event.hits = event.hits + 1;
                        resolve(event);
                    });
                })
            );
        });

        Promise.all(processed).then(result => {
            callback(null, result);
        }).catch(error => {
            callback(error, null);
        });
    },

    broadcastEvent: function(event, callback) {
        let request = SERVICE.ModuleService.buildRequest(event.target, 'POST', 'event/handle', event, null, true);
        SERVICE.ModuleService.fetch(request).then(response => {
            callback(null, response);
        }).catch(error => {
            callback(error, null);
        });
    }
};