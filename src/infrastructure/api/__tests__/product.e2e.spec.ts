import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "P1",
        price: 10
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("P1");
    expect(response.body.price).toBe(10);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Invalid Product",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "P1",
        price: 10
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/customer")
      .send({
        type: "a",
        name: "P2",
        price: 20
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/customer").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const customer = listResponse.body.products[0];
    expect(customer.name).toBe("P1");
    expect(customer.price).toBe(10);
    const customer2 = listResponse.body.products[1];
    expect(customer2.name).toBe("P2");
    expect(customer2.price).toBe(20);
    
  });
});
