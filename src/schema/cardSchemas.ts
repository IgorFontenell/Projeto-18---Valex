import joi from "joi";


const createCardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.string().valid('groceries', 'restaurants', 'transport', 'education', 'health').required()
});

const activateCardSchema = joi.object({
    number: joi.string().required(),
    securityNumber: joi.string().required(),
    password: joi.string().regex(/^[0-9]{4}/).required()
});

const blockCardSchema = joi.object({
    number: joi.string().required(),
    password: joi.string().regex(/^[0-9]{4}$/).required()
});

export const cardSchemas = {
    createCardSchema,
    activateCardSchema,
    blockCardSchema
};