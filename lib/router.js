Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

ProjectPageController = RouteController.extend({
  template: 'projectPage',
  increment: 10, 
  limit: function() { 
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.limit()};
  },

  onRun: function(){
    Session.set("currentProjectId", this.params._id);
  },

  waitOn: function() {
    return [
      Meteor.subscribe('singleProject', this.params._id),
      Meteor.subscribe('projectPosts', this.params._id)
    ];
  },
  
  onBeforeAction: function() {
    this.postsSub = Meteor.subscribe('projectPosts', this.params._id, this.findOptions());
  },

  onAfterAction: function() {
    if(this.posts){
      // console.log("this.posts:", this.posts().fetch());
      var postsIds = this.posts().map(function (connector) {
          return connector._id;
      });
      // console.log("postsIds:", postsIds.length);
      var unusedPositions = Positions.find({postId:{$nin:postsIds}});
      // console.log("unusedPositions: ", unusedPositions.fetch());
      Positions.remove({postId:{$nin:postsIds}});
      Positions.find().fetch(); // do not remove this line. somehow is necessary
    }
  },
  
  posts: function() {
    return Posts.find({projectId:this.params._id}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.limit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      project: Projects.findOne(this.params._id),
      nextPath: hasMore ? this.nextPath() : null,
      tab: this.tab
    };
  }
});

NewProjectPageController = ProjectPageController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newProjectPage.path({
        _id: this.params._id,        
        postsLimit: this.limit() + this.increment
      })
  },
  tab: 'new'
});

BestProjectPageController = ProjectPageController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestProjectPage.path({
      _id: this.params._id,
      postsLimit: this.limit() + this.increment
    })
  },
  tab: 'best'
});

Router.map(function() {

  this.route('projectPage', {
    path: '/projects/:_id',
    controller: BestProjectPageController
  });

  this.route('newProjectPage', {
    path: '/projects/:_id/new/:postsLimit?',
    controller: NewProjectPageController
  });

  this.route('bestProjectPage', {
    path: '/projects/:_id/best/:postsLimit?',
    controller: BestProjectPageController
  });

  this.route('searchResultPage', {
    path: '/projects/:_id/search',
    waitOn: function() {
        return [
          Meteor.subscribe('singleProject', this.params._id),
          Meteor.subscribe('projectPosts', this.params._id)
        ];
      },
    data: function() { 
      return {
        project:  Projects.findOne(this.params._id)
      };
    }
  });
    
  
  this.route('postPage', {
    path: '/projects/:projectId/posts/:_id',
    waitOn: function() {
      return [
        Meteor.subscribe('comments', this.params._id),
        Meteor.subscribe('projectPosts', this.params.projectId),
        Meteor.subscribe('singleProject', this.params.projectId),
      ];
    },
    data: function() {
      return Posts.findOne(this.params._id); 
    }
  });

  this.route('postEdit', {
    path: '/posts/:_id/edit',
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
  });
  

  this.route('home', {
    path: '/',
    waitOn: function() { 
      return Meteor.subscribe('projects');
    },
    data: function() { 
      return {
        projects:  Projects.find()
      };
    }
  });

  this.route('messages', {
    path: '/projects/:_id/messages',
    waitOn: function() {
      return [
        Meteor.subscribe('projectMessages', this.params._id),
        Meteor.subscribe('singleProject', this.params._id),
      ];
    },
    data: function() {
      return {
        messages: Messages.find({projectId: this.params._id}, {sort: {submitted: 1}}),
        project: Projects.findOne(this.params._id)
      }
    }
  });

  this.route('projectsList', {
    path: '/projects',
    waitOn: function() { 
      return Meteor.subscribe('projects');
    },
    data: function() { 
      return {
        projects:  Projects.find()
      };
    }
  });

  this.route('postSubmit', {
    path: '/submit',
    progress: {enabled: false}
  });

 
  this.route('projectSubmit', {
    path: '/projectSubmit',
    progress: {enabled: false}
  });

});


var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    
    pause();
  }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.onBeforeAction(function() { clearErrors() });
