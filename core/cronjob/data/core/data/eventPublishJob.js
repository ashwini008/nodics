/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

module.exports = {
    record0: {
        _id: '5a9e7dd88ac6ed3d73a76713',
        enterpriseCode: 'default',
        tenant: 'default',
        name: 'publishEvents',
        nodeId: 0,
        targetNodeId: 0,
        runOnInit: false,
        jobDetail: {
            startNode: 'SERVICE.EventHandlerJobService.runJob'
        },
        triggers: [{
            isActive: true,
            triggerId: 'eventPublishTrigger',
            expression: '*/2 * * * * *'
        }],
        emails: [{
            email: 'nodics.framework@nodics.com'
        }],
        active: {
            start: new Date()
        },
        priority: 1000,
        lastResult: 'NEW',
        state: 'NEW'
    }
}