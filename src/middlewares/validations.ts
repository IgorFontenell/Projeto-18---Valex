import { companyExist, employeeExist, employeeCards } from "../repositories/companyRepository";
import createCardSchema from "../schema/creatCardSchema";


function validateCardSchema(cardInfo: { employeeId: number, type: string }) {
    
    cardInfo.employeeId = Number(cardInfo.employeeId);
    const validation =  createCardSchema.validate(cardInfo);
    
    if(validation.error) {
        throw {type: "bad_request", message: "Registration incorrectly done! Please try again!"};
    }
}

async function companyValidation (key: string) {
    const company = await companyExist(key);
    if(company === undefined) {
        throw {type: "not_found", message: "Company not found!"};
    }
    return company;
}

async function employeeVerify (type: string, employeeId: number) {
    const employee = await employeeExist(employeeId);
    if (employee === undefined) {
        throw {type: "not_found", message: "Employee not found!"};
    } 
    
    const employeeCard = await employeeCards(employeeId);
    const findingExistingType = employeeCard.find((object: { type: string; } ) => object.type === type);
    if (findingExistingType) {
        throw {type: "not_acceptable", message: "Employee can only have 1 card of each type!"};
    }
    
    return employee;
}



export const validations = {
    companyValidation,
    validateCardSchema,
    employeeVerify
} 
