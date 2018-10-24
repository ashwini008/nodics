/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

module.exports = {

    validateRequest: function (request, response, process) {
        this.LOG.debug('Validating get request: ');
        let options = request.options;
        if (options && options.projection) {
            if (!UTILS.isObject(options.projection)) {
                process.error(request, response, 'Invalid select value');
            }
        } else if (options && options.sort) {
            if (!UTILS.isObject(options.sort)) {
                process.error(request, response, 'Invalid sort value');
            }
        } else {
            process.nextSuccess(request, response);
        }
    },

    buildOptions: function (request, response, process) {
        this.LOG.debug('Building query options');
        let inputOptions = request.options || {};
        request.query = request.query || {};
        let pageSize = inputOptions.pageSize || CONFIG.get('defaultPageSize');
        let pageNumber = inputOptions.pageNumber || CONFIG.get('defaultPageNumber');
        inputOptions.limit = pageSize;
        inputOptions.skip = pageSize * pageNumber;
        inputOptions.explain = inputOptions.explain || false;
        inputOptions.snapshot = inputOptions.snapshot || false;

        if (inputOptions.timeout === true) {
            inputOptions.timeout = true;
            inputOptions.maxTimeMS = maxTimeMS || CONFIG.get('queryMaxTimeMS');
        }
        request.options = inputOptions;
        process.nextSuccess(request, response);
    },

    lookupCache: function (request, response, process) {
        this.LOG.debug('Item lookup into cache system : ', request.collection.moduleName);
        let moduleObject = NODICS.getModules()[request.collection.moduleName];
        if (moduleObject.itemCache &&
            request.collection.cache &&
            request.collection.cache.enabled) {
            request.cacheKeyHash = SERVICE.DefaultCacheService.createItemKey(request);
            SERVICE.DefaultCacheService.get({
                cache: moduleObject.itemCache,
                hashKey: request.cacheKeyHash,
                options: request.collection.cache
            }).then(value => {
                this.LOG.info('Fulfilled from Item cache');
                response.success = value;
                request.cache = 'item hit';
                process.stop(request, response);
            }).catch(error => {
                response.errors.push(error);
                process.nextSuccess(request, response);
            });
        } else {
            process.nextSuccess(request, response);
        }
    },

    applyPreInterceptors: function (request, response, process) {
        this.LOG.debug('Applying post get model interceptors');
        let moduleName = request.moduleName || request.collection.moduleName;
        let modelName = request.collection.modelName;
        let interceptors = NODICS.getInterceptors(moduleName, modelName);
        if (interceptors && interceptors.preGet) {
            SERVICE.DefaultInterceptorHandlerService.executeGetInterceptors({
                collection: request.collection,
                query: request.query,
                options: request.options,
                interceptorList: [].concat(interceptors.preGet)
            }).then(success => {
                process.nextSuccess(request, response);
            }).catch(error => {
                process.error(request, response, error);
            });
        } else {
            process.nextSuccess(request, response);
        }
    },

    executeQuery: function (request, response, process) {
        this.LOG.debug('Executing get query');
        request.collection.getItems(request).then(result => {
            response.success = result;
            request.cache = 'item mis';
            process.nextSuccess(request, response);
        }).catch(error => {
            process.error(request, response, error);
        });
    },

    populateSubModels: function (request, response, process) {
        this.LOG.debug('Populating sub models');
        let rawSchema = request.collection.rawSchema;
        let inputOptions = request.options || {};
        if (response.success &&
            response.success.length > 0 &&
            inputOptions.recursive === true &&
            !UTILS.isBlank(rawSchema.refSchema)) {
            this.populateModels(request, response, response.success, 0).then(success => {
                process.nextSuccess(request, response);
            }).catch(error => {
                process.error(request, response, error);
            });
        } else {
            process.nextSuccess(request, response);
        }
    },

    populateVirtualProperties: function (request, response, process) {
        this.LOG.debug('Populating virtual properties');
        SERVICE.DefaultVirtualPropertiesHandlerService.populateVirtualProperties(request.collection.rawSchema, response.success);
        process.nextSuccess(request, response);
    },

    applyPostInterceptors: function (request, response, process) {
        this.LOG.debug('Applying post model interceptors');
        let moduleName = request.moduleName || request.collection.moduleName;
        let modelName = request.collection.modelName;
        let interceptors = NODICS.getInterceptors(moduleName, modelName);
        if (interceptors && interceptors.postGet) {
            SERVICE.DefaultInterceptorHandlerService.executeGetInterceptors({
                collection: request.collection,
                query: request.query,
                options: request.options,
                result: response.success,
                interceptorList: [].concat(interceptors.postGet)
            }).then(success => {
                process.nextSuccess(request, response);
            }).catch(error => {
                process.error(request, response, error);
            });
        } else {
            process.nextSuccess(request, response);
        }
    },

    updateCache: function (request, response, process) {
        this.LOG.debug('Updating cache for new Items');
        let moduleObject = NODICS.getModules()[request.collection.moduleName];
        if (response.success && response.success.length &&
            moduleObject.itemCache && request.collection.cache && request.collection.cache.enabled) {
            if (request.collection.cache.ttl === undefined) {
                request.collection.cache.ttl = moduleObject.itemCache.config.ttl || 0;
            }
            SERVICE.DefaultCacheService.put({
                cache: moduleObject.itemCache,
                hashKey: request.cacheKeyHash,
                value: response.success,
                options: request.collection.cache
            }).then(success => {
                this.LOG.info('Item saved in item cache');
            }).catch(error => {
                this.LOG.error('While saving item in item cache : ', error);
            });
        }
        process.nextSuccess(request, response);
    },

    populateModels: function (request, response, models, index) {
        let _self = this;
        return new Promise((resolve, reject) => {
            let model = models[index];
            if (model) {
                _self.populateProperties(request, response, model, Object.keys(request.collection.rawSchema.refSchema)).then(success => {
                    _self.populateModels(request, response, models, index + 1).then(success => {
                        resolve(success);
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                });
            } else {
                resolve(true);
            }
        });
    },

    populateProperties: function (request, response, model, propertiesList) {
        let _self = this;
        return new Promise((resolve, reject) => {
            let property = propertiesList.shift();
            if (model[property]) {
                let refSchema = request.collection.rawSchema.refSchema;
                let propertyObject = refSchema[property];
                let query = {};
                if (propertyObject.type === 'one') {
                    query[propertyObject.propertyName] = model[property];
                } else {
                    query[propertyObject.propertyName] = {
                        '$in': model[property]
                    };
                }
                let input = {
                    tenant: request.tenant,
                    query: query
                };
                SERVICE['Default' + propertyObject.schemaName.toUpperCaseFirstChar() + 'Service'].get(input).then(result => {
                    if (result.length > 0) {
                        if (propertyObject.type === 'one') {
                            model[property] = result[0];
                        } else {
                            model[property] = result;
                        }
                    } else {
                        model[property] = null;
                    }
                    if (propertiesList.length > 0) {
                        _self.populateProperties(request, response, model, propertiesList).then(success => {
                            resolve(true);
                        }).catch(error => {
                            reject(error);
                        });
                    } else {
                        resolve(true);
                    }
                }).catch(error => {
                    reject(error);
                });

            } else {
                if (propertiesList.length > 0) {
                    _self.populateProperties(request, response, model, propertiesList).then(success => {
                        resolve(true);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    resolve(true);
                }
            }
        });
    },

    handleSucessEnd: function (request, response, process) {
        this.LOG.debug('Request has been processed successfully');
        process.resolve(response.success);
    },

    handleErrorEnd: function (request, response, process) {
        this.LOG.debug('Request has been processed and got errors');
        process.reject(response.errors);
    }
};