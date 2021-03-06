/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

const _ = require('lodash');

module.exports = {

    createJob: function (request, callback) {
        request = _.merge(request || {}, request.httpRequest.body);
        request.options = request.options || {};
        if (!request.options.recursive) {
            request.options.recursive = request.httpRequest.get('recursive') || false;
        }
        if (request.httpRequest.params.jobCode) {
            request.query = {
                code: request.httpRequest.params.jobCode
            };
        }
        if (!UTILS.isBlank(request.query)) {
            if (callback) {
                FACADE.DefaultCronJobFacade.createJob(request).then(success => {
                    callback(null, success);
                }).catch(error => {
                    callback(error);
                });
            } else {
                return FACADE.DefaultCronJobFacade.createJob(request);
            }
        } else {
            this.LOG.error('Please validate your request, it is not a valid one');
            if (callback) {
                callback({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            } else {
                return Promise.reject({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            }
        }
    },

    updateJob: function (request, callback) {
        request = _.merge(request || {}, request.httpRequest.body);
        request.options = request.options || {};
        if (!request.options.recursive) {
            request.options.recursive = request.httpRequest.get('recursive') || false;
        }
        if (request.httpRequest.params.jobCode) {
            request.query = {
                code: request.httpRequest.params.jobCode
            };
        }

        if (!UTILS.isBlank(request.query)) {
            if (callback) {
                FACADE.DefaultCronJobFacade.updateJob(request).then(success => {
                    callback(null, success);
                }).catch(error => {
                    callback(error);
                });
            } else {
                return FACADE.DefaultCronJobFacade.updateJob(request);
            }
        } else {
            this.LOG.error('Please validate your request, it is not a valid one');
            if (callback) {
                callback({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            } else {
                return Promise.reject({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            }
        }
    },

    runJob: function (request, callback) {
        if (request.httpRequest.params.jobCode) {
            request.query = {
                code: request.httpRequest.params.jobCode
            };
        }
        if (!UTILS.isBlank(request.query)) {
            if (callback) {
                FACADE.DefaultCronJobFacade.runJob(request).then(success => {
                    callback(null, success);
                }).catch(error => {
                    callback(error);
                });
            } else {
                return FACADE.DefaultCronJobFacade.runJob(request);
            }
        } else {
            this.LOG.error('Please validate your request, it is not a valid one');
            if (callback) {
                callback({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            } else {
                return Promise.reject({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            }
        }
    },

    startJob: function (request, callback) {
        request.jobCodes = [];
        if (request.httpRequest.params.jobCode) {
            request.jobCodes.push(request.httpRequest.params.jobCode);
        } else if (request.httpRequest.body instanceof Array) {
            request.jobCodes = request.httpRequest.body;
        }
        if (request.jobCodes.length > 0) {
            if (callback) {
                FACADE.DefaultCronJobFacade.startJob(request).then(success => {
                    callback(null, success);
                }).catch(error => {
                    callback(error);
                });
            } else {
                return FACADE.DefaultCronJobFacade.startJob(request);
            }
        } else {
            this.LOG.error('Please validate your request, it is not a valid one');
            if (callback) {
                callback({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            } else {
                return Promise.reject({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            }
        }
    },

    stopJob: function (request, callback) {
        request.jobCodes = [];
        if (request.httpRequest.params.jobCode) {
            request.jobCodes.push(request.httpRequest.params.jobCode);
        } else if (request.httpRequest.body instanceof Array) {
            request.jobCodes = request.httpRequest.body;
        }
        if (request.jobCodes.length > 0) {
            if (callback) {
                FACADE.DefaultCronJobFacade.stopJob(request).then(success => {
                    callback(null, success);
                }).catch(error => {
                    callback(error);
                });
            } else {
                return FACADE.DefaultCronJobFacade.stopJob(request);
            }
        } else {
            this.LOG.error('Please validate your request, it is not a valid one');
            if (callback) {
                callback({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            } else {
                return Promise.reject({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            }
        }
    },

    removeJob: function (request, callback) {
        request.jobCodes = [];
        if (request.httpRequest.params.jobCode) {
            request.jobCodes.push(request.httpRequest.params.jobCode);
        } else if (request.httpRequest.body instanceof Array) {
            request.jobCodes = request.httpRequest.body;
        }
        if (request.jobCodes.length > 0) {
            if (callback) {
                FACADE.DefaultCronJobFacade.removeJob(request).then(success => {
                    callback(null, success);
                }).catch(error => {
                    callback(error);
                });
            } else {
                return FACADE.DefaultCronJobFacade.removeJob(request);
            }
        } else {
            this.LOG.error('Please validate your request, it is not a valid one');
            if (callback) {
                callback({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            } else {
                return Promise.reject({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            }
        }
    },

    pauseJob: function (request, callback) {
        request.jobCodes = [];
        if (request.httpRequest.params.jobCode) {
            request.jobCodes.push(request.httpRequest.params.jobCode);
        } else if (request.httpRequest.body instanceof Array) {
            request.jobCodes = request.httpRequest.body;
        }
        if (request.jobCodes.length > 0) {
            if (callback) {
                FACADE.DefaultCronJobFacade.pauseJob(request).then(success => {
                    callback(null, success);
                }).catch(error => {
                    callback(error);
                });
            } else {
                return FACADE.DefaultCronJobFacade.pauseJob(request);
            }
        } else {
            this.LOG.error('Please validate your request, it is not a valid one');
            if (callback) {
                callback({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            } else {
                return Promise.reject({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            }
        }
    },

    resumeJob: function (request, callback) {
        request.jobCodes = [];
        if (request.httpRequest.params.jobCode) {
            request.jobCodes.push(request.httpRequest.params.jobCode);
        } else if (request.body instanceof Array) {
            request.jobCodes = request.httpRequest.body;
        }
        if (request.jobCodes.length > 0) {
            if (callback) {
                FACADE.DefaultCronJobFacade.resumeJob(request).then(success => {
                    callback(null, success);
                }).catch(error => {
                    callback(error);
                });
            } else {
                return FACADE.DefaultCronJobFacade.resumeJob(request);
            }
        } else {
            this.LOG.error('Please validate your request, it is not a valid one');
            if (callback) {
                callback({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            } else {
                return Promise.reject({
                    success: false,
                    code: 'ERR_FIND_00006'
                });
            }
        }
    }
};