/**
 * @author Ninox
 */

(function(){
    var app = angular.module("invoice", ['ngRoute','flow']);
    app.config(['$routeProvider',function($routeProvider, $locationProvider){
           $routeProvider
           .when("/invoice",{
                controller:"invoiceCtrl",
                templateUrl:"invoice.html"
           })
           .when("/email",{
                controller:"itemList",
                templateUrl:"email.html"
           })
               .otherwise({
                controller:"invoiceCtrl",
                templateUrl:"invoice.html"
           })
    }
    ]);
    
    app.controller("invoiceCtrl", function($scope, $location, emailService){
        $scope.header= {to_add:"",to:"",number:"", date:"", pdate:"",total:0,paid:0,balance:0,freight:0};
        $scope.items = [{code:"", desc:"", qty:0,price:0,amount:0}];
        this.delItem = function(item){
                        $scope.header.total -= $scope.items[item].amount;
                        $scope.items.splice(item,1);
        };
        this.addItem = function(){
                        $scope.items.push({code:"", desc:"", qty:0,price:0,amount:0});
                        for (var i=0; i < $scope.items.length; i++) {
                             $scope.header.total += $scope.items[i].amount;
                             console.log($scope.header.total);
                        };
        };
        this.getTotal = function(){
            $scope.header.total = 0;
            for (var i=0; i < $scope.items.length; i++) {
                $scope.header.total += $scope.items[i].amount;
            };
            return $scope.header.total;
        };

        this.emailInvoice = function(){
             emailService.set($scope);
        //$location.path('/email');
            var printContents = document.getElementById("invoice").innerHTML;
            var popupWin = window.open('', '_blank', 'width=500mm, height=600mm');
            popupWin.var = 'khara'
            popupWin.document.open();
            popupWin.document.write('<html id="a4">' +
                                    '<head><link rel="stylesheet" href="css/bootstrap.min.css">' +
                                    '<link rel="stylesheet" type="text/css" media="print" href="styles.css"></head>' +
                                    '<body id="a4" onload="window.print()">' +
                                     printContents + popupWin.var + '<iframe src="test.html"></iframe>' +
                                    '</body></html>');
            popupWin.document.close();
        };
    });

    app.controller("itemList", function($scope, $document, emailService){
        var invoice   =  emailService.get();
        $scope.header =  invoice.header;
        $scope.items  =  invoice.items;
    });

    app.factory('emailService', function(){
        var invoice = {};
        var get = function(){
            return invoice;
        };
        var set = function( $scope ){
            invoice.header = $scope.header;
            invoice.items  = $scope.items;
        };
        return {get:get, set:set};
    });
    
})();
