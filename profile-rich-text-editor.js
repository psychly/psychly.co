document.addEventListener('DOMContentLoaded', function() {
  var quill = new Quill('#editor', {
    modules: {
      toolbar: [
        [{ 'header': [2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block', 'link'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ]
    },
    placeholder: 'Type something here...',
    theme: 'snow'
  });
  var notesField = document.querySelector('[data-ms-member="about-your-practice"]');
  if (notesField) {
    var html = notesField.value;
    var quillDelta = quill.clipboard.convert(html);
    quill.setContents(quillDelta);
    quill.on('text-change', function(delta, oldDelta, source) {
      notesField.value = quill.root.innerHTML;
    });
  }
  var form = document.querySelector('#post-form');
  form.onsubmit = function() {
    // Populate hidden form on submit
    var about = document.querySelector('textarea[name=Description]');
    about.value = quill.root.innerHTML;
    notesField.value = quill.root.innerHTML;
    console.log("Submitted", $(form).serialize(), $(form).serializeArray());
    // No back end to actually submit to!
    
  };
});
