$(function() {
  // Execute whatever is inside the <code> tags.
  var examples = document.getElementsByClassName('example'), i;
  for (i = examples.length - 1; i >= 0; i--) {
    var example = examples[i],
      source = example.getElementsByClassName('source')[0];
      source = source.textContent || source.innerText;
    eval(source);
  }
});
