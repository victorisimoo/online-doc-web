
<div class="container" ng-controller="DocAccountCtrl" uploader="uploader" filters="imageFilter">
    <div class="row">
        <div class="col-sm-6 col-lg-offset-3">
            <div class="card">
                <div class="card-header ch-alt">
                    <h2>{{ 'ADMIN_CUENTA' | translate }}</h2>
                </div>
                <div class="card-body card-padding">
                    <div class="pmo-contact">
                        <dl class="dl-horizontal">
                            <dt><i class="zmdi zmdi-account"></i> {{ 'NOMBRE' | translate }}</dt>
                            <dd class="ng-binding">{{userName}}</dd>
                        </dl>
                        <dl class="dl-horizontal">
                            <dt><i class="zmdi zmdi-email"></i> {{ 'EMAIL' | translate }}</dt>
                            <dd class="ng-binding">{{doctor.admUser.admPerson.emailPerson}}</dd>

                        </dl>
                    </div>

                    <hr />
                    <div>
                        <button class="btn btn-action-sm" ng-click="showFilesModal()" style="width:45%; margin-bottom: 40px; height:6%; vertical-align: middle;">
                            <i class="zmdi zmdi-account-box"></i> {{ 'PROFILE_BTN_CHANGE_SIGNATURE' | translate }}
                        </button><br />
                        <button class="btn btn-action-sm" ui-sref="pages.docprofile" style="width:45%; margin-bottom: 40px; height:6%; vertical-align: middle;">
                            <i class="zmdi zmdi-account-box"></i> {{ 'PROFILE_BTN_ADMIN_PROFILE' | translate }}
                        </button>
                        <button class="btn btn-action-sm" ng-click="changePassword()" style="width:45%; margin-bottom: 40px; height:6%; vertical-align: middle;">
                            <i class="zmdi zmdi-key"></i> {{ 'PROFILE_BTN_CHANGE_PASS' | translate }}
                        </button>
                        <br />
                        <button class="btn btn-action-sm" ng-click="exportAccount()" style="width:45%; height:6%; vertical-align: middle;">
                            <i class="zmdi zmdi-key"></i> {{ 'BUTTONEXPDATOS' | translate }}
                        </button>

                        <button class="btn btn-action-sm" data-toggle="modal" data-target="#deleteAccountModal" style="width:45%; height:6%; vertical-align: middle;">
                            <i class="zmdi zmdi-key"></i> {{ 'BUTTONELICUENTA' | translate }}
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modal-photo">
        <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title"><b>{{ 'MODAL_ADMIN_PROFILE_TITLE_RESOUCES' | translate }}</b></h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <p style="text-align: center; font-weight: bold">{{ 'MODAL_ADMIN_PROFILE_TITLE_PHOTOGRAPHY' | translate }}</p>
                            <div class="avatar-upload">
                                <div class="avatar-edit">
                                    <input id="photoUpload" type="file" nv-file-select="" uploader="uploader" options="{clearInputAfterAddedToQueue: true, type: 'profile'}" accept="image/*">
                                    <label for="photoUpload"></label>
                                </div>
                                <div class="avatar-preview">
                                    <div id="photoPreview"
                                        style="background-image: url('img/notfound.png'); background-size: contain;">
                                    </div>
                                </div>
                            </div>
                            <img src="img/loading.gif" style="width: 30%; margin-left: 35%" ng-show="uploadingPhoto">
                        </div>
                        <div class="col-sm-6">
                            <p style="text-align: center; font-weight: bold">{{ 'MODAL_ADMIN_PROFILE_TITLE_FIRM' | translate }}</p>
                            <div class="signature-upload">
                                <div class="signature-edit">
                                    <input id="signatureUpload" type="file" nv-file-select="" uploader="uploader" options="{clearInputAfterAddedToQueue: true, type: 'signature'}" accept="image/*">
                                    <label for="signatureUpload"></label>
                                </div>
                                <div class="signature-preview">
                                    <div id="signaturePreview"
                                        style="background-image: url('img/notfound.png'); background-size: contain;">
                                    </div>
                                </div>
                            </div>
                            <img src="img/loading.gif" style="width: 30%; margin-left: 35%"
                                ng-show="uploadingSignature">
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-action-sm" ng-click="closeUpdateResources()">{{ 'CERRAR' | translate }}</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
    </div>
        <!-- /.modal-dialog -->

         <!-- Modal delete account -->
         <div class="modal fade" id="deleteAccountModal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 class="modal-title" id="exampleModalLabel">
                                <strong>{{ 'MODAL_TITLE_ELI_CUENTA' | translate }}</strong>
                            </h4>
                        </div>
                        <div class="modal-body">
                            <p>{{ 'MODAL_EXP_ELI_CUENTA' | translate }}. </p>
                            <p><strong>{{ 'MODAL_ADV_ELI_CUENTA' | translate }}.</strong></p>
                            <form name="frmDeleteAccount">
                                <div class="input-group m-b-20" style="width: 100%;">
                                    <p>{{ 'MODAL_CONFIRM_EMAIL' | translate }}:</p>
                                    <hr>
                                    <div class="fg-line">
                                        <input type="email" class="form-control" placeholder="{{'EMAIL_HEADER' | translate}}"
                                            name="email" ng-model="email" style="text-align: left;"
                                            ng-maxlength="254" required>
                                    </div>
                                    <p ng-show="frmDeleteAccount.email.$error.required" class="help-block">
                                        {{ 'EMAIL_REQUIRED' | translate }}
                                    </p>
                                    <p ng-show="frmDeleteAccount.email.$invalid && !frmDeleteAccount.email.$error.required"
                                        class="help-block">{{ 'INVALID_FORMAT_EMAIL' | translate }}</p>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer" style="text-align: center!important;">
                            <button class="btn btn-action-sm" ng-disabled="frmDeleteAccount.$invalid "
                                ng-click="confirmDeleteAccount()">
                                {{ 'ACEPTAR' | translate }}
                            </button>
                            <button class="btn btn-cancel" data-dismiss="modal"
                                ng-click="cancel()">
                                {{ 'BUTTONNOELICUENTA' | translate }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</div>