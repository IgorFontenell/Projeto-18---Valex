import { Request, Response } from "express";
import { validations } from "../middlewares/validations";
import { faker } from '@faker-js/faker';

export async function createCard(request: Request, response: Response) {
    const API_KEY: any = request.headers["x-api-key"]; // Getting the API key
    const company = await validations.companyValidation(API_KEY); // Verifying the key and getting the company responsable

    validations.validateCardSchema(request.body); // Validate if the information was send correctly

    const { type, employeeId } = request.body;
    const employee: any = validations.employeeVerify(type, employeeId); // Verifying if the employee Exists and if he already has the type of card that is been requested
    const nameArr: string = employee.fullName
    .toUpperCase()
    .split(" ")
    .filter((object: string) => object.length >= 3)
    .map((object: string, index: number) => {
        if(index === 1) {
            return object[0];
        } else {
            return object
        }
    });
    
    
    const cardNumber: string = faker.finance.account();
    

    response.status(200).send(company);
};