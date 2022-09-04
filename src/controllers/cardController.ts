import { Request, Response } from "express";
import { validations } from "../middlewares/validations";
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import { companyInsertCard } from "../repositories/companyRepository";

export async function createCard(request: Request, response: Response) {
    const API_KEY: any = request.headers["x-api-key"]; // Getting the API key
    const company = await validations.companyValidation(API_KEY); // Verifying the key and getting the company responsable

    validations.validateCardSchema(request.body); // Validate if the information was send correctly
    
    const { type, employeeId } = request.body;
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
    const encryptedNumber = cryptr.encrypt(faker.finance.account(3));

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

    await companyInsertCard(card);

    response.status(201).send("Card registered successfully");
};