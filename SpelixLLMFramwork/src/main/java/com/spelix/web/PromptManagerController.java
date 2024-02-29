package com.spelix.web;

import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.service.PromptManagerService;

@Controller
//@RequestMapping("/promptmanager")
public class PromptManagerController {

	private static final Logger log = LoggerFactory.getLogger(PlaygroundController.class);

	private final PromptManagerService promptManagerService;

	@Autowired
	public PromptManagerController(PromptManagerService promptManagerService) {
		this.promptManagerService = promptManagerService;
	}

	@GetMapping("/promptmanager")
	public String promptmanager(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "promptmanager";
	}

	@RequestMapping(value = "/promptmanager/getAllPromptMaster.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptMasterDTO> getAllPromptMaster() {
		List<PromptMasterDTO> allPromptMasterList = promptManagerService.getAllPromptMaster();

		log.debug("getAllPromptMaster allPromptMasterList: " + allPromptMasterList);

		return allPromptMasterList;
	}

	@RequestMapping(value = "/promptmanager/deletePromptMasterById.do", method = RequestMethod.POST)
	@ResponseBody
	public int deletePromptMasterById(@RequestParam("promptId") String promptId) {
		log.debug("deletePromptMasterById promptId: " + promptId);
		return promptManagerService.deletePromptMasterById(promptId);
	}

	@RequestMapping(value = "/promptmanager/getAllPromptModelList.do", method = RequestMethod.POST)
	@ResponseBody
	public List<ModelMasterDTO> getAllPromptModelList() {

		List<ModelMasterDTO> promptModelList = promptManagerService.getAllPromptModelList();

		log.debug("getAllPromptModelList promptModelList: " + promptModelList);

		return promptModelList;
	}

	@RequestMapping(value = "/promptmanager/updateUseYNPromptMaster.do", method = RequestMethod.POST)
	@ResponseBody
	public int updateUseYNPromptMaster(@RequestParam("promptId") String promptId) {
		log.debug("updateUseYNPromptMaster promptId: " + promptId);

		return promptManagerService.updateUseYNPromptMaster(promptId);
	}
}
