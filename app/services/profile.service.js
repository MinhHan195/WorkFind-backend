const {ObjectId} = require("mongodb");

class ProfileService{
    constructor(client) {
        this.Contact = client.db().collection("profile");
    }

    async extractProfileData(payload, userId){
        const profile = {
            userId: userId,
            title: payload.title,
            fullName: payload.fullName,
            nationality:  payload.nationality,
            birthDay: payload.birthDay,
            maritaStatus: payload.maritaStatus,
            gender: payload.gender,
            phone: payload.phone,
            email: payload.email,
            address: payload.address,
            educationLevel: payload.educationLevel,
            nameSchool: payload.nameSchool,
            major: payload.major,
            dateStart: payload.dateStart,
            dateFinish: payload.dateFinish,
            language: payload.language,
            languageLevel: payload.languageLevel,
            skill: payload.skill,
            skillLevel: payload.skillLevel,
            skillDescription: payload.skillDescription,
            desiredPosition: payload.desiredPosition,
            desiredSalary: payload.desiredSalary,
            positionType: payload.positionType,
            careerLevel: payload.careerLevel,
            jobType: payload.jobType,
            location: payload.location,
            creerObjective: payload.creerObjective,
            profileStatus: payload.profileStatus,
        }

        Object.keys(profile).forEach(
            (key) => profile[key] === undefined && delete profile[key]
        );
        return profile;
    }

    async create(payload, userId) {
        const profile = await this.extractProfileData(payload, userId);
        const result = await this.Contact.findOneAndUpdate(
            profile,
            {$set: {dateTimeUpdate: new Date().toLocaleString()}},
            { returnDocument: "after", upsert: true}
        )
        return result;
    }

    async update(payload, id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        }

        const profile = await this.extractProfileData(payload);
        return await this.Contact.findOneAndUpdate(
            filter,
            {$set: profile},
            {returnDocument: "after"}
        );
    }

    async delete(id, userId) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            userId: userId
        }
        return await this.Contact.findOneAndDelete(filter);
    }

    async findByUserId(userId) {
        const cusor = await this.Contact.find({userId: userId});
        return await cusor.toArray();
    }
}

module.exports = ProfileService;