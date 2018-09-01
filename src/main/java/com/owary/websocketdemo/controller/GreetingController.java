package com.owary.websocketdemo.controller;

import com.owary.websocketdemo.model.Greeting;
import com.owary.websocketdemo.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting sendGreeting(Message message) throws InterruptedException {
        Thread.sleep(3000);
        return new Greeting("Hello, "+HtmlUtils.htmlEscape(message.getName())+"!");
    }

}
