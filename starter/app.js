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
    },
     budget:0,
     percentage: -1,
 };

 var calculateTotal = function(type){
     var sum = 0;
     data.allItems[type].forEach(function(current,index,array){
            sum += current.value;
     });
     data.totals[type] = sum;
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
     calculateBadget: function(){
         var  percentageOfExp;
         //calculate total income and expenses
         calculateTotal('inc');
         calculateTotal('exp');

         //calculate the badget: income-expenses
         data.budget = data.totals.inc - data.totals.exp;
         //calculate the percentage of expenses

         if(data.totals.inc>0) {
             data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
         }else{
             data.percentage = -1;
         }
     },
     getBudget: function(){
         return {
             budget:data.budget,
             totalInc:data.totals.inc,
             totalExp:data.totals.exp,
             percentage:data.percentage,
         };
     },
     deleteItem: function(obj){
         data.allItems[obj.type].forEach(function(current,index,array){
                if(current.id === parseInt(obj.id)){
                    array.splice(index, 1);
                }
         });
     },
     testing: function() {
         console.log(data);
    },


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
         budget: '.budget__value',
         totalInc: '.budget__income--value',
         totalExp: '.budget__expenses--value',
         percentage: '.budget__expenses--percentage',
         container : '.container',

      };

   return {
      getInput: function(){
         return{
            //will be either inc or exp
         type : document.querySelector(DOMstring.inputType).value,
         description : document.querySelector(DOMstring.inputDescription).value,
         value : parseFloat(document.querySelector(DOMstring.inputValue).value),
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
              html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }else if(type==='exp'){
              element = document.querySelector(DOMstring.expensesContainer);
              html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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
          fieldsArr[0].focus();
    },

      displayBudget: function(obj){
          var suffix = obj.budget>0 ? '+' : '';
        document.querySelector(DOMstring.budget).textContent = suffix + obj.budget;
        document.querySelector(DOMstring.totalInc).textContent = obj.totalInc;
        document.querySelector(DOMstring.totalExp).textContent = obj.totalExp;
        if(obj.percentage>0) {
            document.querySelector(DOMstring.percentage).textContent = obj.percentage + '%';
        }else{
            document.querySelector(DOMstring.percentage).textContent = '---';
        }
       },
       deleteItem: function (id){
          var target;
          target = document.getElementById(id);
          target.parentNode.removeChild(target);
       }
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
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        document.addEventListener('keypress',function(e){
            if(e.key === 'Enter'){
                ctrlAddItem();
            }
        });




    };
    var updateBudget = function(){
        //1. calculate the budget
    budgetCtrl.calculateBadget();

        //2. return the budget
    var budget = budgetCtrl.getBudget();

        //3. display the budget on the UI
        UICtrl.displayBudget(budget);

    };
    var ctrlAddItem = function () {
        var input, newItem;

        //1. get the input data
        input = UICtrl.getInput();
        if (input.description !== '' && !isNaN(input.value) && input.value >0 ) {

            //2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3.  add the new item to the user interface
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget();
        }
    };
    var ctrlDeleteItem = function (evt){
       var itemId , splitId ,type , id;

       itemId = evt.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
           splitId = itemId.split('-');
           type = splitId[0];
           id = splitId[1];

            //1. delete the item from the data structure
            budgetCtrl.deleteItem({type:type,id:id});


            // 2. delete item from UI
            UICtrl.deleteItem(itemId);

            //3. update and show the new budget
            updateBudget();
        }
    };

    return{
       init: function(){
           setupEventListeners();
           UICtrl.displayBudget({
               budget:0,
               totalInc: 0 ,
               totalExp: 0 ,
               percentage: -1,
           })
       }
    };

})(budgetController,UIController);

controller.init();