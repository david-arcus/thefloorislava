<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Response;

use \Firebase;

class ApiController extends Controller
{

    public function index() {

      /*
        <script src="https://www.gstatic.com/firebasejs/3.6.4/firebase.js"></script>
        <script>
          // Initialize Firebase
          var config = {
            apiKey: "AIzaSyD7bOjrVqYu1ezayVBxC4J7jjIkQcDxsWk",
            authDomain: "the-floor-is-lava-1ce40.firebaseapp.com",
            databaseURL: "https://the-floor-is-lava-1ce40.firebaseio.com",
            storageBucket: "the-floor-is-lava-1ce40.appspot.com",
            messagingSenderId: "497275033652"
          };
          firebase.initializeApp(config);
        </script>
      */

    }

    private function getFirebase() {

      $path = base_path();

      $firebase = Firebase::fromServiceAccount($path . '/the-floor-is-lava-1ce40-firebase-adminsdk-9kmh5-0933b5bac1.json');
      $database = $firebase->getDatabase();

      return $database;

    }

    private function userExists($database, $username) {

      $userExists = $database->getReference('users')
        ->orderByChild('username')
        ->equalTo(json_encode($username))
        ->getSnapshot()
        ->hasChildren();

      return $userExists;

    }

    private function getUserId($database, $username) {

      $userId = $database->getReference('users')
        ->orderByChild('username')
        ->equalTo(json_encode($username))
        ->getValue();

      return $userId;

    }

    public function addFriend(Request $request) {

      // establish friendship between two users

      // validate user data
      $this->validate($request, [
        'user.user_id'          => 'required|max:255',
        'user.friend_username'  => 'required|max:255',
      ]);

      $request = $request->json()->all();

      $database = $this->getFirebase();

      $friendKey = key($this->getUserId($database, $request['user']['friend_username']));

      $friendDetails = [
        'key' => $friendKey
      ];

      $postRef = $database->getReference('users/' . $request['user']['user_id'] . '/friends')->push($friendDetails);

      return Response::json(array('status' => 'success', 'message' => 'added new friend'));

    }

    public function insertUser(Request $request) {

      // insert user into database

      // validate user data
      $this->validate($request, [
        'user.username'         => 'required|max:255',
        'user.password'         => 'required|max:255',
        'user.device_id'        => 'required',
        'user.device_type'      => 'required'
      ]);

      $request = $request->json()->all();

      $database = $this->getFirebase();

      // check if the username is already taken

      if ($this->userExists($database, $request['user']['username'])) {
        return Response::json(array('status' => 'fail', 'message' => 'That username is already taken!'), 400);
      };

      $newPost = $database
        ->getReference('users')
        ->push([
          'username' => $request['user']['username'],
          'password' => Hash::make($request['user']['password']),
          'device_id' => $request['user']['device_id']
        ])->getKey();

      return Response::json(array('status' => 'success', 'message' => 'added new user', 'key' => $newPost));

    }
}
