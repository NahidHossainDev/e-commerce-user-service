"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentValidationService = void 0;
const common_1 = require("@nestjs/common");
let ComponentValidationService = class ComponentValidationService {
    validateData(type, rawData) {
        if (!rawData ||
            typeof rawData !== 'object' ||
            Object.keys(rawData).length === 0) {
            throw new common_1.BadRequestException({
                message: `Validation failed for component type ${type}`,
                errors: ['Component data should not be empty'],
            });
        }
        return Promise.resolve(rawData);
    }
};
exports.ComponentValidationService = ComponentValidationService;
exports.ComponentValidationService = ComponentValidationService = __decorate([
    (0, common_1.Injectable)()
], ComponentValidationService);
//# sourceMappingURL=validation.service.js.map