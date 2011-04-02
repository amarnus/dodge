(function($){
  $(document).ready(function() {
    $("body").load("../index.html", function(content) {
      console.log(content);
    });
  });
})(jQuery);