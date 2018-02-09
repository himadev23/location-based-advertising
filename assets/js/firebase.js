// Initialize Firebase
var config = {
    apiKey: "AIzaSyDHzokAbTKu_FgIzLsU8QZm893E2YfUvUw",
    authDomain: "location-based-advertiser.firebaseapp.com",
    databaseURL: "https://location-based-advertiser.firebaseio.com",
    projectId: "location-based-advertiser",
    storageBucket: "location-based-advertiser.appspot.com",
    messagingSenderId: "932682812705"
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
            });

            
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            
        });
        


}

function googleSignout() {
   firebase.auth().signOut()
  
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}

