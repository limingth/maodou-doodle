Players = new Mongo.Collection("players");

if (Meteor.isClient) {
  Session.set("clickName", 0);
  Session.set("showDel", false);

  Template.hero.helpers({
    players: function () {
      return Players.find({}, { sort: { vote: -1, name: 1}});
    },
    selectedName: function () {
      var player = Players.findOne(Session.get("selectedPlayer"));
      return player && player.name;
    },
    showDel: function (argument) {
      return Session.get("showDel");
    }
  });

  Template.hero.events({
    'click .up': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {vote: 1}});
      Session.set("clickName", 0);
      Session.set("showDel", false);
    },
    'click .down': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {unvote: 1}});
    },
   'click .del': function () {
      Players.remove(Session.get("selectedPlayer"));
      Session.set("showDel", false);
      Session.set("clickName", 0);
    }, 
    'click .name': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: -5}});
    }
  });

  Template.player.events({
    'click .player': function (event) {
      Session.set("selectedPlayer", this._id);
      console.log('click voted :' + Session.get("votedPlayers"));

      $('.leaderboard li').css( "background-color", "white" );
      //$(event.target).css( "background-color", "#6ffff4" );
      $(event.target).closest('li.player').css( "background-color", "#6ffff4" );  
    },
    'click .name': function (event) {
      console.log('clickName :', Session.get("clickName"));
      Session.set("clickName", Session.get("clickName") + 1);

      if (Session.get("clickName") > 5)
        Session.set("showDel", true);
    },
  });

  Template.body.events({
    'submit .add-a-player': function (event) {
      var name = event.target.name.value;

      Players.insert({
        name: name,
        //score: Math.floor(Random.fraction() * 10) * 5
        vote: 0,
        unvote: 0,
      });

      event.target.name.value = "";
      Session.set("clickName", 0);
      return false;
    }
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Players.find().count() === 0) {
      var names = ["小明","小红","李雷","韩梅梅"];

      _.each(names, function (name) {
        Players.insert({
          name: name,
          //score: Math.floor(Random.fraction() * 10) * 5
          vote: 0,
          unvote: 0,
        });
      });
    }
  });
}
