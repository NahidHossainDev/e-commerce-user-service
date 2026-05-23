"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsComponentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_components_controller_1 = require("./admin-components.controller");
const components_repository_1 = require("./components.repository");
const components_service_1 = require("./components.service");
const component_schema_1 = require("./schemas/component.schema");
const validation_service_1 = require("./validation.service");
let CmsComponentsModule = class CmsComponentsModule {
};
exports.CmsComponentsModule = CmsComponentsModule;
exports.CmsComponentsModule = CmsComponentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: component_schema_1.CmsComponent.name, schema: component_schema_1.CmsComponentSchema },
            ]),
        ],
        controllers: [admin_components_controller_1.AdminCmsComponentsController],
        providers: [
            components_service_1.CmsComponentsService,
            components_repository_1.CmsComponentsRepository,
            validation_service_1.ComponentValidationService,
        ],
        exports: [components_service_1.CmsComponentsService, mongoose_1.MongooseModule],
    })
], CmsComponentsModule);
//# sourceMappingURL=components.module.js.map