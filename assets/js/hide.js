$('.clickButtons').click(function(e) {
  e.preventDefault();
  const id = this.id;
    console.log(this.id);
  if (id === 'topButton') {
    $('#history').hide(1200);
    $('footer').hide(1200);
    $('#game').show(1200);
} else {    
    $('#history').show(1200);
    $('footer').show(1200);
    $('#game').hide(1200);
  }
});