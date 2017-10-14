var _ = require('lodash');
const path = require('path');
const fs = require('fs');

module.exports = {
    prepareOptions: function(options) {
        if (!options) {
            console.error('#### Please set NODICS_HOME into environment variable.')
            options = {};
            options.SERVER_PATH = process.env.SERVER_PATH || process.cwd();
            options.NODICS_HOME = process.env.NODICS_HOME || path.resolve(process.cwd(), '..');
            options.NODICS_ENV = process.env.NODICS_ENV || 'local';
            options.activeModules = ['ALL'];
            if (process.argv) {
                options.argv = process.argv;
            }
        } else {
            if (!options.SERVER_PATH) {
                options.SERVER_PATH = process.env.SERVER_PATH || process.cwd();
            }
            if (!options.NODICS_HOME) {
                options.NODICS_HOME = process.env.NODICS_HOME || path.resolve(process.cwd(), '..');
            }
            if (!options.NODICS_ENV) {
                options.NODICS_ENV = process.env.NODICS_ENV || 'local';
            }
            if (!options.activeModules) {
                options.activeModules = ['ALL'];
            } else {
                options.activeModules = ['framework', 'ncommon', 'nconfig', 'user'].concat(options.activeModules);
            }
            if (process.argv) {
                options.argv = process.argv;
            }
        }
        return options;
    },

    subFolders: function(folder) {
        return fs.readdirSync(folder)
            .filter(subFolder => fs.statSync(path.join(folder, subFolder)).isDirectory())
            .filter(subFolder => subFolder !== 'node_modules' && subFolder !== 'templates' && subFolder[0] !== '.')
            .map(subFolder => path.join(folder, subFolder));
    },

    collectModulesList: function(folder, modulePathList) {
        const hasPackageJson = fs.existsSync(path.join(folder, 'package.json'));
        if (hasPackageJson) {
            modulePathList.push(folder);
        }
        for (let subFolder of this.subFolders(folder)) {
            if (subFolder !== CONFIG.SERVER_PATH) {
                this.collectModulesList(subFolder, modulePathList);
            }
        }
    },

    isModuleActive: function(moduleName) {
        let config = CONFIG || {};
        let flag = false;
        if (config.activeModules[0] === 'ALL') {
            flag = true;
        } else if (config.activeModules.indexOf(moduleName) > -1) {
            flag = true;
        }
        return flag;
    },

    sortModulesByIndex: function(moduleIndex) {
        moduleIndex = _.groupBy(moduleIndex, function(element) {
            return parseInt(element.index);
        });
        return moduleIndex;
    },

    getModulesMetaData: function() {
        let _self = this;
        let config = CONFIG || {};
        let api = API || {};
        let moduleIndex = [];
        let metaData = {};

        var nodicsModulePath = [],
            serverModulePath = [];
        this.collectModulesList(config.NODICS_HOME, nodicsModulePath);
        this.collectModulesList(config.SERVER_PATH, serverModulePath);
        nodicsModulePath = nodicsModulePath.concat(serverModulePath);
        var counter = 0;
        nodicsModulePath.forEach(function(modulePath) {
            var moduleFile = require(modulePath + '/package.json');
            if (_self.isModuleActive(moduleFile.name)) {
                metaData[moduleFile.name] = moduleFile;
                let moduleMetaData = {};
                moduleMetaData.metaData = moduleFile;
                moduleMetaData.modulePath = modulePath;
                api[moduleFile.name] = moduleMetaData;
                if (!moduleFile.index) {
                    console.error('Please update index property in package.json for module : ', moduleFile.name);
                    process.exit(1);
                }
                if (isNaN(moduleFile.index)) {
                    console.error('Property index contain invalid value in package.json for module : ', moduleFile.name);
                    process.exit(1);
                }
                let indexData = {};
                indexData.index = moduleFile.index;
                indexData.name = moduleFile.name;
                indexData.path = modulePath;
                moduleIndex.push(indexData);
            }
        });
        config.moduleIndex = this.sortModulesByIndex(moduleIndex);
        config.metaData = metaData;
    },

    loadFiles: function(config, fileName, frameworkFile) {
        let _self = this;
        let mergedFile = frameworkFile || {};
        let moduleIndex = config.moduleIndex;
        Object.keys(moduleIndex).forEach(function(key) {
            var value = moduleIndex[key][0];
            var filePath = value.path + fileName;
            if (fs.existsSync(filePath)) {
                console.log('+++++  Loading file from : ' + filePath);
                var commonPropertyFile = require(filePath);
                mergedFile = _.merge(mergedFile, commonPropertyFile);
            }
        });
        return mergedFile;
    },

    startServers: function() {
        Object.keys(API).forEach(function(moduleName) {
            let moduleAPI = API[moduleName];
            if (moduleAPI.app) {
                const httpPort = SYSTEM.getServerPort(moduleName);
                console.log('#### Starting App for module : ', httpPort);
                moduleAPI.app.listen(httpPort);
            }
        });
    },

    getAllMethods: function(envScripts) {
        return Object.getOwnPropertyNames(envScripts).filter(function(prop) {
            return typeof envScripts[prop] == 'function';
        });
    },
};