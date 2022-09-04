import { validations } from "../middlewares/validations";
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import { companyInsertCard } from "../repositories/companyRepository";
import { validateCreatCardSchema, validateActivateCardSchema } from "../middlewares/validateSchemas";



export async function creatCardService (key: string, createInfo: { employeeId: number, type: string }) {

    await validations.companyValidation(key); // Verifying the key and getting the company responsable

    validateCreatCardSchema(createInfo); // Validate if the information was send correctly
    
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

}

export async function activateCardService (activateInfo: { number: string, securityNumber: string, password: string }) {

    validateActivateCardSchema(activateInfo);
    // Informações validadas. Agora precisamos validar as regras de negócio.

}