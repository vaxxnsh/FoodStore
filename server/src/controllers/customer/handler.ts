import { Handler, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';
import { loginSchema,signupSchema } from '../../validations/validations';

const JWT_SECRET = process.env.JWT_SECRET!;

export const signup = async (req: Request, res: Response) : Promise<void> => {
    const { name, email, phoneNumber, address, password } = req.body;

    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.errors.map((error) => error.message);
        res.status(400).json({
            message: 'Validation failed.',
            errors: errorMessages,
        });
        return;
    }

    try {
        const existingUser = await prisma.customer.findFirst({
            where: {
              OR: [
                { phoneNumber: phoneNumber },
                { email: email }
              ]
            }
          });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await prisma.customer.create({
            data: {
                name, 
                email, 
                phoneNumber, 
                address, 
                password: hashedPassword,
            },
        });

        const token = jwt.sign(
            { customerID: customer.customerID, email: customer.email },
            JWT_SECRET
        );

        res.status(201).json({
            message: 'User created successfully.',
            token,
            customerID: customer.customerID,
            email: customer.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

export const login = async (req: Request, res: Response) : Promise<void> => {
    const { email, password } = req.body;

    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.errors.map((error) => error.message);
        res.status(400).json({
            message: 'Validation failed.',
            errors: errorMessages,
        });
        return;
    }

    try {
        const customer = await prisma.customer.findUnique({
            where: { 
                email: email 
            },
        });

        if (!customer) {
            res.status(400).json({ message: 'Invalid email or password.' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, customer.password);

        if (!passwordMatch) {
            res.status(400).json({ message: 'Invalid email or password.' });
            return;
        }

        const token = jwt.sign(
            { customerID: customer.customerID, email: customer.email },
            JWT_SECRET
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            customerID: customer.customerID,
            email: customer.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};