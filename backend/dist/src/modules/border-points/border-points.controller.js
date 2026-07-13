"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderPointsController = void 0;
const common_1 = require("@nestjs/common");
const border_points_service_1 = require("./border-points.service");
let BorderPointsController = class BorderPointsController {
    borderPointsService;
    constructor(borderPointsService) {
        this.borderPointsService = borderPointsService;
    }
    async getAll() {
        return this.borderPointsService.findAll();
    }
    async getOne(id) {
        return this.borderPointsService.findOne(id);
    }
    async getByCountry(code) {
        return this.borderPointsService.findByCountry(code);
    }
};
exports.BorderPointsController = BorderPointsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BorderPointsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BorderPointsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)('country/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BorderPointsController.prototype, "getByCountry", null);
exports.BorderPointsController = BorderPointsController = __decorate([
    (0, common_1.Controller)('border-points'),
    __metadata("design:paramtypes", [border_points_service_1.BorderPointsService])
], BorderPointsController);
//# sourceMappingURL=border-points.controller.js.map