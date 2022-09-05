import { companyExist, employeeExist, employeeCards } from "../repositories/companyRepository";
import { lookingForCard } from "../repositories/companyRepository";
import Cryptr from 'cryptr';
import dayjs from 'dayjs';


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
        throw { type: "forbidden", message: "The card already has expired" }
    }
    
    if(card.password !== null) {
        throw { type: "not_acceptable", message: "The card already has a password" }
    }

}

async function cardExist(card: any) {
    if(card === undefined) {
        throw {type: "not_found", message: "Card not found!"};
    }
}

async function cardIsBlockable(card: any, password: string) {

    if(card === undefined) {
        throw {type: "not_found", message: "Card not found!"};
    }

    const today: string= dayjs().format("MM/YY");
    if(today > card.expirationDate) {
        throw { type: "forbidden", message: "The card already has expired!" }
    }

    if(card.isBlocked === true) {
        throw { type: "not_acceptable", message: "The card is already blocked!" }
    }

    const cryptr = new Cryptr('myTotallySecretKey');
    const passwordDecypt = cryptr.decrypt(card.password);
    if(password !== passwordDecypt) {
        throw { type: "unauthorized", message: "The password is incorrect!" }
    }

    return;
}
async function cardIsUnBlockable(card: any, password: string) {

    if(card === undefined) {
        throw {type: "not_found", message: "Card not found!"};
    }

    const today: string= dayjs().format("MM/YY");
    if(today > card.expirationDate) {
        throw { type: "forbidden", message: "The card already has expired!" }
    }

    if(card.isBlocked === false) {
        throw { type: "not_acceptable", message: "The card isn't blocked!" }
    }

    const cryptr = new Cryptr('myTotallySecretKey');
    const passwordDecypt = cryptr.decrypt(card.password);
    if(password !== passwordDecypt) {
        throw { type: "unauthorized", message: "The password is incorrect!" }
    }

    return;
}


export const validations = {
    companyValidation,
    employeeVerify,
    cardVerify,
    cardExist,
    cardIsBlockable,
    cardIsUnBlockable
} 
