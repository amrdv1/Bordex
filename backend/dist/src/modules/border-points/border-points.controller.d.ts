import { BorderPointsService } from './border-points.service';
export declare class BorderPointsController {
    private readonly borderPointsService;
    constructor(borderPointsService: BorderPointsService);
    getAll(): Promise<({
        country: {
            id: string;
            name: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
        };
        queueData: {
            id: string;
            borderPointId: string;
            cars: number;
            trucks: number;
            buses: number;
            pedestrians: number;
            waitTimeMins: number;
            lastUpdated: Date;
            sourceId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        lat: number;
        lng: number;
        isOpen: boolean;
        countryId: string;
    })[]>;
    getOne(id: string): Promise<({
        country: {
            id: string;
            name: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
        };
        queueData: {
            id: string;
            borderPointId: string;
            cars: number;
            trucks: number;
            buses: number;
            pedestrians: number;
            waitTimeMins: number;
            lastUpdated: Date;
            sourceId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        lat: number;
        lng: number;
        isOpen: boolean;
        countryId: string;
    }) | null>;
    getByCountry(code: string): Promise<({
        queueData: {
            id: string;
            borderPointId: string;
            cars: number;
            trucks: number;
            buses: number;
            pedestrians: number;
            waitTimeMins: number;
            lastUpdated: Date;
            sourceId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        lat: number;
        lng: number;
        isOpen: boolean;
        countryId: string;
    })[]>;
}
