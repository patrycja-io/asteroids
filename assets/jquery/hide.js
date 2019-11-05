$('.clickButtons').click(function(e) {
  e.preventDefault();
  const id = this.id;
	console.log(this.id);
  if (id === 'topButton') {
		    $('#bottomContainer').show();
    $('#topContainer').hide();
} else {	
    $('#topContainer').show();
    $('#bottomContainer').hide();
  }
});
