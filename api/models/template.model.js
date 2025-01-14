import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: 'uncategorized',
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        }
    },
    {
        timestamps: true
    },
)

const Template = mongoose.model('Template', templateSchema);
export default Template;