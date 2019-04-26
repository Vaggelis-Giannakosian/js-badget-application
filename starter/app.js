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
     this.percentage = -1;
 };
 Expense.prototype.calculatePercentages = function(totalIncome){
     if(totalIncome>0) {
         this.percentage = Math.round((this.value / totalIncome) * 100);
     }else{
         this.percentage = -1;
     }
 };
 Expense.prototype.getPercentage = function(){
     return this.percentage;
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
     deleteItem: function(obj){
         var ids, index;
         ids = data.allItems[obj.type].map(function(current,index,array){
             return current.id;
         });

         index = ids.indexOf(obj.id);
         if(index !== -1){
             data.allItems[obj.type].splice(index,1);
         }

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
     calculatePercentages: function(){
        data.allItems.exp.forEach(function(cur){
            cur.calculatePercentages(data.totals.inc);
        });
     },
     getPercentages: function(){
        var allPerc = data.allItems.exp.map(function (cur) {
          return  cur.getPercentage();
        });
         return allPerc;
     },
     getBudget: function(){
         return {
             budget:data.budget,
             totalInc:data.totals.inc,
             totalExp:data.totals.exp,
             percentage:data.percentage,
         };
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
         expesesPercLabel: '.item__percentage',
         monthLabel: 'budget__title--month',
      };

      var formatNumber =  function(number,type){
        var numSplit,int, dec;
        number = Math.abs(number);
        number = number.toFixed(2);
        numSplit = number.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        if(int.length > 3 && int.length <= 6 ){
            int = int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
        }
        if(int.length >= 7 ){
              int = int.substr(0,int.length-6)+','+int.substr(int.length-6,int.length-4)+','+int.substr(int.length-3,int.length);
          }

        return (type === 'exp' ? "- " : "+ ")+int+'.'+dec;
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
    newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));

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

        document.querySelector(DOMstring.budget).textContent = formatNumber(obj.budget,(obj.budget>=0? 'inc':'exp'));
        document.querySelector(DOMstring.totalInc).textContent = formatNumber(obj.totalInc,'inc');
        document.querySelector(DOMstring.totalExp).textContent = formatNumber(obj.totalExp,'exp');
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
       },
      displayPercentages: function(percentages){

              var fields;
              fields = document.querySelectorAll(DOMstring.expesesPercLabel);
          var nodeListForEach = function (list, callback) {
              for (var i = 0; i < list.length; i++) {
                  callback(list[i], i);
              }
          };

              nodeListForEach(fields,function(current,index){
                  if(percentages[index] > 0){
                      current.textContent = percentages[index]+'%';
                  }else{
                      current.textContent = '---';
                  }

              });
       },
      displayMonth: function(){
          var now, year, month, months;
         now = new Date();
         year = now.getFullYear();
         month = now.getMonth();
         months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          document.getElementsByClassName(DOMstring.monthLabel)[0].textContent = months[month] + ' ' + year ;
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
    var updatePercentages = function(){

        //1. calculate the percentages
        budgetCtrl.calculatePercentages();

        //2. return them from the controller
        var percentages = budgetCtrl.getPercentages();

        //3. update the UI
        UICtrl.displayPercentages(percentages);

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

            //6. update all the percentages
            updatePercentages();
        }
    };
    var ctrlDeleteItem = function (evt){
       var itemId , splitId ,type , id;

       itemId = evt.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
           splitId = itemId.split('-');
           type = splitId[0];
           id = parseInt(splitId[1]);

            //1. delete the item from the data structure
            budgetCtrl.deleteItem({type:type,id:id});


            // 2. delete item from UI
            UICtrl.deleteItem(itemId);

            //3. update and show the new budget
            updateBudget();

            //6. update all the percentages
            updatePercentages();
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
           });
           UICtrl.displayMonth();
       }
    };

})(budgetController,UIController);

controller.init();