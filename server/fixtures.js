// Fixture data 

if (Prefixes.find().count() === 0) {
  console.log("loading fixtures for Prefixes");
  for (var i = 0; i < prefixes_list.length; i++) {
    Prefixes.insert({name:prefixes_list[i], active: true});
  };
}


if (Posts.find().count() === 0) {
  var now = new Date().getTime();
  
  // create two users
  var tomId = Meteor.users.insert({
    profile: { name: 'Tom Coleman' }
  });
  var tom = Meteor.users.findOne(tomId);
  var sachaId = Meteor.users.insert({
    profile: { name: 'Sacha Greif' }
  });
  var sacha = Meteor.users.findOne(sachaId);

  var chemuId = Accounts.createUser({username:'chemuto', email: 'chemuto@gmail.com', password: '33333333', profile: {name: 'Chema Calvo'}});
  var chemu = Meteor.users.findOne(chemuId);

  var projectId = Projects.insert({
    title: 'Project One',
    ownerId: chemu._id,
    owner: chemu.profile.name
  });



  var postId = Posts.insert({
    title: 'cacaculopedopis',
    projectId: projectId,
    userId: chemu._id,
    author: chemu.profile.name,
    submitted: now - 7 * 3600 * 1000,
    commentsCount: 2,
    upvoters: [], downvoters: [], votes: 0
  });

  Meteor.call('checkAvailableDomains', postId);
  
  Comments.insert({
    postId: postId,
    userId: tom._id,
    author: tom.profile.name,
    submitted: now - 5 * 3600 * 1000,
    body: 'Interesting project Sacha, can I get involved?'
  });
  
  Comments.insert({
    postId: postId,
    userId: chemu._id,
    author: chemu.profile.name,
    submitted: now - 3 * 3600 * 1000,
    body: 'You sure can Tom!'
  });
  
  var postId = Posts.insert({
    title: 'meteorfornerds',
    projectId: projectId,
    userId: tom._id,
    author: tom.profile.name,
    submitted: now - 10 * 3600 * 1000,
    commentsCount: 0,
    upvoters: [], downvoters: [], votes: 0
  });

  Meteor.call('checkAvailableDomains', postId);
  
  var postId = Posts.insert({
    title: 'iwannabreakfreethroughmeteor',
    projectId: projectId,
    userId: tom._id,
    author: tom.profile.name,
    submitted: now - 12 * 3600 * 1000,
    commentsCount: 0,
    upvoters: [], downvoters: [], votes: 0
  });

  Meteor.call('checkAvailableDomains', postId);
  
}