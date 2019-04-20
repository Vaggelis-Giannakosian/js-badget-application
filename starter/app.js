//Data Controller module
var budgetController = (function(){


    //some code



})();

//Ui Controller module
var UIController = (function(){
      var DOMstring = {
         inputType: '.add__type',
         inputDescription: '.add__description',
         inputValue: '.add__value',
         inputButton: '.add__btn',
      };


   return {
      getInput: function(){
         return{
            //will be either inc or exp
         type : document.querySelector(DOMstring.inputType).value,
         description : document.querySelector(DOMstring.inputDescription).value,
         value : document.querySelector(DOMstring.inputValue).value
         };
      },
      getDOMstrings: function(){
         return DOMstring;
      },



   };
})();



//Global App Controlller module
var controller = (function(budgetCtrl,UICtrl){
   var DOM = UICtrl.getDOMstrings();

   var ctrlAddItem = function(){
      //get the input data
      var input = UICtrl.getInput();
console.log(input);
      //TODO: add the item to the budget controller
      //TODO: add the new item to the user interface
      //TODO: calculate the budget
      //TODO: display the budget on the UI
   }


   document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);


   document.addEventListener('keypress',function(e){
      if(e.key === 'Enter'){
         ctrlAddItem();
      }
   });



})(budgetController,UIController);