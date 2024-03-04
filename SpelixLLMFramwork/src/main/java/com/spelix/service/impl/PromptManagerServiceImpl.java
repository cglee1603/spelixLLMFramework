package com.spelix.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spelix.dao.PromptManagerDAO;
import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptTestDataDTO;
import com.spelix.service.PromptManagerService;

@Service
public class PromptManagerServiceImpl implements PromptManagerService {

	private static final Logger log = LoggerFactory.getLogger(PromptManagerServiceImpl.class);

	@Autowired
	PromptManagerDAO promptManagerDAO;

	public List<PromptMasterDTO> getAllPromptMaster() {
		return promptManagerDAO.getAllPromptMaster();
	}

	public int deletePromptMasterById(String promptId) {
		return promptManagerDAO.deletePromptMasterById(promptId);
	}

	public List<ModelMasterDTO> getAllPromptModelList() {
		return promptManagerDAO.getAllPromptModelList();
	};

	public int updateUseYNPromptMaster(String promptId) {
		return promptManagerDAO.updateUseYNPromptMaster(promptId);
	}

	public List<PromptTestDataDTO> getPromptTestDataById(String promptTestId) {
		return promptManagerDAO.getPromptTestDataById(promptTestId);
	}
}
