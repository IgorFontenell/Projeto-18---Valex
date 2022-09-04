import { companyExist, employeeExist, employeeCards } from "../repositories/companyRepository";
import { lookingForCard } from "../repositories/companyRepository";
import Cryptr from 'cryptr';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

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

async function cardVerify (cardInfo: { number: string, securityNumber: string, password: string }) {
    const cryptr = new Cryptr('myTotallySecretKey');
    const card = await lookingForCard(cardInfo.number);
   
    if(card === undefined) {
        throw { type: "not_found", message: "Card do not exist!" };
    }
    
    if(cryptr.decrypt(card.securityCode) !== cardInfo.securityNumber) {
        throw { type: "unauthorized", message: "CVC code incorrect" }
    }
    
    const today: string= dayjs().format("MM/YY");
    if(today > card.expirationDate) {
        throw { type: "forbidden", message: "The card already expired" }
    }
    
    if(card.password !== null) {
        throw { type: "not_acceptable", message: "The card already has a password" }
    }

}


export const validations = {
    companyValidation,
    employeeVerify,
    cardVerify
} 
