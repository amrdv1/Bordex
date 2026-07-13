"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebcamsProvider = void 0;
class WebcamsProvider {
    name = 'Webcams AI Analytics';
    async fetchData(pointName) {
        if (pointName === 'Ягодин') {
            return { cars: 115, waitTimeMins: 220, confidenceScore: 0.80 };
        }
        return null;
    }
}
exports.WebcamsProvider = WebcamsProvider;
//# sourceMappingURL=webcams.provider.js.map