const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.Contact = client.db().collection("user");
    }

    async extractUserData(payload, id) {
        const user = {
            accountId: id,
            name: payload.name,
            email: payload.email,
            gender: payload.gender,
            marriageStatus: payload.marriageStatus,
            phone: payload.phone,
            birthDay: payload.birthDay,
            nation: payload.nation,
            province: payload.province,
            district: payload.district,
            address: payload.address,
            cvUrl: payload.cvUrl,
            cvPublicId: payload.cvPublicId,
            cvName: payload.cvName,
            listUserFavoriteJob: [],
            listCv: [],
        };
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async find(filter) {
        const result = await this.Contact.findOne(filter);
        return result;
    }

    async findById(id) {
        return await this.find({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findByAccountId(id) {
        return await this.find({
            accountId: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
    }

    async create(payload, id) {
        const user = await this.extractUserData(payload, id);
        const result = await this.Contact.insertOne(user);
        return result;
    }

    async deleteByAccountId(id) {
        const result = await this.Contact.findOneAndDelete({
            accountId: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async update(payload, id) {
        const user = await this.extractUserData(payload)
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        }
        return await this.Contact.findOneAndUpdate(
            filter,
            { $set: user },
            { returnDocument: "after" }
        )
    }

    async addJobFavorite(accountId, jobId) {
        return await this.Contact.findOneAndUpdate(
            { accountId: ObjectId.isValid(accountId) ? new ObjectId(accountId) : null },
            { $addToSet: { listUserFavoriteJob: jobId } },
            { returnDocument: "after" }
        )
    }

    async deleteJobFavorite(accountId, jobId) {
        return await this.Contact.findOneAndUpdate(
            { accountId: ObjectId.isValid(accountId) ? new ObjectId(accountId) : null },
            { $pull: { listUserFavoriteJob: jobId } },
            { returnDocument: "after" }
        )
    }

    async addCV(accountId, ObjCv) {
        return await this.Contact.findOneAndUpdate(
            { accountId: ObjectId.isValid(accountId) ? new ObjectId(accountId) : null },
            { $addToSet: { listCv: ObjCv } },
            { returnDocument: "after" }
        )
    }

    async deleteCV(accountId, ObjCv) {
        return await this.Contact.findOneAndUpdate(
            { accountId: ObjectId.isValid(accountId) ? new ObjectId(accountId) : null },
            { $pull: { listCv: ObjCv } },
            { returnDocument: "after" }
        )
    }
}

module.exports = UserService;