"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECherhaProvider = void 0;
class ECherhaProvider {
    name = 'eCherha';
    async fetchData(pointName) {
        if (pointName === 'Ягодин') {
            return { trucks: 450, buses: 12, waitTimeMins: 1440, confidenceScore: 0.95 };
        }
        return null;
    }
}
exports.ECherhaProvider = ECherhaProvider;
//# sourceMappingURL=echerha.provider.js.map