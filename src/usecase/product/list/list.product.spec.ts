import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test list product use case", () => {
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

  it("should list a product", async () => {
    const productRepository = new ProductRepository();
    

    const usecase = new CreateProductUseCase(productRepository);

    await usecase.execute({ type: "a", name: "P1", price: 10 });
    await usecase.execute({ type: "a", name: "P2", price: 20 });

    const listusecase = new ListProductUseCase(productRepository);

    const result = await listusecase.execute({});

    expect(result.products.length).toBe(2);
    expect(result.products[0].name).toBe("P1");
    expect(result.products[1].name).toBe("P2");
    expect(result.products[0].price).toBe(10);
    expect(result.products[1].price).toBe(20);

    
  });
});
