{
    metaData: {
        name: 'cronjob',
        index: '101',
        publish: 'true',
        description: 'Module cronJob, handle schedulled execution process',
        homepage: 'http://www.nodics.com/',
        keywords: ['Nodics'],
        author: 'Nodics Framework <nodics.framework@gmail.com>',
        main: 'nodics.js',
        version: '0.0.1',
        private: true,
        license: 'GNU General Public License v3',
        scripts: {},
        repository: { type: 'git', url: 'https://github.com/Nodics/nodics.git' },
        dependencies: {}
    },
    modulePath: '/Users/baba/apps/HimProjects/nodics/core/cronjob',
    rawSchema: {
        email: {
            super: 'none',
            model: true,
            service: false,
            definition: { mailId: 'String' }
        },
        trigger: {
            super: 'none',
            model: true,
            service: false,
            definition: {
                triggerId: { type: 'String', unique: true, required: true },
                triggerName: { type: 'String' },
                triggerType: { type: 'String', enum: [Array], default: [Object] },
                isActive: { type: 'Boolean', default: false },
                second: { type: 'String' },
                minute: { type: 'String' },
                hour: { type: 'String' },
                day: { type: 'String' },
                month: { type: 'String' },
                year: { type: 'String' },
                expression: { type: 'String' }
            }
        },
        cronJob: {
            super: 'base',
            model: true,
            service: true,
            definition: {
                name: { type: 'String', unique: true, required: true },
                state: { type: 'String', enum: [Array], default: [Object] },
                lastResult: { type: 'String', enum: [Array], default: [Object] },
                lastStartTime: { type: 'Date' },
                lastEndTime: { type: 'Date' },
                lastSuccessTime: { type: 'Date' },
                clusterId: 'Number',
                priority: { type: 'Number', default: 1000 },
                runOnInit: 'Boolean',
                emails: ['schema[\'email\']'],
                triggers: ['schema[\'trigger\']'],
                jobDetail: { startNode: [Object], endNode: [Object], errorNode: [Object] }
            }
        },
        base: {
            super: 'none',
            model: false,
            service: false,
            definition: {
                code: { type: 'String', unique: true, required: true },
                creationDate: { type: 'Date', default: 2017 - 12 - 16 T04: 57: 34.917 Z },
                updatedDate: { type: 'Date', default: 2017 - 12 - 16 T04: 57: 34.917 Z },
                testProperty: { type: 'String', default: 'Nodics Framework' }
            }
        }
    },
    schemas: {
        default: {
            master: {
                email: Schema {
                    obj: [Object],
                    paths: [Object],
                    aliases: {},
                    subpaths: {},
                    virtuals: [Object],
                    singleNestedPaths: {},
                    nested: {},
                    inherits: {},
                    callQueue: [Array],
                    _indexes: [],
                    methods: {},
                    statics: [Object],
                    tree: [Object],
                    query: {},
                    childSchemas: [],
                    plugins: [Array],
                    s: [Object],
                    options: [Object],
                    '$globalPluginsApplied': true
                },
                trigger: Schema {
                    obj: [Object],
                    paths: [Object],
                    aliases: {},
                    subpaths: {},
                    virtuals: [Object],
                    singleNestedPaths: {},
                    nested: {},
                    inherits: {},
                    callQueue: [Array],
                    _indexes: [],
                    methods: {},
                    statics: [Object],
                    tree: [Object],
                    query: {},
                    childSchemas: [],
                    plugins: [Array],
                    s: [Object],
                    options: [Object],
                    '$globalPluginsApplied': true
                },
                base: Schema {
                    obj: [Object],
                    paths: [Object],
                    aliases: {},
                    subpaths: {},
                    virtuals: [Object],
                    singleNestedPaths: {},
                    nested: {},
                    inherits: {},
                    callQueue: [Array],
                    _indexes: [],
                    methods: {},
                    statics: {},
                    tree: [Object],
                    query: {},
                    childSchemas: [],
                    plugins: [],
                    s: [Object],
                    options: [Object]
                },
                cronJob: Schema {
                    obj: [Object],
                    paths: [Object],
                    aliases: {},
                    subpaths: {},
                    virtuals: [Object],
                    singleNestedPaths: {},
                    nested: [Object],
                    inherits: {},
                    callQueue: [Array],
                    _indexes: [Array],
                    methods: {},
                    statics: [Object],
                    tree: [Object],
                    query: {},
                    childSchemas: [],
                    plugins: [Array],
                    s: [Object],
                    options: [Object],
                    '$globalPluginsApplied': true
                }
            },
            test: {
                email: Schema {
                    obj: [Object],
                    paths: [Object],
                    aliases: {},
                    subpaths: {},
                    virtuals: [Object],
                    singleNestedPaths: {},
                    nested: {},
                    inherits: {},
                    callQueue: [Array],
                    _indexes: [],
                    methods: {},
                    statics: [Object],
                    tree: [Object],
                    query: {},
                    childSchemas: [],
                    plugins: [Array],
                    s: [Object],
                    options: [Object],
                    '$globalPluginsApplied': true
                },
                trigger: Schema {
                    obj: [Object],
                    paths: [Object],
                    aliases: {},
                    subpaths: {},
                    virtuals: [Object],
                    singleNestedPaths: {},
                    nested: {},
                    inherits: {},
                    callQueue: [Array],
                    _indexes: [],
                    methods: {},
                    statics: [Object],
                    tree: [Object],
                    query: {},
                    childSchemas: [],
                    plugins: [Array],
                    s: [Object],
                    options: [Object],
                    '$globalPluginsApplied': true
                },
                base: Schema {
                    obj: [Object],
                    paths: [Object],
                    aliases: {},
                    subpaths: {},
                    virtuals: [Object],
                    singleNestedPaths: {},
                    nested: {},
                    inherits: {},
                    callQueue: [Array],
                    _indexes: [],
                    methods: {},
                    statics: {},
                    tree: [Object],
                    query: {},
                    childSchemas: [],
                    plugins: [],
                    s: [Object],
                    options: [Object]
                },
                cronJob: Schema {
                    obj: [Object],
                    paths: [Object],
                    aliases: {},
                    subpaths: {},
                    virtuals: [Object],
                    singleNestedPaths: {},
                    nested: [Object],
                    inherits: {},
                    callQueue: [Array],
                    _indexes: [],
                    methods: {},
                    statics: [Object],
                    tree: [Object],
                    query: {},
                    childSchemas: [],
                    plugins: [Array],
                    s: [Object],
                    options: [Object],
                    '$globalPluginsApplied': true
                }
            }
        }
    },
    models: {
        default: {
            master: {
                EmailModel: {
                    [Function: model]
                    hooks: [Object],
                    base: [Object],
                    modelName: 'EmailModel',
                    model: [Function: model],
                    db: [Object],
                    discriminators: undefined,
                    get: [Function],
                    getById: [Function],
                    getByCode: [Function],
                    save: [Function],
                    removeById: [Function],
                    removeByCode: [Function],
                    update: [Function],
                    saveOrUpdate: [Function],
                    '$appliedHooks': true,
                    _events: [Object],
                    _eventsCount: 2,
                    schema: [Object],
                    collection: [Object],
                    Query: [Object],
                    '$__insertMany': [Function],
                    insertMany: [Function]
                },
                TriggerModel: {
                    [Function: model]
                    hooks: [Object],
                    base: [Object],
                    modelName: 'TriggerModel',
                    model: [Function: model],
                    db: [Object],
                    discriminators: undefined,
                    get: [Function],
                    getById: [Function],
                    getByCode: [Function],
                    save: [Function],
                    removeById: [Function],
                    removeByCode: [Function],
                    update: [Function],
                    saveOrUpdate: [Function],
                    '$appliedHooks': true,
                    _events: [Object],
                    _eventsCount: 2,
                    schema: [Object],
                    collection: [Object],
                    Query: [Object],
                    '$__insertMany': [Function],
                    insertMany: [Function]
                },
                CronJobModel: {
                    [Function: model]
                    hooks: [Object],
                    base: [Object],
                    modelName: 'CronJobModel',
                    model: [Function: model],
                    db: [Object],
                    discriminators: undefined,
                    get: [Function],
                    getById: [Function],
                    getByCode: [Function],
                    save: [Function],
                    removeById: [Function],
                    removeByCode: [Function],
                    update: [Function],
                    saveOrUpdate: [Function],
                    '$appliedHooks': true,
                    _events: [Object],
                    _eventsCount: 2,
                    schema: [Object],
                    collection: [Object],
                    Query: [Object],
                    '$__insertMany': [Function],
                    insertMany: [Function]
                }
            },
            test: {
                EmailModel: {
                    [Function: model]
                    hooks: [Object],
                    base: [Object],
                    modelName: 'EmailModel',
                    model: [Function: model],
                    db: [Object],
                    discriminators: undefined,
                    get: [Function],
                    getById: [Function],
                    getByCode: [Function],
                    save: [Function],
                    removeById: [Function],
                    removeByCode: [Function],
                    update: [Function],
                    saveOrUpdate: [Function],
                    '$appliedHooks': true,
                    _events: [Object],
                    _eventsCount: 2,
                    schema: [Object],
                    collection: [Object],
                    Query: [Object],
                    '$__insertMany': [Function],
                    insertMany: [Function]
                },
                TriggerModel: {
                    [Function: model]
                    hooks: [Object],
                    base: [Object],
                    modelName: 'TriggerModel',
                    model: [Function: model],
                    db: [Object],
                    discriminators: undefined,
                    get: [Function],
                    getById: [Function],
                    getByCode: [Function],
                    save: [Function],
                    removeById: [Function],
                    removeByCode: [Function],
                    update: [Function],
                    saveOrUpdate: [Function],
                    '$appliedHooks': true,
                    _events: [Object],
                    _eventsCount: 2,
                    schema: [Object],
                    collection: [Object],
                    Query: [Object],
                    '$__insertMany': [Function],
                    insertMany: [Function]
                },
                CronJobModel: {
                    [Function: model]
                    hooks: [Object],
                    base: [Object],
                    modelName: 'CronJobModel',
                    model: [Function: model],
                    db: [Object],
                    discriminators: undefined,
                    get: [Function],
                    getById: [Function],
                    getByCode: [Function],
                    save: [Function],
                    removeById: [Function],
                    removeByCode: [Function],
                    update: [Function],
                    saveOrUpdate: [Function],
                    '$appliedHooks': true,
                    _events: [Object],
                    _eventsCount: 2,
                    schema: [Object],
                    collection: [Object],
                    Query: [Object],
                    '$__insertMany': [Function],
                    insertMany: [Function]
                }
            }
        }
    }
}