const soma = (num1: number, num2: number) => num1 + num2;

describe("Jest test", () => {
  test("Deve somar 5 + 5 e dar 10", () => {
    const resultado = soma(5, 5);
    expect(resultado).toEqual(15);
  });
});
