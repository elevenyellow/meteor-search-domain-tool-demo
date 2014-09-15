function resizer() {
    var newHeight = ''+$(window).height()-$('.nav-tabs').position().top-128+'px';
    console.log('newHeight', newHeight);
    $('.messages-wp').css('height', newHeight);
}

function startResize() {
    $(window).resize(resizer);
}

function endResize() {
    $(window).off("resize", resizer);
}


Template.messages.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var message = {
      content: $('#message-content-input').val(),
      projectId: $('#message-projectid-input').val()
    }

    $('#message-content-input').val('');
    
    console.log("message:", message);

    Meteor.call('message', message, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        
      }
    });



  }
});

Template.messages.rendered = function() {
  console.log('Template.messages.rendered');
  resizer();
  $('.messages-wp').scrollTop($('.messages-wp').prop('scrollHeight'));
};

Template.message.rendered = function() {
  $('.messages-wp').scrollTop($('.messages-wp').prop('scrollHeight'));
};

Template.messages.created = function() {
  console.log('Template.messages.created');
  startResize();
  
};

Template.messages.destroyed = function() {
  console.log('Template.messages.destroyed');
  endResize();
};