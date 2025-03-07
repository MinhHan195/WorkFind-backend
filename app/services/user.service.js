const {ObjectId} = require("mongodb");

class UserService{
    constructor(client) {
        this.Contact = client.db().collection("user");
    }

    async extractUserData(payload, id){
        const user = {
            accountId: id,
            name: payload.name,
            email: payload.email,
            gender: payload.gender,
            maritalStatus: payload.maritalStatus,
            phone: payload.phone,
            address: payload.address,
        };
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async create(payload, id) {
        const user = await this.extractUserData(payload, id);
        const result = await this.Contact.insertOne(user);
        return result;
    }

    async deleteByAccountId(id){
        const result = await this.Contact.findOneAndDelete({
            accountId: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = UserService;