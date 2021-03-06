/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

module.exports = {

    runJob: function (definition, cronJob) {
        let _self = this;
        this.triggerEventHandlerJob(definition, cronJob).then(response => {
            _self.LOG.debug('Job : executed successfuly');
        }).catch(error => {
            _self.LOG.error('Job : executed with error : ', error);
        });
    },

    prepareURL: function (definition) {
        let connectionType = 'abstract';
        let nodeId = '0';
        if (definition.targetNodeId) {
            connectionType = 'node';
            nodeId = definition.targetNodeId;
        }
        return SERVICE.DefaultModuleService.buildRequest({
            connectionType: connectionType,
            nodeId: nodeId,
            moduleName: 'nems',
            methodName: 'GET',
            apiName: '/event/process',
            requestBody: {},
            isJsonResponse: true,
            header: {
                apiKey: CONFIG.get('apiKey')
            }
        });
    },

    triggerEventHandlerJob: function (definition, cronJob) {
        let _self = this;
        return new Promise((resolve, reject) => {
            try {
                SERVICE.DefaultModuleService.fetch(this.prepareURL(definition, cronJob), (error, response) => {
                    let logMessage = '';
                    if (error || !response.SUCCESS) {
                        if (error) {
                            logMessage = error.toString();
                            _self.LOG.debug('Event process trigger failed : ' + error);
                        } else {
                            logMessage = JSON.stringify(response);
                            _self.LOG.debug('Event process trigger failed : ' + response.msg);
                        }
                        definition.lastResult = ENUMS.CronJobStatus.ERROR.key;
                        definition.state = ENUMS.CronJobState.FINISHED.key;
                    } else {
                        logMessage = JSON.stringify(response);
                        definition.lastResult = ENUMS.CronJobStatus.SUCCESS.key;
                        definition.state = ENUMS.CronJobState.FINISHED.key;
                        _self.LOG.debug('Event process triggered successfully');
                    }
                    _self.updateJobLog(definition, logMessage);
                    _self.updateJob(definition);
                    resolve();
                });
            } catch (error) {
                definition.lastResult = ENUMS.CronJobStatus.ERROR.key;
                definition.state = ENUMS.CronJobState.FINISHED.key;
                _self.updateJob(definition);
                resolve();
            }
        });
    },

    updateJobLog: function (definition, log) {
        let _self = this;
        SERVICE.DefaultCronJobLogService.save({
            tenant: definition.tenant,
            models: [{
                jobCode: definition.code,
                log: log
            }]
        }).then(models => {
            _self.LOG.debug('Log for job: ' + definition.code + ' saved');
        }).catch(error => {
            _self.LOG.error('While saving log for job: ' + definition.code + ' error: ' + error.toString());
        });
    },

    updateJob: function (definition) {
        let _self = this;
        SERVICE.DefaultCronJobService.save({
            tenant: definition.tenant,
            models: [definition]
        }).then(response => {
            _self.LOG.debug('Job : executed successfuly');
        }).catch(error => {
            _self.LOG.error('Job : executed with error : ', error);
        });
    }
};