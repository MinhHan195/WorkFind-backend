const { object } = require("joi");
const {ObjectId} = require("mongodb");

class JobService {
    constructor(client) {
        this.Contact = client.db().collection("job");
    }

    async extractJobData(payload, id) {
        const job = {
            idUser: id,
            nameCompany: payload.nameCompany,
            staffNumber: payload.staffNumber === null ? parseInt(payload.staffNumber) : payload.staffNumber,
            urlWebSite: payload.urlWebSitew,
            companyDescription: payload.companyDescription,
            jobName: payload.jobName,
            address: payload.address,
            jobDescription: payload.jobDescription,
            benefits: payload.benefits,
            salary: payload.salary,
            educationLevel: payload.educationLevel,
            experienceLevel: payload.experienceLevel,
            careerLevel: payload.careerLevel,
            positionType: payload.positionType,
            gender: payload.gender,
            typeJob: payload.groupJob,
            addressContact: payload.addressContact,
            staffName: payload.staffName,
            phone: payload.phone,
            attention: payload.attention,
            dateTimeCreate: new Date().toLocaleString(),
            dateTimeUpdate: new Date().toLocaleString(),
        };
        Object.keys(job).forEach(
            (key) => job[key] === undefined && delete job[key]
        );
        return job;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findById(id){
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByUserId(id){
        return await this.find({
            idUser: id,
        });
    }

    async findByFilter(payload){
        const job = await this.extractJobData(payload);
        delete job.dateTimeCreate;
        delete job.dateTimeUpdate;
        console.log(job);
        return await this.find(job);
    }

    async create(payload, id){
        const job = await this.extractJobData(payload, id);
        const result = await this.Contact.insertOne(job);
        return result;
    }

     async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        console.log(filter);
        const update = await this.extractJobData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update},
            { returnDocument: "after"}
        );
        return result;
    }

    async countTotal(id) {
        return await this.Contact.countDocuments({ idUser: id });
    }

    async findByKey(key) {
        return await this.find({
            jobName: { $regex: new RegExp(new RegExp(key)), $options: "i"},
        })
    }

    async findByProvince(province) {
        return await this.find({
            address: { $regex: new RegExp(new RegExp(province)), $options: "i"},
        })
    }

    async delete(id, userId){
        const result = this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            idUser: userId,
        });
        return result;
    }
}
module.exports = JobService;