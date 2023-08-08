materialAdmin
    .factory('PatientResource', ['$resource', 'patientApi', 'adminApi', function ($resource, patientApi, adminApi) {
        var baseURL = patientApi + 'patient/';
        var resource = $resource(baseURL + ':patientId', {
            patientId: '@id'
        }, {
            'findAll': { method: 'GET', isArray: false },
            'find': { method: 'GET', isArray: false },
            'update': { method: 'PUT' },
            'requestPhone': { url: patientApi + 'patient/request-phone/:medicalId', method: 'GET' },
            'updatePhone': { url: patientApi + 'patient/update-phone', method: 'POST' },
            'getCorporateAds': { url: patientApi + 'corporate-ads/:corpDomain', method: 'GET', isArray: true },
            'checkAttentionTime': { url: adminApi + 'parameter/checkAttentionTime?corporateName=:corpName', method: 'GET', isArray: false },
            'parameterByName': { url: adminApi + 'parameter/findByName?name=:parameterName', method: 'GET', isArray: false },
            'sendAdNotification': { url: patientApi + 'corporate-ads/sendAdNotification', method: 'POST' },
            'findTips': { url: patientApi + 'patient/findTips', method: 'GET', isArray: true }
        });
        return resource;
    }])
    .factory('FollowupResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'followup/';
        var resource = $resource(baseURL + ':patientId', {}, {
            'cancel': { url: baseURL+'cancel', method: 'PUT', isArray: false },
            'getProfileFollowup': { url: baseURL+':profileId', method: 'GET', isArray: false }
        });
        return resource;
    }])
    .factory('SpecialityResource', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'speciality/';
        var resource = $resource(baseURL + ':specialityId', {
            specialityId: '@id'
        }, {
            'findAll': { url: doctorApi + 'speciality/findByCorporate', method: 'GET', isArray: true },
            'find': { method: 'GET', isArray: false },
            'update': { method: 'PUT' }
        });
        return resource;
    }])
    .factory('BillingResource', ['$resource', 'billingApi', 'adminApi', function ($resource, billingApi, adminApi) {
        var baseURL = billingApi + 'billingTransaction/:billingTransactionId';
        var resource = $resource(baseURL, {}, {
            'updateCardToken': { url: billingApi + 'billingTransaction/updateCard', method: 'POST' },
            'cancel': { url: billingApi + 'billingTransaction/cancel/:userId', method: 'GET' },
            'parameterByName': { url: adminApi + 'parameter/findByName?name=:parameterName', method: 'GET', isArray: false }
        });
        return resource;
    }])
    .factory('ConfirmResource', ['$resource', 'billingApi', function ($resource, billingApi) {
        var baseURL = billingApi + 'billingTransaction/confirm/';
        var resource = $resource(baseURL + ':confirmTransactionId', {
            confirmTransactionId: '@id'
        }, {});
        return resource;
    }])
    .factory('AppointmentResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'medical-appointment/';
        var resource = $resource(baseURL + ':medicalAppointmentId', {
            medicalAppointmentId: '@id'
        }, {
            'find': { method: 'GET', isArray: false },
            'findById': { url: baseURL + 'find-by-id/:medicalAppointmentId', method: 'GET', isArray: false },
            'findConnect': { url: baseURL + 'find-connect', method: 'GET', isArray: false },
            'findMessage': { url: baseURL + 'waiting-message/:medicalAppointmentId', method: 'GET', isArray: false },
            'findCallbackOrInvitation': { url: baseURL + 'find-callback/:userId?appCorporateVersionId=:appCorporateVersionId&deviceId=:deviceId&termsAccepted=:termsAccepted', method: 'GET', isArray: false },
            'declineInvitation': { url: baseURL + 'decline-invitation/:invitationId', method: 'GET', isArray: false },
            'getAppointmentStatus': { url: baseURL + 'getAppointmentStatus/:medicalAppointmentId', method: 'GET', isArray: false },
            'getAppointmentInformation': {url: baseURL + 'appointment-information/:medicalAppointmentId', method: 'GET', isArray: false}
        });
        return resource;
    }])
    .factory('AppointmentDrResource', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'medical-appointment/';
        var resource = $resource(baseURL + ':medicalAppointmentId', {
            medicalAppointmentId: '@id'
        }, {
            'find': { method: 'GET', isArray: false },
            'getQueueSize': { url: doctorApi + 'doctor/getQueueCount/:doctorId', method: 'GET', isArray: false },
            'getAppointmentStatus': { url: baseURL + 'getAppointmentStatus/:medicalAppointmentId', method: 'GET', isArray: false },
            'endMedicalAppointment': { url: doctorApi + 'doctor/end-medical-appointment', method: 'POST', isArray: false },
            'findCorporateDrugstore': { url: baseURL + 'findDrugstore/:id', method: 'GET', isArray: true }
        });
        return resource;
    }])
    .factory('UpdatePatientEmailResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'patient/';
        var resource = $resource(baseURL, {}, {
            'requestUpdateEmail': { url: baseURL + 'request-update-email', method: 'GET', isArray: false },
            'responseUpdateEmail': { url: baseURL + 'response-update-email', method: 'POST' }
        });
        return resource;
    }])
    .factory('DoctorResource', ['$resource', 'doctorApi', 'adminApi', function ($resource, doctorApi, adminApi) {
        var baseURL = doctorApi + 'doctor/';
        var resource = $resource(baseURL + ':doctorId', {
            doctorId: '@id'
        }, {
            'find': { method: 'GET', isArray: false },
            'update': { method: 'PUT' },
            'findParameterByName': { url: doctorApi + 'parameter/findByName?name=:parameterName', method: 'GET' },
            'updateHeartbeat': { url: baseURL + 'updateHeartbeat/:doctorId', method: 'GET' },
            'getParameters': { url: adminApi + 'corporateparameter/:corporateId', method: 'GET', isArray: true },
            'logout': { url: baseURL + 'logout/:doctorId', method: 'GET' },
            'unprocessedAppointments': { url: baseURL + 'unprocessed-appointment/:doctorId', method: 'GET', isArray: true },
            'confirmInformation': { url: baseURL + 'confirm-information', method: 'POST' },
            'getCommonIssuesList': { url: baseURL + 'getCommonIssues/:serviceType', method: 'GET', isArray: true },
            'checkDate' : {url: doctorApi + "schedule/doctorList", method: 'POST', isArray: true},
            'getQueue' : {url: baseURL + "getDoctorQueue", method: 'GET', isArray: true},
            'getExportAccount': { url: doctorApi + 'doctor/export-account', method: 'POST', isArray: false },
            'deleteAccountData': { url: doctorApi + 'doctor/delete-account', method: 'POST', isArray: false },
            'requestAppointment' : {url: doctorApi + "schedule", method: 'POST'},

        });
        return resource;
    }])
    .factory('DoctorSessionResource', ['$resource', 'doctorApi', function ($resource, doctorApi){
        var baseURL = doctorApi + 'doctor-session/';
        var resource = $resource(baseURL, {},
            {
            'updateSpeedAndBrowser': { url: baseURL + 'updateBrowserAndSpped/:speed/:browser', method: 'GET', isArray: false},
            'lastHeartbeat': {url: baseURL + 'lastheartbeat', method: 'GET', isArray: false},
            'logout': {url: baseURL + 'logout', method: 'GET', isArray: false},
            'actionHistory': { url: baseURL + 'action/:idAction', method: 'GET', isArray: false}
        });
        return resource;
    }])
    .factory('ParameterResource', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'doctor/';
        var resource = $resource(baseURL + ':doctorId', {
            doctorId: '@id'
        }, {
            'find': { method: 'GET', isArray: false },
            'update': { method: 'PUT' },
            'findParameterByName': { url: doctorApi + 'parameter/findByName?name=:parameterName', method: 'GET' }
        });
        return resource;
    }])
    .factory('RatingResource', ['$resource', 'ratingApi', function ($resource, ratingApi) {
        var baseURL = ratingApi + 'aspect-score/';
        var resource = $resource(baseURL, {
            doctorId: '@id'
        }, {
            'rateDoctor': { url: baseURL + 'doctor', method: 'POST' },
            'ratePatient': { url: baseURL + 'patient', method: 'POST' },
            'getRandom': { url: ratingApi + 'aspect-category/default', method: 'GET' }
        });
        return resource;
    }])
    .factory('PatProfileResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'profile/:profileId';
        var resource = $resource(baseURL, {
            profileId: '@id'
        }, {
            'findAll': { method: 'GET', isArray: true },
            'find': { method: 'GET', isArray: false },
            'update': { method: 'PUT' },
            'createQuickbloxUser': { url: patientApi + 'profile/create-quickblox-user', method: 'POST', isArray: false },
            'updateContactInformation': { url: patientApi + 'profile/update-contact-information', method: 'PUT', isArray: false },
            'lastAppointment': { url: patientApi + 'profile/last-appointment/:profileId', method: 'GET', isArray: false },
            'getExportAccount': { url: patientApi + 'patient/export-account', method: 'POST', isArray: false },
            'deleteAccountData': { url: patientApi + 'patient/delete-account', method: 'POST', isArray: false }
        });
        return resource;
    }])
    .factory('KinshipResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'kinship';
        var resource = $resource(baseURL, {}, {
            'findAll': { url: patientApi+'kinship/findByCorporate', method: 'GET', isArray: true }
        });
        return resource;
    }])
    .factory('PasswordResource', ['$resource', 'authApi', function ($resource, authApi) {
        var baseURL = authApi + 'password/change';
        return $resource(baseURL);
    }])
    .factory('LoginResource', ['$resource', 'authApi', function ($resource, authApi) {
        var baseURL = authApi + 'auth/';
        var resource = $resource(baseURL, {}, {
            'login': {url: baseURL+'patient', method: 'POST'},
            'logout': {url: baseURL+'logout', method: 'GET'}
        });
        return resource;
    }])
    .factory('RestorePasswordResource', ['$resource', 'authApi', function ($resource, authApi) {
        var baseURL = authApi;
        var resource = $resource(baseURL, {}, {
            'restore': { url: authApi + 'password/restore', method: 'POST', isArray: false },
        });
        return resource;
    }])
    .factory('ValidatorPassword', ['$resource', 'authApi','adminApi', function ($resource, authApi, adminApi) {
        var baseURL = authApi;
        var resource = $resource(baseURL, {}, {
            'validator': { url: authApi + 'password/validator', method: 'POST', isArray: false },
            'setStatus': { url: authApi + 'password/setValidator', method: 'POST', isArray: false },
            'loginValidator': { url: authApi + 'auth/validator-password', method: 'POST', isArray: false },
            'confirmResetPassword': { url: adminApi + 'adm-user/confirmResetPassword', method: 'POST', isArray: false }
        });
        return resource;
    }])
    .factory('ReportIssueResource', ['$resource', 'ratingApi', function ($resource, ratingApi) {
        var baseURL = ratingApi + 'report-issue';
        return $resource(baseURL);
    }])
    .factory('PhotoResource', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'fileItem';
        var resource = $resource(baseURL, {}, {
            'edit': { method: 'PUT', isArray: true }
        });
        return resource;
    }])
    .factory('ClinicalHistoryCategoryResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'clinical-history-categoy/:profileId';
        var resource = $resource(baseURL, {}, {
            'findAll': { method: 'GET', isArray: true },
            'historyLog': {url: patientApi + 'profile/historyLog/:profileId', method: 'GET', isArray: true}
        });
        return resource;
    }])
    .factory('SubscriptionResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'subscription/:userId';
        var resource = $resource(baseURL, {}, {
            'find': { method: 'GET', isArray: false },
            'information': {url: patientApi + 'subscription/information', method:'GET', isArray:false},
            'demo':{ url: patientApi + 'subscription/demo', method:'POST', isArray:false},
            'findAll': { url: patientApi + 'subscription/packages/:currency/:userId', method: 'GET', isArray: true },
            'tokenValidate': { url: patientApi + "subscription/validate-coupon", method: 'POST' },
            'findCurrency': { url: patientApi + "subscription/currency", method: 'GET', isArray: true }
        });
        return resource;
    }])
    .factory('IntegrationResource', ['$resource', 'integrationApi', function ($resource, integrationApi) {
        var baseURL = integrationApi + 'landingpage/:msisdn/:resource';
        var resource = $resource(baseURL, {}, {
            'find': { method: 'GET', isArray: false }
        });
        return resource;
    }])
    .factory('SessionResource', ['$resource', 'callApi', function ($resource, callApi) {
        var baseURL = callApi + 'sessioncall/createLog';
        var resource = $resource(baseURL, {}, {
            'createLog': { method: 'POST' }
        });
        return resource;
    }])
    .factory('DeviceResource', ['$resource', 'messageApi', function ($resource, messageApi) {
        var baseURL = messageApi + 'device';
        var resource = $resource(baseURL, {}, {
            'registerDevice': { method: 'POST' },
            'unregisterDevice': { url: messageApi + 'device/remove/:token', method: 'GET', isArray: false }
        });
        return resource;
    }])
    .factory('MedicalConsultationResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'medical-consultation/:profileId';
        var resource = $resource(baseURL, {}, {
            'findAll': { method: 'GET', isArray: false },
            'findByMedicalAppointmentId': {
                url: patientApi + 'medical-consultation/find-by-medicalAppointmentId/:medicalAppointmentId',
                method: 'GET',
                isArray: false
            },
            'findPdfByMedicalAppointmentId': {
                url: patientApi + 'medical-consultation/find-pdf-by-medicalAppointmentId/:medicalAppointmentId',
                method: 'GET',
                isArray: false
            }
        });
        return resource;
    }])
    .factory('AppointmentInformationResource', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'appointment-information';
        var resource = $resource(baseURL, {}, {
            'update': { method: 'PUT' }
        });
        return resource;
    }])
    .factory('MedicalPrescriptionResource', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'medical-prescription/';
        var resource = $resource(baseURL, {}, {
            'getComponents': {url: baseURL+'component-builder' , method: 'GET', isArray: true },
            'findMedicamentPresentation': {url: baseURL+'medical-presentation' , method: 'GET', isArray: true },
            'findMedicamentType': {url: baseURL+'medical-type' , method: 'GET', isArray: true },
            'findMedicamentDose': {url: baseURL+'medical-dose' , method: 'GET', isArray: true },
            'findMedicamentByName': {url: baseURL+'getMonodrugPresentation/:name/:corporateId' , method: 'GET', isArray: true },
            'findMedicamentByMonodrugOrPresentation': {url: baseURL+'getMonodrugOrPresentation/:description/:corporateId/:type' , method: 'GET', isArray: true },
            'findMedicamentByDescriptionOld': {url: baseURL+'getMedicine/:name' , method: 'GET', isArray: true },
            'sendPrescription': {url: baseURL+'vivawellPrescription' , method: 'POST', isArray: false },
            'sendMedicaments': {url: baseURL+'medical-medicaments' , method: 'POST', isArray: false },
            'findMedicamentByDescription': {url: baseURL+'getPresentation/:name/:idMonodrogrug' , method: 'GET', isArray: true },
        });
        return resource;
    }])
    .factory('CorporateInformationConfiguration', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'doctor/';
        var resource = $resource(baseURL, {}, {
            'getInformation': {url: baseURL+'doctorCorporateList/:id' , method: 'GET', isArray: true },
        });
        return resource;
    }])
    .factory('DiseaseResource', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'disease/';
        var resource = $resource(baseURL, {}, {
            'find': {url: baseURL+':corporateId/:name' , method: 'GET', isArray: true }
        });
        return resource;
    }])
    .factory('DiseaseResourceLaboratory', ['$resource', 'doctorApi', function ($resource, doctorApi) {
        var baseURL = doctorApi + 'laboratory/';
        var resource = $resource(baseURL, {}, {
            'find': {url: baseURL+':name/:corporateId' , method: 'GET', isArray: true }
        });
        return resource;
    }])
    .factory('ExportAccountResource', ['$resource', 'patientApi', function ($resource, patientApi) {
        var baseURL = patientApi + 'patient/';
        /* var resource = $resource(baseURL, {}, {
            'responseUpdateEmail': { url: baseURL + 'response-update-email', method: 'POST' }
        });
        return resource; */
        console.log($resource, patientApi)
    }])
    .factory('TranslationResource', ['$resource', 'adminApi', function ($resource, adminApi) {
        var baseURL = adminApi + 'translations';
        var resource = $resource(baseURL, {}, {
            'find': { method: 'POST' }
        });
        return resource;
    }])
    .factory('AttachmentResource', ['$resource', 'adminApi', function ($resource, adminApi) {
        var baseURL = adminApi + 'attachment/';
        var resource = $resource(baseURL, {}, {
            'getAttachment': { url: baseURL + ":attachmentId", method: 'GET' },
            'requestUpload': { url: baseURL + "requestUpload/:appointmentId", method: 'GET' },
            'getAppointmentAttachments': { url: baseURL + "appointment/:appointmentId", method: 'GET', isArray: true },
            'getProfileAttachments': { url: baseURL + "profile/:profileId", method: 'GET', isArray: true },
            'getAttachmentById': { url: baseURL + "profileId/:attachmentId/:profileId", method: 'GET'},

            'getOrderedAttachments': {url: baseURL+'orderedAttachmnets' , method: 'POST', isArray: true },
        });
        return resource;
    }])
    .factory('ScheduleResource', ['$resource', 'appointmentApi', function ($resource, appointmentApi) {
        var baseURL = appointmentApi;
        var resource = $resource(baseURL, {}, {
            'find': {url: baseURL+"scheduler-appointment/:idAppointment",  method: 'GET' },
            'getAppointmentList': {url: baseURL+"scheduler-appointment/scheduller-appointment-day",  method: 'POST', isArray: true},
            'getAppointmentListDoctor': {url: baseURL+"scheduler-appointment/scheduller-doctor-appointment-day",  method: 'POST', isArray: true},
            'save': { url: baseURL +"scheduler-appointment", method: 'POST'},
            'getAppointmentBlocks': {url: baseURL + "scheduler-appointment/timeBlocks", method: 'POST', isArray: true}
        });
        return resource;
    }])
    .factory('ConfigurationCorporate', ['$resource', 'adminApi', function ($resource, adminApi) {
        var baseURL = adminApi;
        var resource = $resource(baseURL, {}, {
            'findConfiguration': {url: baseURL+"corporate/:idCorporate",  method: 'GET' }
        });
        return resource;
    }]).factory('AdminApiResource', ['$resource', 'adminApi', function ($resource, adminApi) {
        var baseURL = adminApi 
        var resource = $resource(baseURL, {}, {
            'getFieldConfigStatic': { url: baseURL + 'field-config/static/:corporateId/:specialityId/:visualDisplayId/:languageId', method: 'GET', isArray: false }
        });
        return resource;
    }]);
