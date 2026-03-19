import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Seller Account
  const seller = await prisma.user.upsert({
    where: { email: 'admin@browniedameme.com' },
    update: {},
    create: {
      email: 'admin@browniedameme.com',
      name: 'Meme',
      password: 'admin',
      role: 'SELLER',
    },
  });

  // Create some initial products
  const products = [
    {
      name: 'Brownie Tradicional',
      description: 'O clássico brownie de chocolate meio amargo, macio por dentro e com aquela casquinha crocante.',
      price: 8.50,
      stock: 50,
    },
    {
      name: 'Brownie de Nutella',
      description: 'Nosso brownie tradicional generosamente recheado com a verdadeira Nutella.',
      price: 12.00,
      stock: 30,
    },
    {
      name: 'Brownie de Doce de Leite',
      description: 'A combinação perfeita do chocolate com o cremoso doce de leite mineiro.',
      price: 10.50,
      stock: 25,
    },
    {
      name: 'Pote da Felicidade',
      description: 'Camadas de brownie, brigadeiro belga e morangos frescos no pote.',
      price: 18.00,
      stock: 15,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 }, // Simulating unique check or use name
      update: product,
      create: product,
    });
  }

  console.log('Seeded initial data: Seller and Brownies.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
