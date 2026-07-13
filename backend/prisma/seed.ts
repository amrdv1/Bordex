import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding countries...');
  const pl = await prisma.country.upsert({
    where: { code: 'PL' },
    update: {},
    create: { name: 'Польша', code: 'PL' },
  });
  const sk = await prisma.country.upsert({
    where: { code: 'SK' },
    update: {},
    create: { name: 'Словакия', code: 'SK' },
  });
  const hu = await prisma.country.upsert({
    where: { code: 'HU' },
    update: {},
    create: { name: 'Венгрия', code: 'HU' },
  });
  const ro = await prisma.country.upsert({
    where: { code: 'RO' },
    update: {},
    create: { name: 'Румыния', code: 'RO' },
  });
  const md = await prisma.country.upsert({
    where: { code: 'MD' },
    update: {},
    create: { name: 'Молдова', code: 'MD' },
  });

  console.log('Seeding border points...');
  // Delete all existing points to avoid duplicates if re-seeded without upsert
  await prisma.borderPoint.deleteMany({});
  
  const points = [
    { name: 'Ягодин', countryId: pl.id, lat: 51.2185, lng: 23.8058 },
    { name: 'Устилуг', countryId: pl.id, lat: 50.8587, lng: 24.1561 },
    { name: 'Угринов', countryId: pl.id, lat: 50.5843, lng: 24.1039 },
    { name: 'Рава-Русская', countryId: pl.id, lat: 50.2588, lng: 23.5936 },
    { name: 'Грушев', countryId: pl.id, lat: 50.1215, lng: 23.3276 },
    { name: 'Краковец', countryId: pl.id, lat: 49.9575, lng: 23.0232 },
    { name: 'Шегини', countryId: pl.id, lat: 49.7981, lng: 22.9511 },
    { name: 'Смильница', countryId: pl.id, lat: 49.4673, lng: 22.7845 },
    { name: 'Ужгород', countryId: sk.id, lat: 48.6083, lng: 22.2514 },
    { name: 'Малый Березный', countryId: sk.id, lat: 48.8872, lng: 22.4283 },
    { name: 'Чоп (Тиса)', countryId: hu.id, lat: 48.4239, lng: 22.1818 },
    { name: 'Лужанка', countryId: hu.id, lat: 48.1678, lng: 22.6567 },
    { name: 'Дьяково', countryId: ro.id, lat: 48.0125, lng: 23.0456 },
    { name: 'Порубное', countryId: ro.id, lat: 48.0142, lng: 26.0628 },
    { name: 'Паланка', countryId: md.id, lat: 46.4089, lng: 30.0921 },
    { name: 'Маяки-Удобное', countryId: md.id, lat: 46.4161, lng: 30.2503 },
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
