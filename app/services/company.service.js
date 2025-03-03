const {ObjectId} = require("mongodb");

class CompanyService{
    constructor(client) {
        this.Contact = client.db().collection("company");
    }

    async extractCompanyData(payload, id){
        const company = {
            id: id,
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            totalEmployees: payload.totalEmployees,
            description: payload,
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

    async deleteCompany(id){
        const result = await this.Contact.findOneAndDelete({
            id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = CompanyService;