//Data Controller module
var budgetController = (function(){


    //some code



})();

//Ui Controller module
var UIController = (function(){

    //some code

})();



//Global App Controlller module
var controller = (function(budgetCtrl,UICtrl){


   var ctrlAddItem = function(){
      //TODO: get the input data
      //TODO: add the item to the budget controller
      //TODO: add the new item to the user interface
      //TODO: calculate the budget
      //TODO: display the budget on the UI
   }


   document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);


   document.addEventListener('keypress',function(e){
      if(e.key === 'Enter'){
         ctrlAddItem();
      }
   });



})(budgetController,UIController);