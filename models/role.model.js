const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const roleSchema = new mongoose.Schema(
    {
        title: String,
        product_catalog_id: {
            type: String,
            default: "",
        },
        description: String,
        permissions: {
            type: Array,
            default: [],
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
