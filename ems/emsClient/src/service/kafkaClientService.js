/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

const kafka = require('kafka-node');

module.exports = {

    publisher: {},
    consumerPool: {},

    init: function(config) {
        let _self = this;
        return new Promise((resolve, reject) => {
            if (!config.options) {
                reject('ERROR: Kafka configuration is not valid');
            }
            try {
                const client = new kafka.KafkaClient(config.options);
                if (client) {
                    console.log('   INFO: Kafka client is connected : ');
                    this.createPublisher(client, config).then(producer => {
                        _self.publisher = producer;
                        let consumers = [];
                        config.queues.forEach(queue => {
                            if (queue.outputQueue) {
                                consumers.push(_self.createConsumer(client, config, queue));
                            }
                        });
                        if (consumers.length > 0) {
                            Promise.all(consumers).then(success => {
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
                    reject('   ERROR: While creating Kafka client');
                }
            } catch (error) {
                reject(error);
            }
        });
    },

    createPublisher: function(client, config) {
        let _self = this;
        return new Promise((resolve, reject) => {
            try {
                let producer;
                if (config.publisherType === 0) {
                    producer = new kafka.Producer(client);
                } else if (config.publisherType === 1) {
                    producer = new kafka.HighLevelProducer(client);
                } else {
                    console.log('   ERROR: Invalid publisher type : ' + config.publisherType);
                    reject('   ERROR: Invalid publisher type : ' + config.publisherType);
                }
                if (producer) {
                    producer.on("ready", function() {
                        console.log("   INFO: Kafka Producer is connected and ready.");
                        resolve(producer);
                    });
                    producer.on("error", function(error) {
                        console.error('   ERROR: While creating kafka publisher : ' + error);
                        reject('   ERROR: While creating kafka publisher : ' + error);
                    });
                }

            } catch (error) {
                console.log(error);
                reject('  ERROR: while creating consumer for queue : ' + queue.inputQueue);
            }
        });
    },

    createConsumer: function(client, config, queue) {
        let _self = this;
        return new Promise((resolve, reject) => {
            try {
                const topics = [{
                    topic: queue.outputQueue
                }];
                let consumer;
                if (config.consumerType === 0) {
                    consumer = new kafka.Consumer(client, topics, queue.consumerOptions);
                } else if (config.consumerType === 1) {
                    consumer = new kafka.HighLevelConsumer(client, topics, queue.consumerOptions);
                } else {
                    console.log('   ERROR: Invalid publisher type : ' + config.publisherType);
                    reject('   ERROR: Invalid publisher type : ' + config.publisherType);
                }
                if (consumer) {
                    consumer.on("message", function(response) {
                        _self.onConsume(response, queue);
                    });
                    consumer.on("error", function(message) {
                        console.log('   ERROR: Kafka Consumer got discunnected...');
                    });
                    console.log('   INFO: Registered consumer for queue : ', queue.inputQueue);
                    resolve(true);
                } else {
                    reject('  ERROR: while creating consumer for queue : ' + queue.inputQueue);
                }
            } catch (error) {
                console.log(error);
                reject('  ERROR: while creating consumer for queue : ' + queue.inputQueue);
            }
        });
    },

    onConsume: function(response, queue) {
        try {
            var buf = new Buffer(response.value, "binary");
            let message = JSON.parse(buf.toString());
            let event = {
                enterpriseCode: message.enterpriseCode || 'default',
                event: queue.outputQueue,
                source: 'kafkaMessageConsumed',
                target: queue.targetModule,
                clusterId: queue.clusterId,
                state: "NEW",
                type: "ASYNC",
                params: [{
                    key: 'message',
                    value: JSON.stringify(message)
                }]
            };
            console.log('   INFO: Pushing event for recieved message from  : ', queue.inputQueue);
            SERVICE.EventService.publish(event);
        } catch (error) {
            console.log('   ERROR: Could not parse message recieved from queue : ', queue.inputQueue, ' : ERROR: ', error);
        }
    },

    publish: function(payload) {
        return new Promise((resolve, reject) => {
            if (UTILS.isBlank(this.publisher)) {
                reject('   ERROR: Could not found a valid publisher instance');
            } else {
                try {
                    let message = {
                        topic: payload.queue,
                        messages: payload.messages,
                        partition: payload.partition || 0
                    };
                    this.publisher.send(payloads, function(err, data) {
                        resolve(true);
                    });
                } catch (error) {
                    reject('   ERROR: Either queue name : ' + queueName + ' is not valid or could not created publisher');
                }
            }
        });
    }
};