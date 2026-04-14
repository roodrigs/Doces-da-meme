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

  // Create initial products with variety
  const products = [
    {
      name: 'Brownie Tradicional',
      description: 'O clássico brownie de chocolate meio amargo, macio por dentro e com aquela casquinha crocante por fora.',
      price: 8.50,
      stock: 50,
    },
    {
      name: 'Brownie de Nutella',
      description: 'Nosso brownie tradicional generosamente recheado com a verdadeira Nutella. Uma explosão de sabor!',
      price: 13.00,
      stock: 30,
    },
    {
      name: 'Brownie de Doce de Leite',
      description: 'A combinação perfeita do chocolate com o cremoso doce de leite caseiro. Uma doçura inesquecível.',
      price: 11.50,
      stock: 25,
    },
    {
      name: 'Brownie de Ninho',
      description: 'Brownie recheado com um brigadeiro de Leite Ninho super cremoso. O queridinho da Meme!',
      price: 12.00,
      stock: 20,
    },
    {
      name: 'Pote da Felicidade - Ninho c/ Nutella',
      description: 'Camadas generosas de brownie picadinho, brigadeiro de Leite Ninho e Nutella original.',
      price: 18.00,
      stock: 15,
    },
    {
      name: 'Pote da Felicidade - Dois Amores',
      description: 'Brownie em pedaços mesclado com brigadeiro preto e brigadeiro branco gourmet.',
      price: 18.00,
      stock: 15,
    },
    {
      name: 'Brownie Blondie (Branco)',
      description: 'Uma versão feita com chocolate branco e um toque especial de baunilha. Delicado e saboroso.',
      price: 10.00,
      stock: 15,
    },
    {
      name: 'Marmitinha de Brownie',
      description: 'Uma generosa porção de brownie servida na marmitinha, perfeita para compartilhar ou para os amantes de doçura.',
      price: 25.00,
      stock: 10,
    },
    {
      name: 'Brownie de Oreo',
      description: 'Nosso brownie tradicional com pedaços crocantes de biscoito Oreo por dentro e por cima.',
      price: 13.00,
      stock: 20,
    },
    {
      name: 'Brownie de Pistache',
      description: 'Brownie gourmet recheado com um sofisticado creme de pistache artesanal.',
      price: 16.50,
      stock: 15,
    },
    {
      name: 'Brownie de Brigadeiro Belga',
      description: 'Brownie coberto com brigadeiro feito com chocolate belga legítimo e granulados gourmet.',
      price: 14.00,
      stock: 25,
    },
    {
      name: 'Combo Degustação (4 unidades)',
      description: 'Uma caixa especial com 4 mini brownies de sabores variados (Tradicional, Nutella, Ninho e Oreo).',
      price: 45.00,
      stock: 10,
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name } as any, // Cast to any to bypass potential TS sync issues during seed
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
