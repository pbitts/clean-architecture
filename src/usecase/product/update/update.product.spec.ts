import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();

    const createUseCase = new CreateProductUseCase(productRepository);
    const created = await createUseCase.execute({
      type: "a",
      name: "P1",
      price: 10
    });

    const updateUseCase = new UpdateProductUseCase(productRepository);
    const updateInput = {
      id: created.id,
      name: "New P1",
      price: 100,
    };

    const updated = await updateUseCase.execute(updateInput);

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe("New P1");
    expect(updated.price).toBe(100);
  });
});
