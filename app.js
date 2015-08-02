/**
 * @author Ninox
 */

(function(){
    var app = angular.module("invoice", ['ngRoute']);
    
    app.config(['$routeProvider',function ($routeProvider, $locationProvider){
           $routeProvider
           .when("/invoice",{
                controller:"itemCtrl",
                templateUrl:"/invoice/invoice.html"
           })
           .when("/email",{
                controller:"itemList",
                templateUrl:"/invoice/email.html"
           })
               .otherwise({
                controller:"itemCtrl",
                templateUrl:"/invoice/invoice.html"

           })
    }
    ]);
    
    app.controller("itemCtrl", function($scope, $location, emailService){
        $scope.header= {to_add:"",to:"",number:"", date:"", pdate:""};
        $scope.items = [{code:"", desc:"", qty:0,price:0,amount:0}];
        $scope.total = 0;
        this.delItem = function(item){
                        $scope.total -= $scope.items[item].amount;
                        $scope.items.splice(item,1);
    };
    this.addItem = function(){
                        $scope.items.push({code:"", desc:"", qty:0,price:0,amount:0});
                        for (var i=0; i < $scope.items.length; i++) {
                             $scope.total += $scope.items[i].amount;
                        };
    };
    this.emailInvoice = function(){
        emailService.set($scope);
        $location.path('/email');       
    };
    
    });

    app.controller("itemList", function($scope, $document, emailService){
        invoice       =  emailService.get();
        $scope.header =  invoice.header;
        $scope.items  =  invoice.items;

        this.printDiv = function() {
            var printContents = document.getElementById("invoice").innerHTML;
            var popupWin = window.open('', '_blank', 'width=300mm,height=300');
            popupWin.document.open();
            popupWin.document.write('<html id="a4"><head><link rel="stylesheet" href="css/bootstrap.min.css">' +
                '<link rel="stylesheet" type="text/css" media="print" href="styles.css"></head>' +
                '<body id="a4" onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        };
    });
    
    app.factory('emailService', function(){
        var invoice = {};
        var get = function(){
            return invoice;
        };
        var set = function( $scope ){
            invoice.header = $scope.header
            invoice.items  = $scope.items;
        };
        return {get:get, set:set};
    });
    
})();
