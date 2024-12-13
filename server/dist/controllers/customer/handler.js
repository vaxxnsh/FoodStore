"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const validations_1 = require("../../validations/validations");
const JWT_SECRET = process.env.JWT_SECRET;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, address, password } = req.body;
    const result = validations_1.signupSchema.safeParse(req.body);
    if (!result.success) {
        const errorMessages = result.error.errors.map((error) => error.message);
        res.status(400).json({
            message: 'Validation failed.',
            errors: errorMessages,
        });
        return;
    }
    try {
        const existingUser = yield prisma_1.default.customer.findFirst({
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
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const customer = yield prisma_1.default.customer.create({
            data: {
                name,
                email,
                phoneNumber,
                address,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ customerID: customer.customerID, email: customer.email }, JWT_SECRET);
        res.status(201).json({
            message: 'User created successfully.',
            token,
            customerID: customer.customerID,
            email: customer.email,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = validations_1.loginSchema.safeParse(req.body);
    if (!result.success) {
        const errorMessages = result.error.errors.map((error) => error.message);
        res.status(400).json({
            message: 'Validation failed.',
            errors: errorMessages,
        });
        return;
    }
    try {
        const customer = yield prisma_1.default.customer.findUnique({
            where: {
                email: email
            },
        });
        if (!customer) {
            res.status(400).json({ message: 'Invalid email or password.' });
            return;
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, customer.password);
        if (!passwordMatch) {
            res.status(400).json({ message: 'Invalid email or password.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ customerID: customer.customerID, email: customer.email }, JWT_SECRET);
        res.status(200).json({
            message: 'Login successful.',
            token,
            customerID: customer.customerID,
            email: customer.email,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});
exports.login = login;
