const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.get = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
};


mongoose.Query.prototype.exec = async function () {

    if (!this.useCache) {
        return await exec.apply(this, arguments);
    }
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {collection: this.mongooseCollection.name})
    );
    const cacheValue = await client.get(this.hashKey, key);

    if (cacheValue) {
        let doc = JSON.parse(cacheValue);
        doc = Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(d);
        return doc;
    }


    const result = await exec.apply(this, arguments);
    console.log(result);

    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 100);

    return result;

};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};

