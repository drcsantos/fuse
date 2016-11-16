(function() {

  angular
      .module('app.core')
      .service('errorCheck', errorCheck);

  errorCheck.$inject = [];

  function errorCheck() {

    function hasError(name, form, errors) {
      if(!form[name]) {
        errors[name] = true;
        return true;
      } else {
        errors[name] = false;
        return false;
      }
    }

    function requiredFields(form, errors, fields) {

      if(!errors) {errors = {};}

      var error = false;

      for(var i = 0; i < fields.length; ++i){
        if(hasError(fields[i], form, errors)) {
          error = true;
        }
      }

      return error;
    }

    return {
      requiredFields: requiredFields
    };
  }

})();
