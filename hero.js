Players = new Mongo.Collection("players");

if (Meteor.isClient) {
  Template.hero.helpers({
    players: function () {
      return Players.find({}, { sort: { score: -1, name: 1}});
    },
    selectedName: function () {
      var player = Players.findOne(Session.get("selectedPlayer"));
      return player && player.name;
    }
  });

  Template.hero.events({
    'click .up': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {vote: 1}});
      
      var voted = [];
      voted.push("abc");
      voted.push("123");
      voted.push("789");

      Session.set("votedPlayers", voted);
      console.log('voted :' + Session.get("votedPlayers"));
      return;


      if (Session.get("votedPlayer") != undefined)
        voted.push(Session.get("votedPlayer"));
      voted.push(Session.get("selectedPlayer"));
      voted = ["abcd", "1234"];
      voted.push("abc");
      voted.push("123");
      console.log('here: ', voted);
      Session.set("votedPlayers", voted);
      console.log('voted :' + Session.get("votedPlayers"));
    },
    'click .down': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {unvote: 1}});
    },
   'click .del': function () {
      Players.remove(Session.get("selectedPlayer"));
    }, 
    'click .name': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: -5}});
    }
  });

  Template.player.events({
    'click .player': function (event) {
      Session.set("selectedPlayer", this._id);
      console.log('click voted :' + Session.get("votedPlayers"));
      $(event.target).css( "background-color", "#6ffff4" );
    }
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
