package com.spelix.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spelix.dao.PromptTestDataDAO;
import com.spelix.domain.PromptTestData;
import com.spelix.service.PromptTestDataService;

@Service
public class PromptTestDataDAOImpl implements PromptTestDataService {

	@Autowired
	public PromptTestDataDAO promptTestDataDAO;

	@Override
	public PromptTestData getPromptTestDataById(String promptId) {
		return promptTestDataDAO.getPromptTestDataById(promptId);
	}

	@Override
	public List<PromptTestData> getAllPromptTestData() {
		return promptTestDataDAO.getAllPromptTestData();
	}

	@Override
	public void savePromptTestData(PromptTestData promptTestData) {
		promptTestDataDAO.savePromptTestData(promptTestData);
	}

	@Override
	public void updatePromptTestData(PromptTestData promptTestData) {
		promptTestDataDAO.updatePromptTestData(promptTestData);
	}

	@Override
	public void deletePromptTestData(String promptId) {
		promptTestDataDAO.deletePromptTestData(promptId);
	}

}
