/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

const _ = require('lodash');

module.exports = function (name, processDefinition, callback) {
    let _processId = 'id';
    let _processDefinition = processDefinition;
    let _self = this;
    let _processName = name;
    let _startNode = processDefinition.startNode;
    let _hardStop = processDefinition.hardStop || false;
    let _currentNode = {};
    let _handleError = {};
    let _nodeList = {};
    let _preNode = {};
    let _nextSuccessNode = {};
    let _nextFailureNode = {};
    let _successEndNode = {};
    let _callback = callback;
    let _done = false;
    let _nodeLog = SYSTEM.createLogger('ProcessNode');

    this.setProcessId = function (id) {
        _processId = id;
    };

    this.getProcessId = function () {
        return _processId;
    };

    this.getNodeName = function () {
        if (_currentNode) {
            return _currentNode.getName();
        }
        return null;
    };
    this.getProcessName = function () {
        return _processName;
    };
    this.buildProcess = function () {
        let _self = this;
        _.each(_processDefinition.nodes, function (value, key) {
            _nodeList[key] = new CLASSES.ProcessNode(key, value);
            _nodeList[key].LOG = _nodeLog;
        });

        if (_processDefinition.handleError) {
            if (_nodeList[_processDefinition.handleError]) {
                _handleError = _nodeList[_processDefinition.handleError];
            } else {
                _handleError = new CLASSES.ProcessNode('handleError', {
                    type: 'function',
                    process: _processDefinition.handleError
                });
                _handleError.LOG = _nodeLog;
            }
        } else {
            _handleError = _nodeList.handleError;
        }
        _successEndNode = _nodeList.successEnd;

    };

    this.prepareNextNode = function () {
        if (_currentNode.getSuccess() && !UTILS.isObject(_currentNode.getSuccess())) {
            if (_nodeList[_currentNode.getSuccess()]) {
                _nextSuccessNode = _nodeList[_currentNode.getSuccess()];
            } else {
                this.LOG.error('Process link is broken : invalid node line : ', _currentNode.getSuccess());
            }
        } else {
            _nextSuccessNode = null;
        }
        if (_currentNode.getFailure() && !UTILS.isObject(_currentNode.getSuccess())) {
            if (_nodeList[_currentNode.getFailure()]) {
                _nextFailureNode = _nodeList[_currentNode.getFailure()];
            } else {
                this.LOG.error('Process link is broken : invalid node line : ', _currentNode.getFailure());
            }
        } else {
            _nextFailureNode = null;
        }
    };

    this.nextSuccess = function (processRequest, processResponse) {
        _preNode = _currentNode;
        if (!_nextSuccessNode || _nextSuccessNode === null) {
            let targetNode = processResponse.targetNode
            this.LOG.debug('Processing target node : ', targetNode);
            processResponse.targetNode = 'none';
            if (targetNode && targetNode !== 'none' && UTILS.isObject(_currentNode.getSuccess())) {
                if (!_currentNode.getSuccess()[targetNode]) {
                    this.LOG.error('Invalid node configuration for: ' + targetNode);
                    this.error(processRequest, processResponse, 'Invalid node configuration for: ' + targetNode);
                } else {
                    _nextSuccessNode = _nodeList[_currentNode.getSuccess()[targetNode]];
                    _currentNode = _nextSuccessNode;
                    this.next(processRequest, processResponse);
                }
            }
        } else {
            _currentNode = _nextSuccessNode;
            this.next(processRequest, processResponse);
        }

    };

    this.nextFailure = function (processRequest, processResponse) {
        _preNode = _currentNode;
        if (!_nextFailureNode || _nextFailureNode === null) {
            let targetNode = processResponse.targetNode
            this.LOG.debug('Processing target node : ', targetNode);
            processResponse.targetNode = 'none';
            if (targetNode && targetNode !== 'none' && UTILS.isObject(_currentNode.getFailure())) {
                if (!_currentNode.getFailure()[targetNode]) {
                    this.LOG.error('Invalid node configuration for: ' + targetNode);
                    this.error(processRequest, processResponse, 'Invalid node configuration for: ' + targetNode);
                } else {
                    _nextFailureNode = _nodeList[_currentNode.getFailure()[targetNode]];
                    _currentNode = _nextFailureNode;
                    this.next(processRequest, processResponse);
                }
            }
        } else {
            _currentNode = _nextFailureNode;
            this.next(processRequest, processResponse);
        }
        /*
        _preNode = _currentNode;
        _currentNode = _nextFailureNode;
        this.next(processRequest, processResponse);
        */
    };

    this.stop = function (processRequest, processResponse) {
        _preNode = _currentNode;
        _currentNode = _successEndNode;
        this.next(processRequest, processResponse);
    };

    this.error = function (processRequest, processResponse, err) {
        this.LOG.debug('Error occured while processing node', _currentNode.getName(), ' - ', err);
        _preNode = _currentNode;
        _currentNode = _handleError;
        processResponse.success = false;
        processResponse.errors.PROC_ERR_0001 = {
            code: 'PROC_ERR_0001',
            message: 'PROC_ERR_0001',
            processName: _processName,
            nodeName: _preNode.getName(),
            error: err
        };
        let serviceName = _currentNode.getProcess().substring(0, _currentNode.getProcess().lastIndexOf('.'));
        let operation = _currentNode.getProcess().substring(_currentNode.getProcess().lastIndexOf('.') + 1, _currentNode.getProcess().length);
        SERVICE[serviceName][operation](processRequest, processResponse);
        if (_callback && !_done) {
            _callback();
        }
        _done = true;
    };

    this.start = function (id, processRequest, processResponse) {
        this.LOG.debug('Starting process with process id : ', id);
        _processId = id;
        _currentNode = _nodeList[_startNode];
        if (!_currentNode) {
            this.LOG.error('Node link is broken for node : ', _startNode, ' for process : ', _processName);
            process.exit(CONFIG.get('errorExitCode'));
        }
        this.next(processRequest, processResponse);
    };

    this.next = function (processRequest, processResponse) {
        let _self = this;
        if (_currentNode) {
            this.prepareNextNode();
            if (_currentNode.getType() === 'function') {
                try {
                    let serviceName = _currentNode.getProcess().substring(0, _currentNode.getProcess().lastIndexOf('.'));
                    let operation = _currentNode.getProcess().substring(_currentNode.getProcess().lastIndexOf('.') + 1, _currentNode.getProcess().length);
                    SERVICE[serviceName][operation](processRequest, processResponse, this);
                    if (!_nextSuccessNode) {
                        if (_callback && !_done) {
                            _callback();
                        }
                        _done = true;
                    }
                } catch (error) {
                    this.error(processRequest, processResponse, error);
                }
            } else {
                try {
                    SERVICE.ProcessService.startProcess(_currentNode.getProcess(), processRequest, processResponse, () => {
                        if (_hardStop && !UTILS.isBlank(processResponse.errors)) {
                            _self.nextFailure(processRequest, processResponse);
                        } else {
                            _self.nextSuccess(processRequest, processResponse, this);
                        }
                    });
                } catch (error) {
                    if (_hardStop) {
                        _self.error(processRequest, processResponse, error);
                    } else {
                        _self.nextSuccess(processRequest, processResponse, this);
                    }
                }
            }
        }
    };
};