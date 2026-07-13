"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTrafficProvider = void 0;
class GoogleTrafficProvider {
    name = 'Google Maps Traffic API';
    async fetchData(pointName) {
        if (pointName === 'Ягодин') {
            return { waitTimeMins: 1200, confidenceScore: 0.70 };
        }
        return null;
    }
}
exports.GoogleTrafficProvider = GoogleTrafficProvider;
//# sourceMappingURL=google-traffic.provider.js.map