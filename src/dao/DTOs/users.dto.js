export default class UserDto {
    constructor(user) {
        if (user) {
            this._id = user._id;
            this.first_name = user.first_name;
            this.last_name = user.last_name;
            this.email = user.email;
            this.carts = user.carts;
            this.role = user.role;
            this.lastConnection = user.lastConnection;
        }
    }
};