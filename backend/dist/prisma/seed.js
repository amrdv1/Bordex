"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding countries...');
    const pl = await prisma.country.upsert({
        where: { code: 'PL' },
        update: {},
        create: { name: 'Польща', code: 'PL' },
    });
    const sk = await prisma.country.upsert({
        where: { code: 'SK' },
        update: {},
        create: { name: 'Словаччина', code: 'SK' },
    });
    const hu = await prisma.country.upsert({
        where: { code: 'HU' },
        update: {},
        create: { name: 'Угорщина', code: 'HU' },
    });
    const ro = await prisma.country.upsert({
        where: { code: 'RO' },
        update: {},
        create: { name: 'Румунія', code: 'RO' },
    });
    const md = await prisma.country.upsert({
        where: { code: 'MD' },
        update: {},
        create: { name: 'Молдова', code: 'MD' },
    });
    console.log('Seeding border points...');
    await prisma.borderPoint.deleteMany({});
    const points = [
        { name: 'Ягодин', countryId: pl.id, lat: 51.2185, lng: 23.8058 },
        { name: 'Устилуг', countryId: pl.id, lat: 50.8587, lng: 24.1561 },
        { name: 'Угринів', countryId: pl.id, lat: 50.5843, lng: 24.1039 },
        { name: 'Рава-Руська', countryId: pl.id, lat: 50.2588, lng: 23.5936 },
        { name: 'Грушів', countryId: pl.id, lat: 50.1215, lng: 23.3276 },
        { name: 'Краківець', countryId: pl.id, lat: 49.9575, lng: 23.0232 },
        { name: 'Шегині', countryId: pl.id, lat: 49.7981, lng: 22.9511 },
        { name: 'Смільниця', countryId: pl.id, lat: 49.4673, lng: 22.7845 },
        { name: 'Ужгород', countryId: sk.id, lat: 48.6083, lng: 22.2514 },
        { name: 'Малий Березний', countryId: sk.id, lat: 48.8872, lng: 22.4283 },
        { name: 'Чоп (Тиса)', countryId: hu.id, lat: 48.4239, lng: 22.1818 },
        { name: 'Лужанка', countryId: hu.id, lat: 48.1678, lng: 22.6567 },
        { name: 'Дякове', countryId: ro.id, lat: 48.0125, lng: 23.0456 },
        { name: 'Порубне', countryId: ro.id, lat: 48.0142, lng: 26.0628 },
        { name: 'Паланка', countryId: md.id, lat: 46.4089, lng: 30.0921 },
        { name: 'Маяки-Удобне', countryId: md.id, lat: 46.4161, lng: 30.2503 },
        { name: 'Орлівка', countryId: ro.id, lat: 45.2751, lng: 28.4526 },
        { name: 'Рені', countryId: md.id, lat: 45.4262, lng: 28.2120 },
        { name: 'Виноградівка', countryId: md.id, lat: 45.6961, lng: 28.5713 },
        { name: 'Табаки', countryId: md.id, lat: 45.7483, lng: 28.6128 },
        { name: 'Серпневе 1', countryId: md.id, lat: 46.3028, lng: 29.0205 },
        { name: 'Старокозаче', countryId: md.id, lat: 46.4353, lng: 29.8327 },
        { name: 'Кучурган', countryId: md.id, lat: 46.7328, lng: 29.9825 },
        { name: 'Платонове', countryId: md.id, lat: 47.3821, lng: 29.3512 },
        { name: 'Могилів-Подільський', countryId: md.id, lat: 48.4414, lng: 27.7954 },
        { name: 'Бронниця', countryId: md.id, lat: 48.4239, lng: 27.9150 },
        { name: 'Сокиряни', countryId: md.id, lat: 48.4356, lng: 27.4206 },
        { name: 'Кельменці', countryId: md.id, lat: 48.4716, lng: 26.8378 },
        { name: 'Росошани', countryId: md.id, lat: 48.3732, lng: 26.9692 },
        { name: 'Мамалига', countryId: md.id, lat: 48.2612, lng: 26.6025 },
        { name: 'Красноїльськ', countryId: ro.id, lat: 47.9868, lng: 25.5686 },
        { name: 'Вилок', countryId: hu.id, lat: 48.1068, lng: 22.8251 },
        { name: 'Косино', countryId: hu.id, lat: 48.2415, lng: 22.4729 },
        { name: 'Дзвінкове', countryId: hu.id, lat: 48.2861, lng: 22.3168 },
        { name: 'Нижанковичі', countryId: pl.id, lat: 49.6800, lng: 22.7800 }
    ];
    for (const p of points) {
        await prisma.borderPoint.create({
            data: {
                name: p.name,
                countryId: p.countryId,
                lat: p.lat,
                lng: p.lng,
            },
        });
    }
    console.log('Seeding sources...');
    await prisma.source.upsert({
        where: { name: 'dpsu.gov.ua' },
        update: {},
        create: {
            name: 'dpsu.gov.ua',
            priority: 10,
        }
    });
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map