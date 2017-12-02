/*
    Nodics - Enterprice API management framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

const bodyParser = require('body-parser');

module.exports = {
    default: {
        initProperties: function(app) {
            /* app.use(function(req, res, next) {
                 console.log('======================== > ');
                 next('Done initProperties');
             });*/
        },
        initSession: function(app) {
            //console.log(' Default initSession');
        },
        initLogger: function(app) {
            //console.log(' Default initLogger');
        },
        initCache: function(app) {
            // console.log(' Default initCache');
        },
        initBodyParser: function(app) {
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());
            //console.log(' Default initBodyParser');
        },
        initHeaders: function(app) {
            //console.log(' Default initHeaders');
        },
        initErrorRoutes: function(app) {
            /*app.use(function(param, req, res, next) {
                console.log('----------------------- > ', param);
                next('This is custom value');
            });*/
        },
        initExtras: function(app) {

        }
    }
};