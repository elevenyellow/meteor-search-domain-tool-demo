Messages = new Meteor.Collection('messages');


Meteor.methods({
  message: function(messageAttributes) {
    var user = Meteor.user()
      
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to add new messages");
    
    // ensure the post has a content
    if (!messageAttributes.content)
      throw new Meteor.Error(422, 'Please fill in some text');

    messageAttributes.title = messageAttributes.content.replace(/ /g,'');
    
    
    // pick out the whitelisted keys
    var message = _.extend(_.pick(messageAttributes, 'content', 'projectId'), {
      userId: user.username, 
      author: user.username, 
      submitted: new Date().getTime(),
    });
    
    var messageId = Messages.insert(message);

    console.log('messageId after insert: ' + messageId)
    

    return messageId;
  }

});