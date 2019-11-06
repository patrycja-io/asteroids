$('.clickButtons').click(function(e) {
  e.preventDefault();
  const id = this.id;
    console.log(this.id);
  if (id === 'topButton') {
    $('#game').show();
    $('#history').hide();
    $('footer').remove();
} else {    
    $('#history').show();
    $('#game').hide();
  }
});