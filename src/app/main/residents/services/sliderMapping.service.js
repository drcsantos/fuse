(function() {

  'use strict';

  angular
    .module('app.residents')
    .service('SliderMapping', SliderMapping);


  /** @ngInject */
  function SliderMapping() {

    var sliderFields = {
      frequencyOfBathing: {
        "0": "None",
        "1": "Once a week",
        "2": "Twice a week",
        "3": "Every other day",
        "4": "Every day"
      },
      assessmentInterval: {
        "0": "Weekly",
        "1": "Monthly",
        "2": "Quarterly",
        "3": "Yearly",
        "4": "None"
      },
      bowelContinent: {
        "0": "Always",
        "1": "Sometimes",
        "2": "Never"
      },
      constipated: {
        "0": "Always",
        "1": "Sometimes",
        "2": "Never"
      },
      bladderContinent: {
        "0": "Always",
        "1": "Sometimes",
        "2": "Never"
      },
      dribbles: {
        "0": "Always",
        "1": "Sometimes",
        "2": "Never"
      },
      overallNutrition: {
        "0": "Not eating",
        "1": "Poor",
        "2": "Good",
        "3": "Over eating"
      },
      teethCare: {
        "0": "Great",
        "1": "Good",
        "2": "Decent",
        "3": "Lacking",
        "4": "None"
      },
      comprehension: {
        "0": "Slow",
        "1": "Moderate",
        "2": "Quick"
      },
      dementia: {
        "0": "None",
        "1": "Mild",
        "2": "Moderate",
        "3": "Severe"
      },
      generalActivityParticipation: {
        "0": "Never",
        "1": "Sometimes",
        "2": "Good",
        "3": "Amazing"
      },
      diningRoomParticipation: {
        "0": "Never",
        "1": "Sometimes",
        "2": "Good",
        "3": "Amazing"
      },
      busRideParticipation: {
        "0": "Never",
        "1": "Sometimes",
        "2": "Good",
        "3": "Amazing"
      },
      fitnessClassParticipation: {
        "0": "Never",
        "1": "Sometimes",
        "2": "Good",
        "3": "Amazing"
      },
      bingoParticipation: {
        "0": "Never",
        "1": "Sometimes",
        "2": "Good",
        "3": "Amazing"
      },
      communityParticipation: {
        "0": "Never",
        "1": "Sometimes",
        "2": "Good",
        "3": "Amazing"
      },
    };

    function replaceNumberValue(field, value) {

      var mapedField = sliderFields[field];

      if(mapedField) {
        if(mapedField[value]) {
          return mapedField[value];
        }
      }
    }

    return {
      replaceNumberValue: replaceNumberValue
    };
  }

})();
