/*
    Nodics - Enterprice API management framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

const FRAMEWORK = require('./framework');

module.exports = {
    start: (function() {
        console.log('Starting Nodics Server');
        FRAMEWORK.startNodics({});
    })(),
    /*
        startNodics: function(options) {
            FRAMEWORK.startNodics(options);
        },
    */
};