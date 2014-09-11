 var POST_HEIGHT = 95;


Template.postItem.helpers({
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  upVotedClass: function() {
    //var userId = Meteor.userId();
    var userUsername = Meteor.user().username;
    if (userUsername && !_.include(this.upvoters, userUsername)) {
      return 'up-votable votable';
    } else {
      return '';
    }
  },
  downVotedClass: function() {
    //var userId = Meteor.userId();
    var userUsername = Meteor.user().username;
    if (userUsername && !_.include(this.downvoters, userUsername)) {
      return 'down-votable votable';
    } else {
      return '';
    }
  },
  attributes: function() {
    // Runs once when the template is first rendered. Because of its
    // dependency on the _rank property, it will also re-run every time a post’s ranking changes.
    // And finally, its dependency on the Positions collection also means it will re-run
    // whenever the item in question is modified.
    //
    // post._rank
    // Positions.findOne({postId: this._id})

    var post = _.extend({}, Positions.findOne({postId: this._id}), this);
    var newPosition = post._rank * POST_HEIGHT;
    var attributes = {};
    
    if (_.isUndefined(post.position)) {
      attributes.class = 'post invisible';
    } else {
      var delta = post.position - newPosition;      
      attributes.style = "top: " + delta + "px";
      if (delta === 0)
        attributes.class = "post animate"
    }

    Meteor.setTimeout(function() {
      Positions.upsert({postId: post._id}, {$set: {position: newPosition}})
      // console.log("  added position: ", post.title, newPosition, "attributes", attributes);
    });
  
    return attributes;
  }
});

Template.postItem.events({
  'click .up-votable': function(e) {
    e.stopPropagation();
    e.preventDefault();
    //console.log('clicked .upvotable');
    Meteor.call('upVote', this._id);
  },
  'click .down-votable': function(e) {
    e.stopPropagation();
    e.preventDefault();
    //console.log('clicked .downvotable');
    Meteor.call('downVote', this._id);
  },
  'click .remove-item': function(e) {
    e.stopPropagation();
    e.preventDefault();
    //console.log('clicked .downvotable');
    Meteor.call('removeItem', this._id);
  }
});