class CareerLevel{
    constructor(client) {
        this.Contact = client.db().collection("careerlevel");
    }

    async find(filter){
        const cusor = await this.Contact.find(filter);
        return await cusor.toArray();
    }
}
module.exports = CareerLevel;