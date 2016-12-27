(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('ChatTabController', ChatTabController);

    /** @ngInject */
    function ChatTabController(socket, $timeout, authentication)
    {
        var vm = this;

        // Data
        vm.chat = {};
        vm.chatActive = false;
        vm.replyMessage = '';

        vm.communityid = authentication.currentUser().community._id;

        vm.chat.community = {
          messages : []
        };

        // Methods
        vm.toggleChat = toggleChat;
        vm.reply = reply;

        //////////

        socket.on("connect", function() {

          socket.on("community-msg", function(msg) {
            console.log("Community msg received");
          });

          socket.on("chat-newmsg", function(msg) {
            vm.chat.community.messages.push(msg);
          });

        });

        function toggleChat(contact)
        {
            vm.chatActive = !vm.chatActive;

            if ( vm.chatActive )
            {
                vm.replyMessage = '';
                vm.chat.contact = contact;
                scrollToBottomOfChat(0);
            }
        }

        function reply()
        {
            if ( vm.replyMessage === '' )
            {
                return;
            }

            var newMsg = {
                who    : 'user',
                message: vm.replyMessage,
                community: vm.communityid,
                time   : 'Just now'
            };

            vm.chat.community.messages.push(newMsg);

            vm.replyMessage = '';

            socket.emit('chat-msg', newMsg);

            scrollToBottomOfChat(400);
        }

        function scrollToBottomOfChat(speed)
        {
            var chatDialog = angular.element('#chat-dialog');

            $timeout(function ()
            {
                chatDialog.animate({
                    scrollTop: chatDialog[0].scrollHeight
                }, speed);
            }, 0);

        }
    }

})();
