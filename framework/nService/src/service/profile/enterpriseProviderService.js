/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

module.exports = {

    loadEnterprise: function(request, callback) {
        let options = {
            moduleName: 'profile',
            methodName: 'POST',
            apiName: 'enterprise/get',
            requestBody: {},
            isJsonResponse: true,
            header: {
                enterpriseCode: request.local.enterpriseCode
            }
        };
        let requestUrl = SERVICE.ModuleService.buildRequest(options);
        SERVICE.ModuleService.fetch(requestUrl, (error, response) => {
            if (error) {
                callback(error, null);
            } else if (!response.success) {
                callback(error, null);
            } else {
                callback(null, response.result[0]);
            }
        });
    }
};