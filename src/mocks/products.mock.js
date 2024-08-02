import { fakerES_MX as faker } from "@faker-js/faker";

export const generate100FakerProducts = () => {
  const fakerProducts = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.number.hex({ min: 0, max: 75000 }),
    price: faker.commerce.price(),
    stock: faker.number.int({ min: 0, max: 200 }),
  };
  return fakerProducts;
};
