(function($){
  $(document).ready(function() {
    $("body").load("https://github.com/amarnus/dodge/raw/master/index.html", function(content) {
      console.log(content);
    });
  });
})(jQuery);