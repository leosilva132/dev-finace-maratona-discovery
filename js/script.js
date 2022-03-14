const Modal = {
    open(){
        //Abrir o modal 
        // Adicionar a Classe active no modal
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close(){
        //Fechar  o modal 
        // Remover a Classe active no modal
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}