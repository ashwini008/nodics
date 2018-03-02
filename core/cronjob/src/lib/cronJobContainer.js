/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

const _ = require('lodash');
module.exports = function() {
    let _jobPool = {};

    this.createCronJobs = function(request, definitions) {
        let _self = this;
        let _success = {};
        let _failed = {};
        if (definitions) {
            definitions.forEach(function(definition) {
                try {
                    _self.createCronJob(request.authToken, definition);
                    _success[definition.name] = {
                        message: 'Successfully created'
                    };
                } catch (error) {
                    failed[definition.name] = error;
                    console.log('   ERROR:  while creating job for : ', definition.name, ' ', error);
                }
            });
        } else {
            throw new Error('   ERROR: Invalid cron job definitions');
        }
        return {
            success: _success,
            failed: _failed
        };
    };

    this.createCronJob = function(authToken, definition) {
        if (!definition) {
            throw new Error('   ERROR: Invalid cron job definition');
        }
        if (!definition.triggers || Object.keys(definition.triggers).length <= 0) {
            throw new Error('   ERROR: Invalid cron job definition triggers');
        }
        if (!_jobPool[definition.name]) {
            let cronJobs = [];
            definition.triggers.forEach(function(value) {
                if (value.isActive && CONFIG.get('clusterId') === definition.clusterId) {
                    let tmpCronJob = new CLASSES.CronJob(definition, value); //TODO: need to add context and timeZone
                    tmpCronJob.validate();
                    tmpCronJob.init();
                    tmpCronJob.setAuthToken(authToken);
                    cronJobs.push(tmpCronJob);
                }
            });
            _jobPool[definition.name] = cronJobs;
        } else {
            console.log('   WARN: Definition ', definition.name, ' is already available.');
            throw new Error('Definition ', definition.name, ' is already available.');
        }
    };

    this.updateCronJobs = function(request, definitions) {
        let _self = this;
        let success = {};
        let failed = {};
        if (definitions) {
            definitions.forEach(function(definition) {
                try {
                    _self.updateCronJob(definition);
                    success[definition.name] = {
                        message: 'Successfully updated'
                    };
                } catch (error) {
                    failed[definition.name] = error;
                    console.log('   ERROR: while creating job for : ', definition.name, ' ', error);
                }
            });
        } else {
            throw new Error('   ERROR: Invalid cron job definitions');
        }
        return {
            success: success,
            failed: failed
        };
    };

    this.updateCronJob = function(definition) {
        if (!definition) {
            throw new Error('   ERROR: Invalid cron job definition');
        }
        if (!definition.triggers || Object.keys(definition.triggers).length <= 0) {
            throw new Error('   ERROR: Invalid cron job definition triggers');
        }
        if (!_jobPool[definition.name]) {
            this.createCronJob(definition);
        } else {
            tmpCronJob = _jobPool[definition.name];
            delete _jobPool[definition.name];
            let _running = tmpCronJob[0].isRunning();
            tmpCronJob.forEach(function(job) {
                job.stopCronJob();
            });
            this.createCronJob(definition);
            if (_running) {
                _jobPool[definition.name].forEach(function(job) {
                    job.startCronJob();
                });
            }
        }
    };

    this.runCronJobs = function(request, definitions) {
        let _self = this;
        let success = {};
        let failed = {};
        if (definitions) {
            definitions.forEach(function(definition) {
                try {
                    _self.runCronJob(request.authToken, definition);
                    success[definition.name] = {
                        message: 'Successfully executed'
                    };
                } catch (error) {
                    failed[definition.name] = error;
                    console.log('   ERROR: while executing job for : ', definition.name, ' ', error);
                }
            });
        } else {
            throw new Error('   ERROR: Invalid cron job definitions');
        }
        return {
            success: success,
            failed: failed
        };
    };

    this.runCronJob = function(authToken, definition) {
        if (!definition) {
            throw new Error('   ERROR: Invalid cron job definition');
        }
        let _running = false;
        if (_jobPool[definition.name] && _jobPool[definition.name][0].isRunning()) {
            _running = _jobPool[definition.name][0].isRunning();
            _jobPool[definition.name].forEach(function(job) {
                job.pauseCronJob();
            });
        }
        let tmpCronJob = new CLASSES.CronJob(definition, definition.triggers[0]); //TODO: need to add context and timeZone
        tmpCronJob.validate();
        tmpCronJob.setAuthToken(authToken);
        tmpCronJob.init(true);
        if (_jobPool[definition.name] && _running) {
            _jobPool[definition.name].forEach(function(job) {
                job.resumeCronJob();
            });
        }
    };


    this.startCronJobs = function(request) {
        let jobNames = request.jobNames;
        let _self = this;
        let _success = {};
        let _failed = {};
        let response = {};
        jobNames.forEach((value) => {
            try {
                _self.startCronJob(value);
                _success[value] = {
                    message: 'Successfully started'
                };
            } catch (error) {
                _failed[value] = error;
            }
        });
        return {
            success: _success,
            failed: _failed
        };
    };

    this.startCronJob = function(jobName) {
        if (jobName && _jobPool[jobName]) {
            _jobPool[jobName].forEach(function(cronJob) {
                cronJob.startCronJob();
            });
        } else {
            throw new Error('   WARN: Either name is not valid or job already removed.');
        }
    };

    this.stopCronJobs = function(request) {
        let jobNames = request.jobNames;
        let _self = this;
        let _success = {};
        let _failed = {};
        let response = {};
        jobNames.forEach((value) => {
            try {
                _self.stopCronJob(value);
                _success[value] = {
                    message: 'Successfully stoped'
                };
            } catch (error) {
                _failed[value] = error;
            }
        });
        return {
            success: _success,
            failed: _failed
        };
    };

    this.stopCronJob = function(jobName) {
        if (jobName && _jobPool[jobName]) {
            _jobPool[jobName].forEach(function(cronJob) {
                cronJob.stopCronJob();
            });
        } else {
            throw new Error('   ERROR: Either name is not valid or job already removed.');
        }
    };

    this.removeCronJobs = function(request) {
        let jobNames = request.jobNames;
        let _self = this;
        let _success = {};
        let _failed = {};
        let response = {};
        jobNames.forEach((value) => {
            try {
                _self.removeCronJob(value);
                _success[value] = {
                    message: 'Successfully removed'
                };
            } catch (error) {
                _failed[value] = error;
            }
        });
        return {
            success: _success,
            failed: _failed
        };
    };

    this.removeCronJob = function(jobName) {
        if (jobName && _jobPool[jobName]) {
            _jobPool[jobName].forEach(function(cronJob) {
                cronJob.stopCronJob();
            });
            delete _jobPool[jobName];
        } else {
            throw new Error('Either name is not valid or job already removed.');
        }
    };

    this.pauseCronJobs = function(request) {
        let jobNames = request.jobNames;
        let _self = this;
        let _success = {};
        let _failed = {};
        let response = {};
        jobNames.forEach((value) => {
            try {
                _self.pauseCronJob(value);
                _success[value] = {
                    message: 'Successfully paused'
                };
            } catch (error) {
                _failed[value] = error;
            }
        });
        return {
            success: _success,
            failed: _failed
        };
    };

    this.pauseCronJob = function(jobName) {
        if (jobName && _jobPool[jobName]) {
            _jobPool[jobName].forEach(function(cronJob) {
                cronJob.pauseCronJob();
            });
        } else {
            throw new Error('   ERROR: Given cronJob name is not valid');
        }
    };

    this.resumeCronJobs = function(request) {
        let jobNames = request.jobNames;
        let _self = this;
        let _success = {};
        let _failed = {};
        let response = {};
        jobNames.forEach((value) => {
            try {
                _self.resumeCronJob(value);
                _success[value] = {
                    message: 'Successfully resumed'
                };
            } catch (error) {
                _failed[value] = error;
            }
        });
        return {
            success: _success,
            failed: _failed
        };
    };

    this.resumeCronJob = function(jobName) {
        if (jobName && _jobPool[jobName]) {
            _jobPool[jobName].forEach(function(cronJob) {
                cronJob.resumeCronJob();
            });
        } else {
            throw new Error('   ERROR: Given cronJob name is not valid');
        }
    };
};