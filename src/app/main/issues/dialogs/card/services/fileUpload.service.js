(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('FileUploadService', FileUploadService);

    /** @ngInject */
    function FileUploadService(apilaData, Upload, authentication, $timeout, UpdateInfoService) {

      var uploadFiles = function(file, errFiles, card, setUpdateInfo) {

        var uploadUrl = apilaData.getApiUrl() + '/api/issues/'+ card._id + '/attachments/new';

        var fileExtension = file.name.split('.').pop();

        if(!fileExtension) {
          fileExtension = file.name;
        }

        if (file) {
            file.upload = Upload.upload({
                url: uploadUrl,
                data: {file: file},
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    card.attachments.push(response.data);

                    UpdateInfoService.addUpdateInfo("attachments", fileExtension, "");
                });
            }, function (response) {

            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        }
      };

      return {
        uploadFiles : uploadFiles
      };
    }


})();
