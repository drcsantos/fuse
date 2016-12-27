(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('ChatTabController', ChatTabController);

    /** @ngInject */
    function ChatTabController(socket, $timeout, authentication, Utils)
    {
        var vm = this;

        // Data
        vm.chat = {};
        vm.chatActive = false;
        vm.replyMessage = '';

        vm.timeDiff = Utils.timeDiff;

        vm.chat.community = {
          messages : []
        };

        // Methods
        vm.toggleChat = toggleChat;
        vm.reply = reply;

        //////////

        socket.on("connect", function() {

          socket.emit("get-community-msgs", authentication.currentUser().community._id);

          socket.on("community-msg", function(msg) {
            console.log("Community msg received");
          });

          socket.on("chat-newmsg", function(msg) {
            vm.chat.community.messages.push(msg);
          });

          socket.on("community-msgs", function(msgs) {
            console.log("In loading messages");
            vm.chat.community = msgs;
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
                userSend: authentication.currentUser().id,
                message: vm.replyMessage,
                community: authentication.currentUser().community._id,
                timeSent: new Date()
            };

            socket.emit('chat-msg', newMsg);

            //populate infor about the user so the name and the image is shown
            newMsg.userSend = {
              _id: authentication.currentUser().id,
              name: authentication.currentUser().name,
              userImage: authentication.getUserImage()
            }

            vm.chat.community.messages.push(newMsg);

            vm.replyMessage = '';

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
