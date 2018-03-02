/*
    Nodics - Enterprice API management framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

module.exports = {

    startRequestHandlerProcess: function(req, res, routerDef) {
        let processRequest = {
            router: routerDef,
            httpRequest: req,
            httpResponse: res,
            protocal: req.protocol,
            host: req.get('host'),
            originalUrl: req.originalUrl,
            secured: routerDef.secured,
            moduleName: routerDef.moduleName,
            special: (routerDef.controller) ? false : true
        };
        let processResponse = {};
        try {
            SERVICE.ProcessService.startProcess('requestHandlerProcess', processRequest, processResponse);
        } catch (error) {
            res.json(error);
        }
    },

    parseHeader: function(processRequest, processResponse, process) {
        console.log('   INFO: Parsing request header : ', processRequest.moduleName);
        if (processRequest.httpRequest.get('authToken')) {
            processRequest.authToken = processRequest.httpRequest.get('authToken');
        }
        if (processRequest.httpRequest.get('enterpriseCode')) {
            processRequest.enterpriseCode = processRequest.httpRequest.get('enterpriseCode');
        }
        if (!processRequest.enterpriseCode &&
            !UTILS.isBlank(processRequest.httpRequest.body) &&
            processRequest.httpRequest.body.enterpriseCode) {
            processRequest.enterpriseCode = processRequest.httpRequest.body.enterpriseCode;
        }
        process.nextSuccess(processRequest, processResponse);
    },

    parseBody: function(processRequest, processResponse, process) {
        console.log('   INFO: Parsing request body : ', processRequest.originalUrl);
        if (processRequest.httpRequest.body) {
            processRequest.body = processRequest.httpRequest.body;
        }
        process.nextSuccess(processRequest, processResponse);
    },

    handleSpecialRequest: function(processRequest, processResponse, process) {
        console.log('   INFO: Handling special request : ', processRequest.originalUrl);
        if (processRequest.special) {
            if (!processRequest.tenant) {
                processRequest.tenant = 'default';
            }
            eval(processRequest.router.handler)(processRequest, (error, response) => {
                if (error) {
                    console.log('   ERROR: got error while handling special request : ', error);
                    process.error(processRequest, processResponse, error);
                } else {
                    let cache = false;
                    if (response.cache) {
                        cache = true;
                        delete response.cache;
                    }
                    processResponse.success = true;
                    processResponse.code = 'SUC001';
                    processResponse.msg = 'Processed successfully';
                    processResponse.result = response;
                    if (processRequest.router.cache && processRequest.router.cache.enabled && processRequest.router.moduleObject.apiCache) {
                        let options = {
                            ttl: processRequest.router.ttl
                        };
                        SERVICE.CacheService.putApi(processRequest.router.moduleObject.apiCache, processRequest.httpRequest, processResponse, processRequest.router.cache).then(cuccess => {
                            if (cache) {
                                processResponse.cache = 'item hit';
                            }
                            process.stop(processRequest, processResponse);
                        }).catch(error => {
                            console.log('   ERROR: While pushing data into Item cache : ', error);
                            process.stop(processRequest, processResponse);
                        });
                    } else {
                        if (cache) {
                            processResponse.cache = 'item hit';
                        }
                        process.stop(processRequest, processResponse);
                    }
                }
            });
        } else {
            process.nextSuccess(processRequest, processResponse);
        }
    },

    redirectRequest: function(processRequest, processResponse, process) {
        console.log('   INFO: redirecting secured/non-secured request  : ', processRequest.originalUrl);
        if (processRequest.secured) {
            console.log('   INFO: Handling secured request');
            process.nextSuccess(processRequest, processResponse);
        } else {
            console.log('   INFO: Handling non-secured request');
            process.nextFailure(processRequest, processResponse);
        }
    },

    handleRequest: function(processRequest, processResponse, process) {
        console.log('   INFO: processing your request : ', processRequest.originalUrl);
        try {
            eval(processRequest.router.controller)(processRequest, (error, response) => {
                if (error) {
                    console.log('   ERROR: got error while processing request : ', error);
                    processResponse.success = false;
                    delete processResponse.result;
                    delete processResponse.msg;
                    delete processResponse.code;
                    processResponse.errors.PROC_ERR_0003 = {
                        code: 'ERR003',
                        msg: error.toString()
                    };
                    process.nextFailure(processRequest, processResponse);
                } else {
                    let cache = false;
                    if (response.cache) {
                        cache = true;
                        delete response.cache;
                    }
                    processResponse.success = true;
                    processResponse.code = 'SUC001';
                    processResponse.msg = 'Processed successfully';
                    processResponse.result = response;
                    if (processRequest.router.cache && processRequest.router.cache.enabled && processRequest.router.moduleObject.apiCache) {
                        let options = {
                            ttl: processRequest.router.ttl
                        };
                        SERVICE.CacheService.putApi(processRequest.router.moduleObject.apiCache, processRequest.httpRequest, processResponse, processRequest.router.cache).then(cuccess => {
                            if (cache) {
                                processResponse.cache = 'item hit';
                            } else {
                                processResponse.cache = 'mis';
                            }
                            process.nextSuccess(processRequest, processResponse);
                        }).catch(error => {
                            console.log('   ERROR: While pushing data into Item cache : ', error);
                            process.nextSuccess(processRequest, processResponse);
                        });
                    } else {
                        if (cache) {
                            processResponse.cache = 'item hit';
                        } else {
                            processResponse.cache = 'mis';
                        }
                        process.nextSuccess(processRequest, processResponse);
                    }
                }
            });
        } catch (error) {
            console.log('   ERROR: got error while service request : ', error);
            processResponse.success = false;
            delete processResponse.result;
            delete processResponse.msg;
            delete processResponse.code;
            processResponse.errors.PROC_ERR_0003 = {
                code: 'ERR003',
                msg: error.toString()
            };
            process.nextFailure(processRequest, processResponse);
        }
    },

    handleSucessEnd: function(processRequest, processResponse) {
        console.log('   INFO: Request has been processed successfully : ', processRequest.originalUrl);
        processRequest.httpResponse.json(processResponse);
    },

    handleFailureEnd: function(processRequest, processResponse) {
        console.log('   INFO: Request has been processed with some failures : ', processRequest.originalUrl);
        processRequest.httpResponse.json(processResponse);
    },

    handleErrorEnd: function(processRequest, processResponse) {
        console.log('   INFO: Request has been processed and got errors : ', processRequest.originalUrl);
        processRequest.httpResponse.json(processResponse);
    }
};