const Modal = {
    toggle(){
        //Abrir e fechar o modal 
        // Adicionar e remover a Classe active no modal
        document.querySelector('.modal-overlay').classList.toggle('active');
    },
    outSideModal(event){
        const containerModal = document.querySelector('.modal-overlay');
        if(event.target == containerModal){
            document.querySelector('.modal-overlay').classList.remove('active');
        }
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        //pegar todas a variaves
        //para cada transacao,
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0){
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses(){
        //somar as saidas
        let expense = 0;
        //pegar todas a variaves
        //para cada transacao,
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total(){
        //entrada - saidas
        return Transaction.incomes() + Transaction.expenses()
    }

}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTrasaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTrasaction(transaction, index){
        const CSSClass = transaction.amount > 0 ? "positive" : "negative"
        const amount = Utils.formatCurrency(transaction.amount)

        const HTML = `
        <tr>
            <td class="descript">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="data">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="/img/remove.svg" alt="Remove Expenses or Amount" srcset=""></td>
        </tr>
        `    
        return HTML
    },

    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransaction(){
        DOM.transactionsContainer.innerHTML = ""
    },

    changeColor(){
        const cardTotal = document.querySelector('.total')  

        if(Transaction.total() < 0){
            cardTotal.classList.add('totalnegative')
        } else{
            cardTotal.classList.remove('totalnegative')
        }
    }
}

const Utils = {

    formatValue(value){
        value = Number(value) * 100
        return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? '-' : '+';

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value= value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })
        return signal + value;
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields(){ 
        //validar os campos dos formularios para que não estejam vazios
        const { description, amount, date} = Form.getValues()

        if( description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatValue(amount)
        date = Utils.formatDate(date)
        return { 
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault();

        try{
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.toggle()
        }
        catch (error){
            alert(error.message)
        }
    }
}

const App = {
    init(){
        Transaction.all.forEach(DOM.addTransaction)
   
        DOM.updateBalance()
        Storage.set(Transaction.all)
        DOM.changeColor()  

    },

    reload(){
        DOM.clearTransaction()
        App.init()
    }
}

App.init();
