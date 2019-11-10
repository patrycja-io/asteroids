$('.clickButtons').click(function(e) {
  e.preventDefault();
  const id = this.id;
  if (id === 'topButton') {
    $('#history').hide();
    $('#game').show();
} else {    
    $('#history').show();
    $('#game').hide();
  }
});