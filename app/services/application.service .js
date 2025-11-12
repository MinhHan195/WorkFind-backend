
class ApplicationService {
    constructor(client) {
        this.Contact = client.db().collection("application");
    }

    async extractApplicationData(payload) {
        const application = {
            userName: payload.userName,
            userId: payload.userId,
            companyName: payload.companyName,
            companyId: payload.companyId,
            jobName: payload.jobName,
            jobId: payload.jobId,
            state: payload.state,
            cvUrl: payload.cvUrl,
            cvPublicId: payload.cvPublicId,
            cvUrl: payload.cvUrl,
            dateTimeCreate: new Date(),

        }
        return application;
    }

    async create(payload) {
        const application = await this.extractApplicationData(payload);
        const result = await this.Contact.findOneAndUpdate(
            application,
            { $set: { state: "Chờ duyệt" } },
            { ReturnDocument: "after", upsert: true }
        )
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

}

module.exports = ApplicationService;