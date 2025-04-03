const {ObjectId} = require("mongodb");

class CompanyService{
    constructor(client) {
        this.Contact = client.db().collection("company");
    }

    async extractCompanyData(payload, id){
        const company = {
            accountId: id,
            nameCompany: payload.nameCompany,
            email: payload.email,
            address: payload.address,
            province: payload.province,
            district: payload.district,
            phone: payload.phone,
            totalEmployees: payload.totalEmployees,
            description: payload.description,
        };
        Object.keys(company).forEach(
            (key) => company[key] === undefined && delete company[key]
        );
        return company;
    }

    async create(payload, id) {
        const company = await this.extractCompanyData(payload, id);
        const result = await this.Contact.insertOne(company);
        return result;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByAccountId(id) {
        return await this.find({
            accountId: id
        });
    }

    async deleteByAccountId(id){
        const result = await this.Contact.findOneAndDelete({
            accountId: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = CompanyService;