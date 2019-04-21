/**
 * Data Controller module
 *
 *
 */

var budgetController = (function(){

 var Expense = function(id,description,value){
     this.id = id;
     this.description = description;
     this.value = value;
 };

 var Income = function(id,description,value){
     this.id = id;
     this.description = description;
     this.value = value;
 };

 var data = {
     allItems:{
         exp : [],
         inc : [],

     },
    totals:{
        exp : 0,
        inc: 0,
    }
 };

 return{
     addItem: function(type,des,val){
         var newItem, ID;
         //create new ID
         if(data.allItems[type].length > 0){
             ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
         }else{
             ID = 0;
         }

         //create new item based on type
         if(type==='exp'){
             newItem = new Expense(ID,des,val);
         }else if(type==='inc'){
             newItem = new Income(ID,des,val);
         }
         //push it into data structure
         data.allItems[type].push(newItem);
         //return new item
         return newItem;
     },
     testing: function(){
         console.log(data);
     }

 };

})();


/**
 * Ui Controller module
 *
 *
 */
var UIController = (function(){
      var DOMstring = {
         inputType: '.add__type',
         inputDescription: '.add__description',
         inputValue: '.add__value',
         inputButton: '.add__btn',
         incomeContainer: '.income__list',
         expensesContainer : '.expenses__list',
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

      addListItem: function(obj,type){
          var html , newHtml , element;

     //create html string with placeholder tags
          if(type === 'inc'){
              element = document.querySelector(DOMstring.incomeContainer);
              html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }else if(type==='exp'){
              element = document.querySelector(DOMstring.expensesContainer);
              html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }

    //replace the placeholder with actual data
    newHtml = html.replace('%id%',obj.id);
    newHtml = newHtml.replace('%description%',obj.description);
    newHtml = newHtml.replace('%value%',obj.value);

   //insert HTML to the DOM
    element.insertAdjacentHTML("beforeend", newHtml);

      },

      clearFields: function(){
          var fields,fieldsArr;
          fields = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue);
          fieldsArr = Array.prototype.slice.call(fields);
          fieldsArr.forEach(function(current, index, array){
              current.value='';
          });
    },


   };

})();



/**
 * Global App Controlller module
 *
 *
 */
var controller = (function(budgetCtrl,UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(e){
            if(e.key === 'Enter'){
                ctrlAddItem();
            }
        });


    };


   var ctrlAddItem = function(){
       var input, newItem;
      //1. get the input data
       input = UICtrl.getInput();

      //2. add the item to the budget controller
       newItem = budgetCtrl.addItem(input.type,input.description,input.value);

      //3.  add the new item to the user interface
       UICtrl.addListItem(newItem,input.type);
       UICtrl.clearFields();
      //4. calculate the budget



      //TODO: display the budget on the UI
   };

    return{
       init: function(){
           setupEventListeners();
       }


    };

})(budgetController,UIController);

controller.init();