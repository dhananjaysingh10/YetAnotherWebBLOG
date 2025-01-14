import { errorHandler } from "../utils/error.js"
import Template from '../models/template.model.js'

export const getTemplate = async (req, res, next) => {
    try {
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const templates = await Template.find({
            ...(req.query.category && req.query.category !== 'uncategorized' && {
                category: { $regex: new RegExp(req.query.category, 'i') } // Case-insensitive category search
            }),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.searchTerm && {
                $or: [
                    {title: {$regex: req.query.searchTerm, $options: 'i'}},
                    {content: {$regex: req.query.searchTerm, $options: 'i'}},
                ],
            }),
        }).sort({updatedAt: sortDirection});
        res.status(200).json({
            templates
        });
    } catch (error) {
        next(error);
    }
}