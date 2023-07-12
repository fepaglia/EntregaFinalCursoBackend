export default class ChatsDto {
    constructor(message) {
      this.user = message.user;
      this.message = message.message;
      this.createdAt = message.timestamps;
    }
  };