(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('BoardViewController', BoardViewController);

    /** @ngInject */
    function BoardViewController($document, $window, $log, $timeout, $mdDialog, msUtils, $stateParams, SearchService,
       BoardService, CardFilters, DialogService, authentication, apilaData, msNavigationService, $scope)
    {
        var vm = this;

        // Data
        vm.currentView = 'board';
        vm.board = BoardService.data.data;
        vm.board.lists = [];
        vm.board.cards = [];

        var username = authentication.currentUser().name;
        var userid = authentication.currentUser().id;

        var listCopy = null;

        // Functions
        vm.openCardDialog = DialogService.openCardDialog;
        vm.cardFilter = cardFilter;
        vm.isOverdue = isOverdue;

        vm.getChecklistData = getChecklistData;

        function checkDateOffset(issue, lastDate, timeUnit) {
          var offsetDate = moment(lastDate).add(1, timeUnit);

          if(moment().isAfter(offsetDate)) {
            issue.flag = true;
          }
        }

        vm.getImageUrl = function(cardId) {
          var card = vm.board.cards.getById(cardId); 
          
          var lastAttachment = card.attachments[card.attachments.length - 1];

          if(lastAttachment) {
            return lastAttachment.url;
          } else {
            return " ";
          }
        }

        vm.flagIssue = function(issue) {
          if(issue.updateInfo.length > 0) {
            var lastDate = issue.updateInfo[issue.updateInfo.length - 1].updateDate;


            switch(issue.resolutionTimeframe) {
              case "Hours":
                checkDateOffset(issue, lastDate, 'hours');
              break;

              case "Days":
                checkDateOffset(issue, lastDate, 'days');
              break;

              case "Weeks":
                checkDateOffset(issue, lastDate, 'weeks');
              break;

              case "Months":
                checkDateOffset(issue, lastDate, 'months');
              break;

            }

          }
          
        };

        ////////////////////// PRELOAD DATA //////////////////////

        //push the first list for cuurent User, so it's always the first one
        vm.board.lists.push(  {
              "id": msUtils.guidGenerator(),
              "name": username,
              "idCards": []
          });

          //get the current board we are on to load proper data
          var status = "";

          if($stateParams.uri === "open-issues" || $stateParams.uri === ""){
            status="Open";
          } else if($stateParams.uri === "shelved-issues") {
            status = "Shelved";
          } else if($stateParams.uri === "closed-issues") {
            status = "Closed";
          }

        apilaData.userCommunity(userid)
        .success(function(d) {
          vm.myCommunity = d;

          populateCurrentUserList(vm.myCommunity._id);
          populateLists(vm.myCommunity._id);
          issuesCount(vm.myCommunity._id);

          vm.board.labels = vm.myCommunity.labels;
          console.log(vm.myCommunity.labels);

          setUserRole();

          listCopy = angular.copy(vm.board.lists);

          var searchParams = ["title", "responsibleParty", "resolutionTimeframe", "submitBy", "description",
                              "status"];

          SearchService.setData(vm.board.cards, searchParams);

          SearchService.subscribe($scope, function() {
            vm.board.cards = SearchService.getResult();
          });

        });

    //add our first list of issues for our current user
    function populateCurrentUserList(id)
    {

      apilaData.listIssueByUsername(username, status, id)
          .success(function(issues) {

            //add card to first list
            var currUserIssues = _.filter(issues, function(user) {
              if(user.responsibleParty._id === userid) {
                return true;
              }
            });

            addCardsForCurrUser(currUserIssues, vm.board.lists[0]);
          })
          .error(function(issues) {
              $log.debug("Error while loading list of issues for: " + username);
          });
    }


    function createEmptyLists() {

      apilaData.usersList()
        .success(function(users) {
          //foreach user make them a list
          angular.forEach(users, function(list, k) {
            addList(list);
          });
        })
        .error(function(response) {
          $log.debug(response);
        });
    }

      //add all the other issues assigned to users
      function populateLists(id) {
          apilaData.issuesList(status, id)
                .success(function(issues) {

                angular.forEach(issues, function(v, k) {

                  var currList = createList(v._id.name);

                  //we don't want to add ourself to the list, we are already added
                  if(currList.name !== username) {

                     //add all the cards
                      angular.forEach(v.issues, function(card, key) {
                        var myCard = addCard(card);

                        if(myCard) {
                          currList.idCards.push(myCard.id);
                        }

                      });

                      vm.board.lists.push(currList);
                    }
                    });

                    //add empty lists with users with no issues
                    createEmptyLists();

              })
              .error(function(issues) {
                  $log.debug("Error while loading list of issues for: " + username);
              });

        }


        function addCard(card) {
          card.id = msUtils.guidGenerator();
          card.name = card.title;

          var currUserIsMember = false;

          if(card.idMembers) {
            if(_.find(card.idMembers, {_id: userid})) {
              currUserIsMember = true;
            }
          }

          //if the card is confidential and we are not member of the card don't show it
          if(card.confidential && !currUserIsMember) {
            return null;
          }

          vm.flagIssue(card);

          vm.board.cards.push(card);

          return card;
        }

        // Adds an empty list of cards for each resident (except current)
        function addList(list) {

          if (inCommunity(list.name) !== undefined) {

            //checks if the list with that name is already added
            var isInList = (_.find(vm.board.lists, {"name" : list.name}) !== undefined);

            if (isInList === false) {
              var currList = createList(list.name);

              // we already created our card list so dont add it
              if (currList.name !== username) {
                vm.board.lists.push(currList);
              }
            }

          }
        }

        //adds a list of cards to a selected list (FOR THE CURRENT USER)
        function addCardsForCurrUser(cards, list) {

          angular.forEach(cards, function(card, key) {
            card.id = card._id;
            card.name = card.title;

            vm.flagIssue(card);
            vm.board.cards.push(card);
            list.idCards.push(card.id);

          });

        }

        function getChecklistData(cardId) {
          var checkedItems = 0;
          var checkItemsLength = 0;

          vm.board.cards.getById(cardId).checklists.forEach(function(d) {
            checkedItems += d.checkItemsChecked;
            checkItemsLength += d.checkItems.length;
          });

          return {
            checkedItems: checkedItems,
            checkItemsLength: checkItemsLength
          };
        }

        ////////////////////////// HELPER FUNCTIONS //////////////////////////

        function issuesCount(id) {
          apilaData.openIssuesCount(userid, id)
            .success(function(count) {
              msNavigationService.saveItem('fuse.issues', {
                badge: {
                  content:  count,
                  color  : '#F44336'
                }
              });
            })
            .error(function(count) {
            });
        }

        function createList(name) {
          var currList = {
            id: msUtils.guidGenerator(),
            name: name,
            idCards: []
          };

          return currList;
        }

        function setUserRole() {
          if(vm.myCommunity.creator.name === vm.username) {
            vm.userRole = "creator";
          } else if(vm.myCommunity.boss.name === vm.username) {
            vm.userRole = "boss";
          } else if(vm.myCommunity.directors.indexOf(vm.username) !== -1) {
            vm.userRole = "directors";
          } else if(vm.myCommunity.minions.indexOf(vm.username) !== -1) {
            vm.userRole = "minions";
          }
        }

        function inCommunity(name){
          var result = _.find(vm.myCommunity.communityMembers, function(v){
            return v.name === name;
          });

          return result;
        }


        ////////////////////////// THEME CODE ///////////////////////////////

        vm.boardList = BoardService.list.data;
        vm.cardFilters = CardFilters;
        vm.card = {};
        vm.cardOptions = {};
        vm.sortableListOptions = {
            axis       : 'x',
            delay      : 75,
            distance   : 7,
            items      : '> .list-wrapper',
            handle     : '.list-header',
            placeholder: 'list-wrapper list-sortable-placeholder',
            tolerance  : 'pointer',
            start      : function (event, ui)
            {
                var width = ui.item[0].children[0].clientWidth;
                var height = ui.item[0].children[0].clientHeight;
                ui.placeholder.css({
                    'min-width': width + 'px',
                    'width'    : width + 'px',
                    'height'   : height + 'px'
                });
            }
        };
        vm.sortableCardOptions = {
            appendTo            : 'body',
            connectWith         : '.list-cards',
            delay               : 75,
            distance            : 7,
            forceHelperSize     : true,
            forcePlaceholderSize: true,
            handle              : msUtils.isMobile() ? '.list-card-sort-handle' : false,
            helper              : function (event, el)
            {
                return el.clone().addClass('list-card-sort-helper');
            },
            placeholder         : 'list-card card-sortable-placeholder',
            tolerance           : 'pointer',
            scroll              : true,
            sort                : function (event, ui)
            {
                var listContentEl = ui.placeholder.closest('.list-content');
                var boardContentEl = ui.placeholder.closest('#board');

                if ( listContentEl )
                {
                    var listContentElHeight = listContentEl[0].clientHeight,
                        listContentElScrollHeight = listContentEl[0].scrollHeight;

                    if ( listContentElHeight !== listContentElScrollHeight )
                    {
                        var itemTop = ui.position.top,
                            itemBottom = itemTop + ui.item.height(),
                            listTop = listContentEl.offset().top,
                            listBottom = listTop + listContentElHeight;

                        if ( itemTop < listTop + 25 )
                        {
                            listContentEl.scrollTop(listContentEl.scrollTop() - 25);
                        }

                        if ( itemBottom > listBottom - 25 )
                        {
                            listContentEl.scrollTop(listContentEl.scrollTop() + 25);
                        }
                    }
                }

                if ( boardContentEl )
                {
                    var boardContentElWidth = boardContentEl[0].clientWidth;
                    var boardContentElScrollWidth = boardContentEl[0].scrollWidth;

                    if ( boardContentElWidth !== boardContentElScrollWidth )
                    {
                        var itemLeft = ui.position.left,
                            itemRight = itemLeft + ui.item.width(),
                            boardLeft = boardContentEl.offset().left,
                            boardRight = boardLeft + boardContentElWidth;

                        if ( itemLeft < boardLeft + 25 )
                        {
                            boardContentEl.scrollLeft(boardContentEl.scrollLeft() - 25);
                        }

                        if ( itemRight > boardRight )
                        {
                            boardContentEl.scrollLeft(boardContentEl.scrollLeft() + 25);
                        }
                    }
                }
            }
        };

        (function init()
        {
            $timeout(function ()
            {
                // IE list-content max-height hack
                if ( angular.element('html').hasClass('explorer') )
                {
                    // Calculate the height for the first time
                    calculateListContentHeight();

                    // Attach calculateListContentHeight function to window resize
                    $window.onresize = function ()
                    {
                        calculateListContentHeight();
                    };
                }
            }, 0);

        })();

        /**
         * IE ONLY
         */
        function calculateListContentHeight()
        {
            var boardEl = angular.element('#board');
            var boardElHeight = boardEl.height();

            boardEl.find('.list-wrapper').each(function (index, el)
            {
                // Get the required heights for calculations
                var listWrapperEl = angular.element(el),
                    listHeaderElHeight = listWrapperEl.find('.list-header').height(),
                    listFooterElHeight = listWrapperEl.find('.list-footer').height();

                // Calculate the max height
                var maxHeight = boardElHeight - listHeaderElHeight - listFooterElHeight;

                // Add the max height
                listWrapperEl.find('.list-content').css({'max-height': maxHeight});
            });
        }

        function cardFilter(cardId)
        {
            var card = vm.board.cards.getById(cardId);

            try
            {
                if ( angular.lowercase(card.name).indexOf(angular.lowercase(vm.cardFilters.name)) < 0 )
                {
                    throw false;
                }

                angular.forEach(vm.cardFilters.labels, function (label)
                {
                    if ( !msUtils.exists(label, card.idLabels) )
                    {
                        throw false;
                    }
                });

                angular.forEach(vm.cardFilters.members, function (member)
                {
                    if ( !msUtils.exists(member, card.idMembers) )
                    {
                        throw false;
                    }
                });


            } catch ( err )
            {
                return err;
            }

            return true;
        }

        function isOverdue(cardDate)
        {
            return moment() > moment(cardDate, 'x');
        }
    }
})();
