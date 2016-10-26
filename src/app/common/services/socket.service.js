(function() {

  angular
      .module('app.core')
      .service('socket', socket);

  socket.$inject = ['socketFactory'];

  function socket(socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://localhost:3300')
    });
  }

})();
