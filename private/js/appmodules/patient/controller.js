materialAdmin.controller('patientCtrl', function($scope, PatientResource) {
    $scope.test = "TEST 123456";
    $scope.patients = PatientResource.findAll();
});