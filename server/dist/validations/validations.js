"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Name is required.' }),
    email: zod_1.z.string().email({ message: 'Invalid email address.' }),
    phoneNumber: zod_1.z.string().min(10, { message: 'Phone number should be at least 10 digits.' }).max(10, { message: 'Phone number should be at most 10 digits.' }),
    address: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6, { message: 'Password should be at least 6 characters.' }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email address.' }),
    password: zod_1.z.string().min(6, { message: 'Password should be at least 6 characters.' }),
});
