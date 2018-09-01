package com.owary.websocketdemo.controller;

import com.owary.websocketdemo.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Message sendMessage(Message message) {
        Message newMessage = new Message();
        newMessage.setName(HtmlUtils.htmlEscape(message.getName()));
        newMessage.setMessage(HtmlUtils.htmlEscape(message.getMessage()));
        newMessage.setAction(message.getAction());
        System.out.println(newMessage);
        return newMessage;
    }


}
