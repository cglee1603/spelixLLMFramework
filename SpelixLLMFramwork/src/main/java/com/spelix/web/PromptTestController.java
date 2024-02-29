package com.spelix.web;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.spelix.service.PromptManagerService;

@Controller
public class PromptTestController {
	
	private static final Logger log = LoggerFactory.getLogger(PlaygroundController.class);


	
	@GetMapping("/prompttest")
	public String prompttest(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "prompttest";
	}

}
