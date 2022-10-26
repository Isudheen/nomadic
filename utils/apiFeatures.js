class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['fields', 'sort', 'page', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1B. Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    //replace matched expression with $ prepended to the expression, to get eg. $gte in MQL for mongo. eg.
    // { difficulty: 'easy', duration: { $gte: 5 } } because incoming query(from url - duration[gte]=5) ,will be like:
    // { difficulty: 'easy', duration: { gte: 5 } }
    // in regex \b for selecting exact words and g flag for all occurrence
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const multiSort = this.queryString.sort.split(',').join(' '); // If current sort query is sort=price,-ratingsAverage
      //Splits the comma separated string into an array and join into one string with space b/w words. minus sign sorts in descending order.
      this.query = this.query.sort(multiSort);
      console.log(multiSort);
    } else {
      this.query = this.query.sort('-createdAt'); //default sort. descending order of time
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const allFields = this.queryString.fields.split(',').join(' '); //---Inclusion projection If current query is fields=name,price ----name and price are included
      this.query = this.query.select(allFields);
      console.log(allFields);
    } else {
      this.query = this.query.select('-__v'); //default condition. minus sign means exclusion projection __v is excluded. Cannot use inclusion and exclusion projections together.
    }
    return this;
  }

  paginate() {
    // eg. page=2&limit=10...Here on page 1: 1st-10th entries, on page 2: 11th-20th entries etc...
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
