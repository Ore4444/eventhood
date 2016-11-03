class BaseRepository {

  constructor(firebaseProvider){
    this.fireBase = firebaseProvider.getInstance();
    debugger;
    this.model = null;
  }

  add() {

  }

  edit() {

  }

  remove() {

  }

}

angular.module('starter.services', [])
  .factory('baseRepository', ['firebaseProvider', BaseRepository]);

