const soma = (num1: number, num2: number) => {
  console.log("dentro da função");
  return num1 + num2;
};

describe("Jest test", () => {
  test("Deve somar 5 + 5 e dar 10", () => {
    const resultado = soma(5, 5);
    console.log("teste");
    console.log("teste 1 ");
    console.log("teste 2 ");
    console.log("teste 3");
    expect(resultado).toEqual(10);
  });
});
