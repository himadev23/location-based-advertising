// Initialize Firebase
var config = {
   apiKey: "AIzaSyDzJqDInGFMAPpq0c4kBsDDr4CLCKdpyM8",
   authDomain: "coupon-project-1517945338567.firebaseapp.com",
   databaseURL: "https://coupon-project-1517945338567.firebaseio.com",
   projectId: "coupon-project-1517945338567",
   storageBucket: "coupon-project-1517945338567.appspot.com",
   messagingSenderId: "6770785770"
 };
firebase.initializeApp(config);

// var databse=firebase.databse();


var provider = new firebase.auth.GoogleAuthProvider();
var database = firebase.database();

function googleSignin() {
    firebase.auth()

        .signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;

            var uid = user.uid;
            database.ref('users').once('value', function(snapshot){
              var users = snapshot.val() || {};
              var userData = {
                  token: token,
                  user: {
                    name: result.user.displayName,
                    email: result.user.email,
                    emailVerified: result.user.emailVerified,
                    photoURL: result.user.photoURL,
                    metadata: result.user.metadata
                  }
                };

                users[uid] = userData;

                database.ref('users').set(users);
                setCookie(uid, token);
                checkSession();
            });

            
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            
        });
        


}

function setCookie (uid, token) {
    $.cookie('user', uid + ":" + token);
}

function googleSignOut() {
   firebase.auth().signOut()
  
   .then(function() {
      $.cookie('user', '');
      checkSession();
   }, function(error) {
      console.log('Signout Failed')  
   });
}

function checkSession () {
    var cookieUser = $.cookie('user');
    if(!cookieUser) {
      $('#login-wrapper').show();
      $('#user-info').hide();
      return;
    }

    cookieUser = cookieUser.split(":");
    var uid = cookieUser[0];
    var token = cookieUser[1];

    database.ref('users/' + uid).once('value', function(snapshot){
      var user = snapshot.val();

      if(user === null) {
        return;
      } else {
        var userName = user.user.name;
        var userPhoto = user.user.photoURL;
        $('#login-wrapper').hide();
        $('#user-info').show();
        $('#user-name').html(userName);
        $('#user-photo').html('<img src="' + userPhoto + '" style="width:80px;">');
      }


    });
}

$(document).ready(function(){
    checkSession();
});

