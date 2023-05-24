// docs https://docs.mongodb.com/manual/tutorial/query-array-of-documents/

// Get cards with usd value greater than $10
db.COLLECTIONNAME.find(
  { "historicalPrices.0.price.usd": { $gt: 10 } },
  { name: 1, historicalPrices: 1 }
);

// find historicalPrices that were inserted greater than 2021-05-30
db.COLLECTIONNAME.findOne(
  {
    historicalPrices: {
      $elemMatch: { date: { $gt: ISODate("2021-05-30T00:00:00Z") } },
    },
  },
  { name: 1, historicalPrices: 1 }
);
// example: find in array 
// return all cards who have been worth more than 15 dollars at some point in
// their price history
db.cardstwo.find({historicalPrices:{$elemMatch:{ "price.usd": {"$gt":15}}}},{name:1})

// remove last price item
db.cardstwo.update({_id:"19992dbd-7a6a-43d3-b1db-01716b2eed27"},{$pop: {historicalPrices:1}})
