package com.spelix.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spelix.dao.PlaygroundDAO;
import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.service.PlaygroundService;

@Service
public class PlaygroundServiceImpl implements PlaygroundService {

	@Autowired
	PlaygroundDAO playgroundDAO;

	public List<PromptBaseDTO> getAllPromptBase() {
		return playgroundDAO.getAllPromptBase();
	}

	public List<String> getAllPromptSystemNameList() {
		return playgroundDAO.getAllPromptSystemNameList();
	}

	public List<PromptMasterDTO> getAllPromptMaster() {
		return playgroundDAO.getAllPromptMaster();
	}

	public List<String> getAllPromptModelList() {
		return playgroundDAO.getAllPromptModelList();
	}

	public String getModelParamJsonStr(String selectedModel) {
		return playgroundDAO.getModelParamJsonStr(selectedModel);
	}
}
