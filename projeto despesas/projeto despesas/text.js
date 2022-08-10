/*  a classe despesas possui um constructor que recebe dez parâmetros e valida os dados passados retornando true ou false */
class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano       
        this.mes = mes 
        this.dia = dia 
        this.tipo = tipo 
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for (let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

//  A classe ArmazenarDados possui cinco métodos cujo os objetivos são respectivamente :
//  recolher o id null e coloca-lo como zero; 
//  Gravar as informações em tipo Json, atraves do id; 
//  Colocar os dados gravados no formato Json em array, convertendo-o.
//  O quarto método será usado para filtrar as despesas na página consulta.
//  Por fim, temos o método remover item que será usado no botão de exclusão da página consulta.
class ArmazenarDados{
    constructor(){
        let id = localStorage.getItem('id')

        if (id === null){
            localStorage.setItem('id', 0)
        }
    }

    getproximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getproximoId()

        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    
    recuperarTodosRegistros(){
        let despesas = Array()
        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++ ){
            let despesa = JSON.parse(localStorage.getItem(i))
        

            if (despesa === null){
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa){
        let despesas = Array()
		despesas = this.recuperarTodosRegistros()

        if(despesa.ano != ''){
            despesas = despesas.filter(d => d.ano == despesa.ano)
        }

        if(despesa.mes != ''){
            despesas = despesas.filter(d => d.mes == despesa.mes)
        }

        if(despesa.dia != ''){
            despesas = despesas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo != ''){
            despesas = despesas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != ''){
            despesas = despesas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor != ''){
            
            despesas = despesas.filter(d => d.valor == despesa.valor)
        }

        return despesas
            
    }
    remover(id){
		localStorage.removeItem(id)
	}
}

//  cria um objeto do tipo AmazenarDados que herdará todos os seus métodos
let armazenar = new ArmazenarDados()

//  A função cadastrar despesas serve para ler e armazenar em variáveis, o valor digitado em cada caixa de texto da página cadastro em um objeto do tipo Despesa.
//  e valida a despesa usando o método criado na classe despesa, utilizando como recurso, o modal criado na página html.
//  Por fim, a função também limpa os input após recolher os dados.
function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if(despesa.validarDados()){
        armazenar.gravar(despesa)
        $('#gravado').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else{
        $('#erroGravacao').modal('show')
    }

}



/* essa função serve para receber e implementar o array com todas as despesas armezanadas na função recuperaDados 
e também para preencher a tabela da página de consulta com todas as despesas cadastradas */
function carregaListaDespesas(despesas = Array(), filtro = false){

    // se a lista tiver vazia ela recebe o array retornado pela função recuperarTodosRegistros da classe ArmazenarDados
    if(despesas.length == 0 && filtro == false){
		despesas = armazenar.recuperarTodosRegistros() 
	}
	
    
	let listaDespesas = document.getElementById("lista_consulta") // id contido no final da página html de consulta
    listaDespesas.innerHTML = '' // limpa os registros antes de preenche-lo(fundamental na hora de filtar os registros)

    // percorrer o array e preenche a tabela.
    despesas.forEach(function(d){
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano
        switch (d.tipo){
            case '1':
                d.tipo = 'Alimentação'
            break
            case '2':
                d.tipo = 'Educação'
            break
            case '3':
                d.tipo = 'Lazer'
            break
            case '4':
                d.tipo = 'Saúde'
            break
            case '5':
                d.tipo = 'Transporte'
            break

            default: 
                d.tipo = 'Tipo indefinido'
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerText = d.descricao
        linha.insertCell(3).innerHTML = d.valor
    
    

        //Criar o botão de exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-times"></i>'
        btn.id = `id_despesa_${d.id}`

        //ao clicar no botão criado execute a função de remover criada na classe ArmazenarDados:
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_','')
            armazenar.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)

    })

}

/* a funçõ pesquisarDespesa é a mais importante na hora de filtrar as despesas, ela cria um objeto da classe despesa e o preenche, 
   depois, entrega para o método pesquisar de ArmazenarDados que irá recuperar 'TodosRegistros' e comparará as posições, 
   retornando um array que será escrito na tela através da função carregaListaDespesas */
function pesquisarDespesa(){	 
	let ano  = document.getElementById("ano")
	let mes = document.getElementById("mes")
	let dia = document.getElementById("dia")
	let tipo = document.getElementById("tipo")
	let descricao = document.getElementById("descricao")
	let valor = document.getElementById("valor")

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	let despesas = armazenar.pesquisar(despesa)
    console.log(despesas)
	console.log(despesa)
	
    // recebe o array retornado pela pesquisa através da variável despesas, em que filtro (o segundo parametro) recebe true
	this.carregaListaDespesas(despesas, true)
}


