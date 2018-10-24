/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

const express = require('express');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    operations: {
        registerWeb: function (app, moduleObject) {
            if (moduleObject.metaData.web) {
                try {
                    moduleObject.webRootDirName = CONFIG.get('webRootDirName');
                    moduleObject.webDistDirName = CONFIG.get('webDistDirName');
                    moduleConfig = CONFIG.get(moduleObject.metaData.name);
                    moduleObject.pages = UTILS.getPages(moduleObject.metaData.name);
                    moduleObject.entryHtmlPlugins = moduleConfig.getHtmlWebpackPlugin(moduleObject);
                    let webpackConfig = moduleConfig.getWebpackConfig(moduleObject);
                    const compiler = webpack(webpackConfig);
                    app.use(require('webpack-dev-middleware')(compiler, {
                        publicPath: webpackConfig.output.publicPath,
                        writeToDisk: true
                    }));
                    app.use('/' + CONFIG.get('server').options.contextRoot + '/' + moduleObject.metaData.name, express.static(path.join(moduleObject.modulePath, '/' + moduleObject.webRootDirName)));
                } catch (error) {
                    SYSTEM.LOG.error(error);
                }
            }
        },
        get: function (app, routerDef) {
            app.route(routerDef.url).get((req, res, next) => {
                let cacheKeyHash = SYSTEM.generateHash(SERVICE.DefaultCacheService.createApiKey(req));
                SERVICE.DefaultCacheService.getApi(routerDef, cacheKeyHash, routerDef.cache).then(value => {
                    SYSTEM.LOG.info('Fulfilled from API cache');
                    res.json({
                        success: true,
                        code: 'SUC001',
                        msg: 'Processed successfully',
                        cache: 'api hit',
                        result: value
                    });
                }).catch(error => {
                    next();
                });
            }, (req, res) => {
                SERVICE.DefaultRequestHandlerPipelineService.startRequestHandlerPipeline(req, res, routerDef);
            });
        },
        post: function (app, routerDef) {
            app.route(routerDef.url).post((req, res, next) => {
                let cacheKeyHash = SYSTEM.generateHash(SERVICE.DefaultCacheService.createApiKey(req));
                SERVICE.DefaultCacheService.getApi(routerDef, cacheKeyHash, routerDef.cache).then(value => {
                    SYSTEM.LOG.info('Fulfilled from API cache');
                    res.json({
                        success: true,
                        code: 'SUC001',
                        msg: 'Processed successfully',
                        cache: 'api hit',
                        result: value
                    });
                }).catch(error => {
                    next();
                });
            }, (req, res) => {
                SERVICE.DefaultRequestHandlerPipelineService.startRequestHandlerPipeline(req, res, routerDef);
            });
        },
        delete: function (app, routerDef) {
            app.route(routerDef.url).delete((req, res) => {
                SERVICE.DefaultRequestHandlerPipelineService.startRequestHandlerPipeline(req, res, routerDef);
            });
        },
        put: function (app, routerDef) {
            app.route(routerDef.url).put((req, res) => {
                SERVICE.DefaultRequestHandlerPipelineService.startRequestHandlerPipeline(req, res, routerDef);
            });
        },
        patch: function (app, routerDef) {
            app.route(routerDef.url).patch((req, res) => {
                SERVICE.DefaultRequestHandlerPipelineService.startRequestHandlerPipeline(req, res, routerDef);
            });
        }
    },

    default: {
        commonGetterOperation: {
            getModel: {
                secured: true,
                cache: {
                    enabled: false,
                    ttl: 100,
                },
                key: '/schemaName',
                method: 'GET',
                controller: 'DefaultcontrollerName',
                operation: 'get',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/schemaName/',
                }
            },
            postModel: {
                secured: true,
                cache: {
                    enabled: false,
                    ttl: 20
                },
                key: '/schemaName',
                method: 'POST',
                controller: 'DefaultcontrollerName',
                operation: 'get',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'POST',
                    url: 'http://host:port/nodics/{moduleName}/schemaName/',
                    body: {
                        recursive: 'optional true/false - default is false',
                        pageSize: 'optional default value is 10',
                        pageNumber: 'optiona default value is 0',
                        sort: '',
                        select: '',
                        query: 'optional MongoDB based conditions can be put here, default is {}'
                    }
                }
            },
            getById: {
                secured: true,
                cache: {
                    enabled: false,
                    ttl: 20
                },
                key: '/schemaName/id/:id',
                method: 'GET',
                controller: 'DefaultcontrollerName',
                operation: 'get',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/schemaName/id/:id',
                }
            },
            getByCode: {
                secured: true,
                cache: {
                    enabled: false,
                    ttl: 20
                },
                key: '/schemaName/code/:code',
                method: 'GET',
                controller: 'DefaultcontrollerName',
                operation: 'get',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/schemaName/code/:code',
                }
            }
        },
        commonRemoveOperations: {
            remove: {
                secured: true,
                key: '/schemaName',
                method: 'DELETE',
                controller: 'DefaultcontrollerName',
                operation: 'remove',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'DELETE',
                    url: 'http://host:port/nodics/{moduleName}/schemaName/id/:id',
                }
            },
            removeById: {
                secured: true,
                key: '/schemaName/id/:id',
                method: 'DELETE',
                controller: 'DefaultcontrollerName',
                operation: 'removeById',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'DELETE',
                    url: 'http://host:port/nodics/{moduleName}/schemaName/id/:id',
                }
            },
            removeByIds: {
                secured: true,
                key: '/schemaName/id',
                method: 'DELETE',
                controller: 'DefaultcontrollerName',
                operation: 'removeById',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'DELETE',
                    url: 'http://host:port/nodics/{moduleName}/schemaName',
                    body: ['id1', 'id2', 'id3', '...id n']
                }
            },
            removeByCode: {
                secured: true,
                key: '/schemaName/code/:code',
                method: 'DELETE',
                controller: 'DefaultcontrollerName',
                operation: 'removeByCode',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'DELETE',
                    url: 'http://host:port/nodics/{moduleName}/schemaName/id/:id',
                }
            },
            removeByCodes: {
                secured: true,
                key: '/schemaName/code',
                method: 'DELETE',
                controller: 'DefaultcontrollerName',
                operation: 'removeByCode',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'DELETE',
                    url: 'http://host:port/nodics/{moduleName}/schemaName',
                    body: ['id1', 'id2', 'id3', '...id n']
                }
            }
        },
        commonSaveOperations: {
            saveModels: {
                secured: true,
                key: '/schemaName',
                method: 'PUT',
                controller: 'DefaultcontrollerName',
                operation: 'save',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'PUT',
                    url: 'http://host:port/nodics/{moduleName}/schemaName',
                    body: '{ complete model object } or [{}, {}] array of models'
                }
            }
        },
        commonUpdateOperations: {
            updateModels: {
                secured: true,
                key: '/schemaName',
                method: 'PATCH',
                controller: 'DefaultcontrollerName',
                operation: 'update',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'PATCH',
                    url: 'http://host:port/nodics/{moduleName}/schemaName',
                    body: '{ complete model object } or [{}, {}] array of models'
                }
            }
        }
    },

    common: {
        pingMe: {
            iAmLive: {
                secured: false,
                key: '/ping',
                method: 'GET',
                handler: 'DefaultPingMeController',
                operation: 'ping',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/ping',
                    body: '{ complete model object } or [{}, {}] array of models'
                }
            }
        },

        flushAPICache: {
            flushAPIKey: {
                secured: true,
                key: '/cache/api/flush/:key',
                method: 'GET',
                controller: 'DefaultCacheController',
                operation: 'flushApiCache',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/cache/api/flush/:key'
                }
            },
            flushAPIPrefix: {
                secured: true,
                key: '/cache/api/flush/:prefix',
                method: 'GET',
                controller: 'DefaultCacheController',
                operation: 'flushApiCache',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/cache/api/flush/:prefix'
                }
            },
            flushAPIAll: {
                secured: true,
                key: '/cache/api/flush',
                method: 'GET',
                controller: 'DefaultCacheController',
                operation: 'flushApiCache',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/cache/api/flush'
                }
            },
            flushAPIKeys: {
                secured: true,
                key: '/cache/api/flush',
                method: 'POST',
                controller: 'DefaultCacheController',
                operation: 'flushApiCache',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/cache/api/flush'
                }
            }
        },

        flushItemCache: {
            flushItemKey: {
                secured: true,
                key: '/cache/item/flush/key/:key',
                method: 'GET',
                controller: 'DefaultCacheController',
                operation: 'flushItemCache',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/cache/item/flush/:key'
                }
            },
            flushItemPrefix: {
                secured: true,
                key: '/cache/item/flush/prefix/:prefix',
                method: 'GET',
                controller: 'DefaultCacheController',
                operation: 'flushItemCache',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/cache/item/flush/:prefix'
                }
            },
            flushItemAll: {
                secured: true,
                key: '/cache/item/flush',
                method: 'GET',
                controller: 'DefaultCacheController',
                operation: 'flushItemCache',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/cache/item/flush'
                }
            },
            flushItemKeys: {
                secured: true,
                key: '/cache/item/flush',
                method: 'POST',
                controller: 'DefaultCacheController',
                operation: 'flushItemCache',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'GET',
                    url: 'http://host:port/nodics/{moduleName}/cache/item/flush'
                }
            }
        },

        changeCacheConfig: {
            apiConfig: {
                secured: true,
                key: '/cache/api',
                method: 'POST',
                controller: 'DefaultCacheController',
                operation: 'changeApiCacheConfiguration',
                help: {
                    message: 'not supported currently',
                }
            },
            itemConfig: {
                secured: true,
                key: '/cache/item',
                method: 'POST',
                controller: 'DefaultCacheController',
                operation: 'changeItemCacheConfiguration',
                help: {
                    requestType: 'secured',
                    message: 'authToken need to set within header',
                    method: 'POST',
                    url: 'http://host:port/nodics/{moduleName}/cache/item',
                    body: {
                        schemaName: 'like enterprise',
                        cache: {
                            enabled: 'true/false',
                            ttl: 100
                        }
                    }
                }
            }
        }
    }
};