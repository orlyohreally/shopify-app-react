const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    butterCMSToken: String,
    pageSlug: String,
    displayScope: {
      type: String,
      default: "ORDER_STATUS",
      enum: ["ALL", "ONLINE_STORE", "ORDER_STATUS"],
    },
    active: Boolean,
    position: {
      type: String,
      default: "center",
      enum: ["center", "bottom", "top", "custom"],
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { versionKey: false, autoIndex: true }
);
ShopSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
ShopSchema.pre("updateOne", function () {
  this.update({}, { $set: { updatedAt: new Date() } });
});
const ShopModel = mongoose.model("ShopModel", ShopSchema);
module.exports = { ShopModel };
