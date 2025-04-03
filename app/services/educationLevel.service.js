class EducationLevel{
    constructor(client) {
        this.Contact = client.db().collection("educationlevel");
    }

    async find(filter){
        const cusor = await this.Contact.find(filter);
        return await cusor.toArray();
    }
}
module.exports = EducationLevel;