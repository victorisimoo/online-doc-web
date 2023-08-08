<div class="container" ng-controller="changePhotoCtrl">
    <div class="row">
        <div class="col-sm-6 col-lg-offset-3">
            <div class="card">
                <div class="card-header ch-alt">
                    <h2>{{ 'CHANGE_PROFILE_PHOTO' | translate }}</h2>
                </div>
                <div class="card-header ch-alt corporate" ng-show="state==2">
                    <h2>{{ 'ERROR_MAX_ALLOWED' | translate }}</h2>
                </div>
                <div class="card-header ch-alt corporate" ng-show="state==3">
                    <h2>{{ 'ERROR_MAX_DIMENSIONS' | translate }}</h2>
                </div>
                <div class="card-header ch-alt corporate" ng-show="state==4">
                    <h2>{{ 'ERROR_MAX_DIMENSIONS' | translate }}</h2>
                </div>
                <div class="card-header ch-alt corporate" ng-show="state==5">
                    <h2>{{ 'SUCCESS_PHOTO_UPLOADED' | translate }}</h2>
                </div>
                <div class="card-body card-padding">
                    <div class="pmo-contact">
                        <dl class="dl-horizontal">
                            <dd class="ng-binding"><img class="img-thumbnail" style="width: 50%"  ng-src="{{doctor.profilePicture.base64}}" ></dd>
                        </dl>
                    </div>
                    <form name="formNuevo" action="views/doctor/change.php"  method="POST" enctype="multipart/form-data">
                        <div class="input-group m-b-20">
                                    {{ 'SELECT_A_NEW_PHOTO' | translate }}
                                    <input type="text" hidden="true" ng-model="doctor.doctorId" name="doctorId">
                                    <input type="text" hidden="true" ng-model="photoFolder" name="baseURL">
                                    <br>
                                    <div class="fg-line">
                                        <input type="file" name="image-file" accept=".jpg, .jpeg, .png" placeholder="Seleccione una foto" required>
                                    </div>
                        </div>
                        <button class="btn btn-danger" type="submit" name="login" 
                                    ng-disabled="formNuevo.$invalid">{{ 'CAMBIAR' | translate }}</button>
                        <button class="btn waves-effect btn-cancel" ng-click="cancel()">{{ 'CANCELAR' | translate }}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>