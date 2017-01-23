(function() {
  'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective)
    .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");



  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var list = this;
    list.isEmpty = false;
    list.narrowItDown = function(searchTerm){
      MenuSearchService.getMatchedMenuItems(searchTerm).then(function (responseData) {
        if (!list.searchTerm) {
          list.isEmpty = true;
          list.searchTerm = '';
        }
           list.found = responseData;
           list.isEmpty = list.found.length == 0?true:false;
        });
    };

    list.onRemove = function (idx) {
      MenuSearchService.onRemove(list.found,idx);
    }
  }

  function FoundItemsDirective(){
    var ddo = {
    templateUrl: 'foundItemsList.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller:foundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function foundItemsDirectiveController(){
  var list = this;
  list.isEmpty = function () {
      return list.found.length == 0;

  }
}

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath){
    var service = this;
    service.getMatchedMenuItems = function(searchTerm) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });

      return response.then(function (responseData){
        service.items = responseData.data.menu_items.filter (function (item) {
                return (searchTerm != undefined && item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > 0);
            })  //end filter
          //  console.log(service.items);
            return service.items;
          }); //end then

      } //end getMatchedMenuItems

      service.onRemove = function (arr, idx) {
       arr.splice(idx,1);
     } //end remove method

   } //end MenuSearchService


})();
