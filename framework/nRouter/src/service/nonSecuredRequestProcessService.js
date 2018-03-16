module.exports = {

    validateEnterpriseCode: function(request, response, process) {
        console.log('   INFO: Validating Enterprise code : ', request.local.enterpriseCode);
        if (UTILS.isBlank(request.local.enterpriseCode)) {
            console.log('   ERROR: Enterprise code can not be null');
            process.error(request, response, 'Enterprise code can not be null');
        } else {
            process.nextSuccess(request, response);
        }
    },

    loadEnterpriseCode: function(request, response, process) {
        console.log('   INFO: Loading Enterprise code : ', request.local.enterpriseCode);
        try {
            SERVICE.EnterpriseProviderService.loadEnterprise(request, (error, response) => {
                if (error) {
                    console.log('   ERROR: Enterprise code is not valid');
                    process.error(request, response, error || 'Enterprise code is not valid');
                } else {
                    request.local.enterprise = response;
                    request.local.tenant = response.tenant;
                    process.nextSuccess(request, response);
                }
            });
        } catch (error) {
            console.log('   ERROR: Enterprise code is not valid');
            process.error(request, response, error || 'Enterprise code is not valid');
        }
    },

    validateTenantId: function(request, response, process) {
        console.log('   INFO: Validating Tenant Id : ', request.local.tenant);
        try {
            if (UTILS.isBlank(request.local.tenant)) {
                console.log('   ERROR: Tenant is null or invalid');
                process.error(request, response, 'Tenant is null or invalid');
            } else {
                process.nextSuccess(request, response);
            }
        } catch (err) {
            process.error(request, response, 'Tenant is null or invalid');
        }
    }
};