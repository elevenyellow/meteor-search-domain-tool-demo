Posts = new Meteor.Collection('posts');

// Posts.allow({
//   update: ownsDocument,
//   remove: ownsDocument
// });

// Posts.deny({
//   update: function(userId, post, fieldNames) {
//     // may only edit the following two fields:
//     return (_.without(fieldNames, 'title').length > 0);
//   }
// });



Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user(),
      postWithSameTitle = Posts.findOne({title: postAttributes.title});
    
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new names");
    
    // ensure the post has a title
    if (!postAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');

    postAttributes.title = postAttributes.title.replace(/ /g,'');
    
    // check that there are no previous posts with the same title
    if (postAttributes.title && postWithSameTitle) {
      throw new Meteor.Error(302, 
        'This link has already been posted', 
        postWithSameTitle._id);
    }


    
    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'title', 'projectId'), {
      userId: user.username, 
      author: user.username, 
      submitted: new Date().getTime(),
      commentsCount: 0,
      upvoters: [], votes: 0
    });
    
    var postId = Posts.insert(post);

    console.log('postId after insert: ' + postId)
    
    if(!this.isSimulation){
      Meteor.call('checkAvailableDomains', postId);
    }
    
    

    return postId;
  },
  
  upVote: function(postId) {
    // if (Meteor.isClient) {
    //   console.log('*** upvote: isClient');
    // } else {
    //   console.log('*** upvote: isServer');
    // }
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to upvote");
    
    var postsAffected1 = Posts.update({
      _id: postId, 
      upvoters: {$nin: [user.username]},
      downvoters: {$nin: [user.username]}
    }, {
      $addToSet: {upvoters: user.username},
      $inc: {votes: 1}
    });

    // console.log('postsAffected1: ' + postsAffected1);

    var postsAffected2 = Posts.update({
      _id: postId, 
      upvoters: {$nin: [user.username]},
      downvoters: {$in: [user.username]}
    }, {
      $pull: {downvoters: user.username},
      $inc: {votes: 1}
    });

    // console.log('postsAffected2: ' + postsAffected2);

  },

  downVote: function(postId) {
    // if (Meteor.isClient) {
    //     console.log('*** downvote: isClient');
    // } else{
    //   console.log('*** downvote: isServer');
    // }
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to downvote");
    

    var postsAffected1 = Posts.update({
      _id: postId, 
      downvoters: {$nin: [user.username]},
      upvoters: {$nin: [user.username]}
    }, {
      $addToSet: {downvoters: user.username},
      $inc: {votes: -1}
    });
    // console.log('postsAffected1: ' + postsAffected1);

    
    var postsAffected2 = Posts.update({
      _id: postId, 
      downvoters: {$nin: [user.username]},
      upvoters: {$in: [user.username]}
    }, {
      $pull: {upvoters: user.username},
      $inc: {votes: -1}
    });
    // console.log('postsAffected2: ' + postsAffected2);

  },

  checkAvailableDomains: function(postId) {
    this.unblock();
    
    // var user = Meteor.user();
    // // ensure the user is logged in
    // if (!user)
    //   throw new Meteor.Error(401, "You need to login to checkAvailableDomains");
    
    var post = Posts.findOne(postId);
    var domain = post.title
    
    var url = "https://instantdomainsearch.com/all/" + domain + "?tlds=com,net,org,in,io,es&limit=20&hilite=strong";
    //return Meteor.http.call("GET", "http://search.twitter.com/search.json?q=perkytweets");
    console.log("calling checkDomainAvailability from the server with url = " + url);
    
    Meteor.http.get(url, function(error, result){
        if(error){
            console.log('error: ' + error);
        } else {
            //console.log("result: " + result);
            if(result.statusCode==200) {
                var data = result.content;
                //console.log("response received:" + data);
                var availableDomains = []            
                arrayOfLines = data.match(/[^\r\n]+/g);
                for (var i = 0; i < arrayOfLines.length; i++) {
                    item = JSON.parse(arrayOfLines[i]);
                    if(item.label && item.label == domain && !item.isRegistered){
                        //console.log("Found: ." + item.tld + " for " +item.label);
                        availableDomains.push(item.tld);
                    }
                };
                console.log("availableDomains in server:" + availableDomains);
                console.log("postId:" + postId);
                Posts.update(
                  postId, 
                  {$set: {availableDomains: availableDomains}}
                );
            } else {
                console.log("Response issue: ", result.statusCode);
            }
        }
    }.bind(postId));
  },

  removeItem: function(postId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to remove an item");
    Posts.remove(postId);    

  },
});