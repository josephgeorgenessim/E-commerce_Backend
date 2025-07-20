class ApiFeatures {

    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = {};
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword'];

        Object.keys(this.queryString).forEach(key => {
            if (excludedFields.includes(key)) return;

            const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/); // e.g. price[gte]
            if (match) {
                const field = match[1]; // 'price'
                const op = `$${match[2]}`; // '$gte'
                if (!queryObj[field]) queryObj[field] = {};
                queryObj[field][op] = Number(this.queryString[key]); // convert to number
            } else {
                queryObj[key] = this.queryString[key];
            }
        });

        this.mongooseQuery = this.mongooseQuery.find(queryObj);

        return this;
    }

    sort() {

        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt")

        }
        return this;
    }

    limitFields() {

        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }

        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName == "Products") {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } }
                ];
            } else {
                query.$or = [
                    { name: { $regex: this.queryString.keyword, $options: 'i' } },

                ];
            }


            this.mongooseQuery = this.mongooseQuery.find(query);
        }

        return this;
    }

    pagination() {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 5;
        const skip = (page - 1) * limit;

        let pagination = {}
        pagination.page = page
        pagination.limit = limit


        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
        this.paginationResult = pagination
        return this;
    }
}

module.exports = ApiFeatures