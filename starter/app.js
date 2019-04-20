//Data Controller module
var budgetController = (function(){
    var x = 23;

    var add = function(a){
        return x+a;
    }


    return {
        publicTest: function(b){
            return add(b);
        }
    }
})();

//Ui Controller module
var UIController = (function(){

    //some code

})();



//Controlller module
var controller = (function(budgetCtrl,UICtrl){

    var z = budgetCtrl.publicTest(15);
    //some code
    return {
        anotherPublic: function () {
            console.log(z);
        }
    }

})(budgetController,UIController);