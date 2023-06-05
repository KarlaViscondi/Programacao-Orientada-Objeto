async function entrar(){
    //recupera os dados do form
    const username = document.getElementById("username").value 
    const password = document.getElementById("password").value 
    const corpo = {username, password}
    let resposta = await fetch('http://localhost:3333/user/verifica',{
        method: 'POST',
        body: JSON.stringify(corpo),
        headers: {
            'Content-Type': "application/json;charset=UTF-8"
        }
    })
    .then(resp => {
        return resp.json()
    })
    .catch(error => {
        alert(`Erro na execução ${error}`)
    })
    if (resposta == null){
        alert('Usuário ou senha não existe')
    }else{
        //guarda no cookie uma variavel chamada id contendo o id do usuario
        document.cookie = `id=${resposta.id}`
        //vai direcionar o usuario para a tela principal do sistema
        //vamos usar live server
        window.open(`http://127.0.0.1:5500/loja/frontend/index.html`);
    }
    
}