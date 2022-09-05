import joi from "joi";




export const rechargeSchema = joi.object({
    number: joi.string().required(),
    amount: joi.number().positive().required()
});

export const buyingSchema = joi.object({
    number: joi.string().required(),
    password: joi.string().regex(/^[0-9]{4}$/).required(),
    amount: joi.number().positive().required(),
    businessName: joi.string().required()
})



//export const rechargeSchema = {}
    