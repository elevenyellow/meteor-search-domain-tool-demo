Feedbacks = new Meteor.Collection('feedbacks');


Meteor.methods({
  feedback: function(feedbackAttributes) {
    var user = Meteor.user()
      
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to add new feedback");
    
    // ensure the post has a content
    if (!feedbackAttributes.content)
      throw new Meteor.Error(422, 'Please fill in some text');

    // feedbackAttributes.content = feedbackAttributes.content.replace(/ /g,'');
    
    
    // pick out the whitelisted keys
    var feedback = _.extend(_.pick(feedbackAttributes, 'content'), {
      userId: user._id, 
      author: user.username, 
      submitted: new Date().getTime(),
    });
    
    var feedbackId = Feedbacks.insert(feedback);

    console.log('feedbackId after insert: ' + feedbackId);

    Meteor.call('sendEmail',
                'chemuto@gmail.com',
                'wat@elevenyellow.com',
                '[namecracy.com]',
                feedbackAttributes.content);
    

    return feedbackId;
  }

});