async function remover(id){
    const confirma = confirm('Deseja realmente remover o produto?')
    if(confirma){
        await fetch(`http://localhost:3333/product/${id}`, {
            method: 'DELETE'
        })
        .then(resposta => {
            alert('Produto foi removido com sucesso')
            consulta()
        })
        .catch(erro => {
            alert('Problema ao remover')
        })
    }
}
function editar(id, name, description, quantity){
    document.getElementById("id").value = id
    document.getElementById("name").value = name
    document.getElementById("description").value = description
    document.getElementById("quantity").value = quantity
}

async function consulta(){
    //precisamos recuparar o valor do cookie, o valor recuperado  será, id=alguma coisa
    //o split vai dividir o conteudo em um vetor
    // aux[0] = id e aux[1] = alguma coisa
    let aux = document.cookie.split('=')
    let produtos = await fetch(`http://localhost:3333/products/${aux[1]}`)
        .then(resposta => {
            return resposta.json()
        })
    let conteudo = ""
    produtos.forEach(produto => {
        conteudo += `<tr> <td> ${produto.name} </td> <td> ${produto.description} </td> <td> ${produto.quantity} </td> <td> ${produto.created_at} </td> <td> <i onClick="remover('${produto.id}')" class="bi bi-trash" /> </td> <td> <i onClick="editar('${produto.id}','${produto.name}','${produto.description}','${produto.quantity}')" class="bi bi-pencil"/> </td> </tr>`
    })
    //envia os dados para HTML
    document.getElementById("tabela").innerHTML = conteudo
}

async function confirmar(){
    let id = document.getElementById("id").value
    let name = document.getElementById("name").value
    let description = document.getElementById("description").value
    let quantity = Number(document.getElementById("quantity").value)
    
    if((!name) || (!quantity) || (!description)){
        alert('Informe todos os campos')
        return
    }
    let method
    let produto
    if(!id){
        method= 'POST'
        let aux = document.cookie.split('=')
        let userid = aux[1]
        produto = {name, description, quantity, userid}
    }
    else{
        method= 'PUT'
        produto = {id, name, description, quantity}
    }

    await fetch("http://localhost:3333/product",{
        method: method,
        body: JSON.stringify(produto), //converte objeto JSON em string
        headers: {
            "Content-Type": "application/json; charseset=UTF-8"
        }
    })
    .then(resposta => alert('Operação realizada com sucesso'))
    .catch(erro => alert("Problema na operação"))
    consulta()
    //limpar os campos
    name = document.getElementById("name").value = ""
    description = document.getElementById("description").value = ""
    quantity = document.getElementById("quantity").value = ""
}