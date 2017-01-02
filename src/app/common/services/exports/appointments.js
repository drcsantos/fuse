(function() {
  angular.module("app.core").service("exportAppointments", exportAppointments);

  function exportAppointments() {

    function exportPdf(columns, rows, month) {
      var doc = new jsPDF('p', 'pt');

      doc.autoTable(columns, rows, {
        addPageContent: function(data) {
          doc.text("Appointments for " + month, 170, 30);
        }
      });
      doc.save(month + '-Appointments.pdf');
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
