/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/

App.directive('filestyle', function() {
  return {
    restrict: 'A',
    controller: function($scope, $element) {
      var options = $element.data();
      
      // old usage support
        options.classInput = $element.data('classinput') || options.classInput;
      
      $element.filestyle(options);
    }
  };
});
