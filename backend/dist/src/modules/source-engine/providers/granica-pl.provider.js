"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GranicaPlProvider = void 0;
class GranicaPlProvider {
    name = 'granica.gov.pl';
    async fetchData(pointName) {
        if (pointName === 'Ягодин') {
            return { cars: 150, waitTimeMins: 300, confidenceScore: 0.85 };
        }
        return null;
    }
}
exports.GranicaPlProvider = GranicaPlProvider;
//# sourceMappingURL=granica-pl.provider.js.map