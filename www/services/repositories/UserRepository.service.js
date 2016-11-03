class UserRepository extends BaseRepository {

  constructor(FireBaseProvider){
    super();
    this.apiPath = 'user/'

    this.model = {
      userName: '',
      email: ''
    };
  }

  add(data) {

  }

  edit(userId, data) {

  }

  remove(userId) {

  }


}
