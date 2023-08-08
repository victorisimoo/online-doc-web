materialAdmin.factory('PatientResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'patient/';
        var resource = $resource(baseURL + ':patientId',
            {patientId: '@id'},
            {
                'findAll': {method: 'GET', isArray: true},
                'find': {method: 'GET', isArray: false},
                'update': {method: 'PUT'}
                
            }
        );

    return resource;
}]);