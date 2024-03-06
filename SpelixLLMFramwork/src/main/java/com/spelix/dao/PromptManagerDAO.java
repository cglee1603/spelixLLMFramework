package com.spelix.dao;

import java.util.List;
import java.util.Map;

import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptRateHistoryDTO;
import com.spelix.domain.PromptTestDataDTO;

public interface PromptManagerDAO {

	List<PromptMasterDTO> getAllPromptMaster();

	List<PromptMasterDTO> getModelPromptData();

	int deletePromptMasterById(String promptId);

	List<ModelMasterDTO> getAllPromptModelList();

	int updateUseYNPromptMaster(Map<String, Object> params);

	List<PromptTestDataDTO> getPromptTestDataById(String promptTestId);

	List<PromptRateHistoryDTO> getPromptRateHistoryByPromptId(String promptId);

	int savePromptRateHistory(PromptRateHistoryDTO promptRateHistoryDTO);

	String getPromptRateHistoryNextHistoryId();

	int updatePromptRateHistoryRate(Map<String, Object> params);

}
