// Função principal de busca
async function buscarProduto() {
  const termo = document.getElementById("searchInput").value;
  const resultsDiv = document.getElementById("results");

  // Limpa resultados anteriores
  resultsDiv.innerHTML = "";

  if (!termo) {
    alert("Digite um produto!");
    return;
  }

  // Chamada da API do Mercado Livre
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Agrupa produtos pelo nome base
    const produtos = data.results.slice(0, 12);

    produtos.forEach(produto => {
      criarCard(produto);
    });

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "<p>Erro ao buscar produtos.</p>";
  }
}

// Cria o card do produto
function criarCard(produto) {
  const resultsDiv = document.getElementById("results");

  const card = document.createElement("div");
  card.className = "card";

  // Preço médio (simples, pois ML já retorna preço)
  const precoMedio = produto.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  // Variações (quando disponíveis)
  let variacoes = "Não informado";
  if (produto.attributes) {
    const attrs = produto.attributes
      .filter(a => a.id === "COLOR" || a.id === "SIZE" || a.id === "MODEL")
      .map(a => `${a.name}: ${a.value_name}`);
    if (attrs.length > 0) variacoes = attrs.join(", ");
  }

  card.innerHTML = `
    <img src="${produto.thumbnail}" alt="${produto.title}">
    <h3>${produto.title}</h3>
    <div class="price">Preço médio: ${precoMedio}</div>
    <div class="variations"><strong>Variações:</strong> ${variacoes}</div>
  `;

  resultsDiv.appendChild(card);
}