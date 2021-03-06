/*
    Nodics - Enterprice Micro-Services Management Framework

    Copyright (c) 2017 Nodics All rights reserved.

    This software is the confidential and proprietary information of Nodics ("Confidential Information").
    You shall not disclose such Confidential Information and shall use it only in accordance with the 
    terms of the license agreement you entered into with Nodics.

 */

module.exports = {

    isObject: function (value) {
        return Object.prototype.toString.call(value) == "[object Object]";
    },

    isArray: function (value) {
        return value instanceof Array;
    },

    isBlankArray: function (value) {
        return (value instanceof Array && !value[0]);
    },

    isArrayOfObject: function (value) {
        return this.isArray(value) && this.isObject(value[0]) && !this.isObjectId(value[0]);
    },

    isObjectId: function (value) {
        return (this.isObject(value) && value._bsontype && value._bsontype === 'ObjectID');
    },

    createModelName: function (modelName) {
        var name = modelName.toUpperCaseFirstChar() + 'Model';
        return name;
    },

    getModelName: function (modelName) {
        var name = modelName.toUpperCaseFirstChar().replace("Model", "");
        return name;
    },
};