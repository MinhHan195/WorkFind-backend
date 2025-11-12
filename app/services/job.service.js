const { object } = require("joi");
const { ObjectId } = require("mongodb");
const { sub } = require("date-fns");

class JobService {
    constructor(client) {
        this.Contact = client.db().collection("job");
    }

    async extractJobData(payload, id) {
        const job = {
            idUser: id,
            nameCompany: payload.nameCompany,
            totalEmployees: payload.staffNumber,
            websiteLink: payload.urlWebSitew,
            companyDescription: payload.companyDescription,
            jobName: payload.jobName,
            province: payload.province,
            provinceContact: payload.provinceContact,
            district: payload.district,
            districtContact: payload.districtContact,
            ward: payload.ward,
            wardContact: payload.wardContact,
            jobDescription: payload.jobDescription,
            salary: payload.salary,
            educationLevel: payload.educationLevel,
            experienceLevel: payload.experienceLevel,
            careerLevel: payload.careerLevel,
            positionType: payload.positionType,
            gender: payload.gender,
            typeJob: payload.typeJob,
            addressContact: payload.addressContact,
            staffName: payload.staffName,
            phone: payload.phone,
            attention: payload.attention,
            jobRequirements: payload.jobRequirements,
            maxSalary: payload.maxSalary,
            minSalary: payload.minSalary,
            salary: payload.salary,
            provinceContact: payload.provinceContact,
            districtContact: payload.districtContact,
            wardContact: payload.wardContact,
            status: payload.status,
            dateTimeCreate: new Date(),
            dateTimeUpdate: new Date(),
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

    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByUserId(id) {
        return await this.find({
            idUser: id,
        });
    }

    async findByFilter(payload) {
        const filter = [];
        Object.entries(payload).forEach(([key, value]) => {
            if (key !== "maxSalary" && key !== "minSalary" && key !== "dateTimeCreate") {
                const temp = {}
                temp[key] = { $in: Array.isArray(value) ? value : [value] }
                filter.push(temp);
            }
        })
        if (payload.minSalary !== undefined && payload.maxSalary !== undefined && payload.minSalary != 0 && payload.maxSalary != 100) {
            filter.push({ salary: { $gt: payload.minSalary, $lt: payload.maxSalary } })
        }
        if (payload.dateTimeCreate !== undefined) {
            const now = new Date();
            if (payload.dateTimeCreate === "Hôm nay") {
                filter.push({ dateTimeCreate: { $gte: sub(now, { days: 1 }), $lt: now } })
            } else if (payload.dateTimeCreate === "3 ngày") {
                filter.push({ dateTimeCreate: { $gte: sub(now, { days: 3 }), $lt: now } })
            } else if (payload.dateTimeCreate === "1 tuần") {
                filter.push({ dateTimeCreate: { $gte: sub(now, { weeks: 1 }), $lt: now } })
            } else if (payload.dateTimeCreate === "2 tuần") {
                filter.push({ dateTimeCreate: { $gte: sub(now, { weeks: 2 }), $lt: now } })
            } else if (payload.dateTimeCreate === "1 tháng") {
                filter.push({ dateTimeCreate: { $gte: sub(now, { months: 1 }), $lt: now } })
            }
        }
        const cursor = await this.Contact.find({ $or: filter })
        return await cursor.toArray()
    }

    async create(payload, id) {
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
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async countTotal(id) {
        return await this.Contact.countDocuments({ idUser: id });
    }

    jobToString(list) {
        return list.map((job) => {
            return [job.nameCompany, job.staffNumber, job.jobName, job.province, job.district, job.benefits, job.salary, job.educationLevel, job.experienceLevel, job.careerLevel, job.positionType, job.gender].join(" ").toLowerCase();
        })
    }

    async findByProvince(province) {
        return await this.find({
            address: { $regex: new RegExp(new RegExp(province)), $options: "i" },
        })
    }

    async delete(id, userId) {
        const result = this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            idUser: userId,
        });
        return result;
    }
}
module.exports = JobService;