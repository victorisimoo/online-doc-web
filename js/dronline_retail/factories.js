materialAdmin
    .factory('PatientResource', ['$resource', 'patientApi', 'adminApi', function ($resource, patientApi, adminApi) {
        var baseURL = patientApi + 'patient/';
        var resource = $resource(baseURL + ':patientId', {
            patientId: '@id'
        }, {
            'findAll': { method: 'GET', isArray: false },
            'find': { method: 'GET', isArray: false },
            'update': { method: 'PUT' }
        });
        return resource;
    }])
    .factory('BillingResource', ['$resource', 'billingApi', 'adminApi', function ($resource, billingApi, adminApi) {
        var baseURL = billingApi + 'billingTransaction/:billingTransactionId';
        var resource = $resource(baseURL, {}, {
            'parameterByName': { url: adminApi + 'parameter/findByName?name=:parameterName', method: 'GET', isArray: false },
            'saveTransaction': { url: billingApi +'billingTransaction/cryptedTransaction', method: 'POST', isArray: false }, 
            'saveTransactionPowerTranz': { url: billingApi + 'powertranz/sale', method: 'POST', isArray: false },
            'autorizationStatusPowerTranz' : { url: billingApi + 'transaction/autorizacion-status/:transactionIdentifier', method: 'POST', isArray: true }
        });
        return resource;
    }])
    .factory('SubscriptionResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'subscription/:userId';
        var resource = $resource(baseURL, {}, {
            'demo':{ url: patientApi + 'subscription/demo/:typeDemo', method:'GET', isArray:false},
            'tokenValidate': { url: patientApi + "subscription/validate-coupon", method: 'POST' },
            'information': {url: patientApi + 'subscription/information', method:'GET', isArray:false}
        });
        return resource;
    }])
    .factory('LoginResource', ['$resource', 'authApi', function ($resource, authApi) {
        var baseURL = authApi + 'auth/cryptedPatient';
        var resource = $resource(baseURL, {}, {
            'login': { method: 'POST', isArray: false }
        });
        return resource;
    }])
    .factory('PatProfileResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'profile/:profileId';
        var resource = $resource(baseURL, {
            profileId: '@id'
        }, {
            'find': { method: 'GET', isArray: false },
            'updateContactInformation': { url: patientApi + 'profile/update-contact-information', method: 'PUT', isArray: false },
            'update': { method: 'PUT' }
        });
        return resource;
    }])
    .factory('RestorePasswordResource', ['$resource', 'authApi', function ($resource, authApi) {
        var baseURL = authApi;
        var resource = $resource(baseURL, {}, {
            'restoreWithToken': { url: authApi + 'password/restoreToken', method: 'POST', isArray: false }
        });
        return resource;
    }]);