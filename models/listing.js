const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true, // Owner is required for each listing
  },
  geometry: {
    type: {
        type: String, // e.g., 'Point'
        enum: ['Point'], // Only 'Point' is allowed
        required: true,
    },
    coordinates: {
        type: [Number], // Array of numbers for [longitude, latitude]
        required: true,
    },
   
},
});

listingSchema.post("findOneDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

