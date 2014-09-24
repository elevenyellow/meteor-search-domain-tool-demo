Template.layout.events({
    'click #feedback': function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log('click #feedback a');


        $('#feedback-modal').modal('show');
        $('#textarea').focus();
        
    },
    'click #feedback-submit': function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#feedback-form').submit();
        
    },
    'submit #feedback-form': function(e){
        e.preventDefault();
        e.stopPropagation();
        var feedback = {
          content: $('#feedback-textarea').val(),
          email: $('#feedback-email').val(),
        }

        // console.log("feedback:", feedback);

        Meteor.call('feedback', feedback, function(error, id) {
          if (error) {
            // display the error to the user
            throwError(error.reason);
          } else {
            console.log('feedback callback');
          }
        });

        $('#feedback-modal').modal('hide');
        
    }

});

