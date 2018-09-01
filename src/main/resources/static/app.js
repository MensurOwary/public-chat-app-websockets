(function () {
    var stompClient = null;
    var Message, connect;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                if(arg.action==='join'){
                    $message.find('.avatar').remove();
                    $message.addClass('join').find('.text').html(_this.text);
                }else {
                    $message.addClass(_this.message_side).find('.text').html(_this.text);
                }
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };

    $(function () {
        var getMessageText, message_side, sendMessage, sendName;
        message_side = 'right';

        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text, action) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message = new Message({
                text: text,
                message_side: message_side,
                action: action
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };

        // sends the message by button
        $('.send_message').click(function (e) {
            return sendName($('#chat-box').data('username'), getMessageText());
            // return sendMessage(getMessageText());
        });
        // sends the message by enter
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendName($('#chat-box').data('username'), getMessageText());
                // return sendMessage(getMessageText());
            }
        });

        connect = function(){
            var socket = new SockJS('/gs-guide-websocket');
            stompClient = Stomp.over(socket);
            stompClient.debug = null;
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/greetings', function (greeting) {
                    var msg = JSON.parse(greeting.body);
                    var action = msg.action;
                    var usr = msg.name;
                    if(msg.name===$('#chat-box').data('username')){
                        message_side='right';
                    }else{
                        message_side='left';
                    }
                    if(action==='join'){
                        sendMessage(usr+" joined!", 'join');
                    }else{
                        sendMessage(JSON.parse(greeting.body).message, null);
                    }
                });
            });
        };

        sendName = function ($name, $message, $action) {
            stompClient.send("/app/hello", {}, JSON.stringify(
                {
                    'name': $name,
                    'message' : $message,
                    'action' : $action
                }));
        }
        // this is registering section
        $('#user-name-set').click(function () {
            setUsername();
        });

        $('#username').keypress(function (e) {
            if (e.which === 13) {
                console.log("here");
                setUsername();
                return false;
            }
        });

        function setUsername() {
            var usr = $('#username').val();
            $('#chat-box').data('username', usr);
            sendName(usr, "", 'join');
            $('#chat-login').fadeOut();
            $('#chat-box').fadeIn();
        }
        // register end

        connect(); // establish the connection
    });




}.call(this));

