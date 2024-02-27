package com.spelix.web;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class PromptManagerController {
	
	private static final Logger log = LoggerFactory.getLogger(PlaygroundController.class);

	
	@RequestMapping(value = "/promptmanager", method = RequestMethod.GET)
	public String promptmanager(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "promptmanager";
	}
}
