package com.spelix.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spelix.dao.PromptManagerDAO;
import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptRateHistoryDTO;
import com.spelix.domain.PromptResultDTO;
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

	public int updateUseYNPromptMaster(String promptId, String useYN) {
		Map<String, Object> params = new HashMap<>();
		params.put("promptId", promptId);
		params.put("useYN", useYN);

		return promptManagerDAO.updateUseYNPromptMaster(params);
	}

	public List<PromptTestDataDTO> getPromptTestDataById(String promptTestId) {
		return promptManagerDAO.getPromptTestDataById(promptTestId);
	}

	public List<PromptRateHistoryDTO> getPromptRateHistoryByPromptId(String promptId, String promptVer) {
		Map<String, Object> params = new HashMap<>();
		params.put("promptId", promptId);
		params.put("promptVer", promptVer);

		return promptManagerDAO.getPromptRateHistoryByPromptId(params);
	}

	public int savePromptRateHistory(PromptRateHistoryDTO promptRateHistoryDTO) {
		return promptManagerDAO.savePromptRateHistory(promptRateHistoryDTO);
	}

	public String getPromptRateHistoryNextHistoryId() {
		return promptManagerDAO.getPromptRateHistoryNextHistoryId();
	}

	public int updatePromptRateHistoryRate(String promptRateHistId, double promptRate) {
		Map<String, Object> params = new HashMap<>();
		params.put("promptRateHistId", promptRateHistId);
		params.put("promptRate", promptRate);

		return promptManagerDAO.updatePromptRateHistoryRate(params);

	}

	public List<PromptResultDTO> getPromptResultByHistoryId(String promptRateHistId) {
		return promptManagerDAO.getPromptResultByHistoryId(promptRateHistId);
	}

	public int savePromptResult(PromptResultDTO promptResultDTO) {
		return promptManagerDAO.savePromptResult(promptResultDTO);
	}

	public int updatePromptMasterPromptRateById(String promptId, double promptRate) {
		Map<String, Object> params = new HashMap<>();
		params.put("promptId", promptId);
		params.put("promptRate", promptRate);

		return promptManagerDAO.updatePromptMasterPromptRateById(params);
	}
}
