/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

module.exports = {

    publishTokenExpiredEvent: function (key, value, options) {
        this.LOG.debug('Auth token key has been expired: ' + key);
        /*let _self = this;
        let event = {
            enterpriseCode: value.enterprise.code,
            tenant: value.enterprise.tenant.code,
            event: 'invalidateAuthToken',
            source: options.moduleName,
            target: options.moduleName,
            state: 'NEW',
            type: 'SYNC',
            targetType: ENUMS.TargetType.EACH_NODE.key,
            params: [{
                key: key
            }]
        };
        _self.LOG.debug('Pushing event for expired cache key : ', key);
        SERVICE.DefaultEventService.publish(event, (error, response) => {
            if (error) {
                _self.LOG.error('While posting cache invalidation event : ', error);
            } else {
                _self.LOG.debug('Event successfully posted : ');
            }
        });*/
    },

    publishTokenDeletedEvent: function (key, value, options) {
        this.LOG.debug('Auth token key has been deleted: ' + key);
    },

    publishTokenFlushedEvent: function (options) {
        this.LOG.debug('Auth token keys has been flushed');
    }
};