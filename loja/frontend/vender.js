async function montarSelect(){
    const produtos = await fetch ('http://localhost:3333/products')
        .then(resposta => {
            return resposta.json()
            })
            .catch(error =>{
                alert('Não carregou os produtos')
            })
        //alimenta o select
            let conteudoSelect = ''
            produtos.forEach( prod =>{
                conteudoSelect += `<option value= '${prod.id}'> ${prod.name} </option>`
            })
            document.getElementById("produto").innerHTML = conteudoSelect
}

async function vender(){
    //recuperar dados do formulario
    const id = document.getElementById("produto").value //recupera id
    const x = Number(document.getElementById("quantity").value)
    //cria obj para enviar
    const objeto = {id, x}
    //consumir api
    const resultado = await fetch('http://localhost:3333/product/venda', {
        method: 'PATCH',
        body: JSON.stringify(objeto),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    })
    .then(resposta =>{
        return resposta.json()
    })
    .catch(error =>{
        alert('Problema com a venda')
    })
    alert(resultado.status)

    document.getElementById("produto").value = " " 
    document.getElementById("quantity").value = " "
    document.getElementById("disponivel").value = " "
}
async function consultaQtde(){
    //recupera produto selecionado
    const idProduto = document.getElementById('produto').value
    const produto = await fetch(`http://localhost:3333/productById/${idProduto}`)
        .then((resposta) => {
            return resposta.json()
        })
        //jogou conteudo no HTML
        document.getElementById("disponivel").innerHTML = produto.quantity
}