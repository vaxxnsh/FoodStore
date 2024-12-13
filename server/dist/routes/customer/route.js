"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handler_1 = require("../../controllers/customer/handler");
const router = (0, express_1.Router)();
router.post('/signup', handler_1.signup);
router.post('/login', handler_1.login);
exports.default = router;
