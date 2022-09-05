import { validations } from "../middlewares/validations";
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import { blockCardRepository, companyInsertCard, insertPassword, lookingForCard, lookingForTransactions, unBlockCardRepository } from "../repositories/companyRepository";
import { validateCreatCardSchema, validateSchemas } from "../middlewares/validateSchemas";
import { cardSchemas } from "../schema/cardSchemas";



export async function creatCardService (key: string, createInfo: { employeeId: number, type: string }) {

    await validations.companyValidation(key); // Verifying the key and getting the company responsable

    await validateCreatCardSchema(createInfo); // Validate if the information was send correctly
    
    const { type, employeeId } = createInfo;
    const employee: any = await validations.employeeVerify(type, employeeId); // Verifying if the employee Exists and if he already has the type of card that is been requested
    const cardName: string = employee.fullName // Getting the name of the card in the correct form.
    .toUpperCase()
    .split(" ")
    .filter((object: string) => object.length >= 3)
    .map((object: string, index: number) => {
        if(index === 1) {
            return object[0];
        } else {
            return object
        }
    })
    .join(" ");
    
    const cardNumber: string = faker.finance.account(); // Getting fake 8 numbers for the card
    
    const cardExpireDate = dayjs().add(5, 'year').format('MM/YY'); // Getting the expire date 5 years from now

    const cryptr = new Cryptr('myTotallySecretKey');
    const encryptedNumber = cryptr.encrypt(faker.finance.account(3)); // Creating a CVC number already encrypt

    const card = {
        employeeId: employeeId,
        number: cardNumber,
        cardholderName: cardName,
        securityCode: encryptedNumber,
        expirationDate: cardExpireDate,
        isVirtual: false,
        isBlocked: false,
        type: type
    };

    await companyInsertCard(card); // Inserting into the database the card information.

    return;

}

export async function activateCardService (activateInfo: { number: string, securityNumber: string, password: string }) {
    
    await validateSchemas(cardSchemas.activateCardSchema, activateInfo); // Validate the schema
    await validations.cardVerify(activateInfo); // Validate the work rules for the action.

    const cryptr = new Cryptr('myTotallySecretKey');
    const encryptedPassword = cryptr.encrypt(activateInfo.password);// Encrypting the password
    
    
    await insertPassword(activateInfo.number, encryptedPassword); // Updating the password into the database.

    return;
}

export async function showBalanceService (number: string){
    console.log(number);
    const card = await lookingForCard(number); // Getting the card.
    await validations.cardExist(card);

    const allTransactions = await lookingForTransactions(card.id);
    
    if(allTransactions.length === 0) {
        return ({
            "balance": 0
        })
    } 
    let balance: number = 0;
    allTransactions.transactions.map((object: { amount: number; }) => balance -= object.amount);
    allTransactions.recharges.map((object: { amount: number; }) => balance += object.amount);

    const resume = {
        "balance": balance,
        allTransactions
    };
    return resume;
    
}

export async function blockCardService(cardInfo: { number: string, password: string }) {

    await validateSchemas(cardSchemas.blockCardSchema, cardInfo); // Validating the estructure of the information

    const card = await lookingForCard(cardInfo.number); // Looking for the card 
    await validations.cardIsBlockable(card, cardInfo.password); // Veryfing if the work rules are ok!
    await blockCardRepository(cardInfo.number);

    return;
}

export async function unBlockCardService(cardInfo: { number: string, password: string }) {

    await validateSchemas(cardSchemas.blockCardSchema, cardInfo); // Validating the estructure of the information

    const card = await lookingForCard(cardInfo.number); // Looking for the card 
    await validations.cardIsUnBlockable(card, cardInfo.password); // Veryfing if the work rules are ok!
    await unBlockCardRepository(cardInfo.number);

    return;
}