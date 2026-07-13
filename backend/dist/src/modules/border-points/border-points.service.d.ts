import { PrismaService } from '../../prisma.service';
export declare class BorderPointsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
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
    findOne(id: string): Promise<({
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
    findByCountry(countryCode: string): Promise<({
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
