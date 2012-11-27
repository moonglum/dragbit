$(function() {
  // Execute whatever is inside the <code> tags.
  $(".example").each(function () {
    var source = $(".source", this).text();
    eval(source);
  });
});
