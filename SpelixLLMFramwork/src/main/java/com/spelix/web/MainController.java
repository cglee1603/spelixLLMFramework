package com.spelix.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.spelix.service.PromptTestDataService;

@Controller
public class MainController {

    @Autowired
    public PromptTestDataService promptTestDataService;

    @RequestMapping("/home")
    public String home(){
        return "home";
    }
}
