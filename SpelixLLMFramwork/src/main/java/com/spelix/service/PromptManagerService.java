package com.spelix.service;

import java.util.List;

import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptRateHistoryDTO;
import com.spelix.domain.PromptResultDTO;
import com.spelix.domain.PromptTestDataDTO;

public interface PromptManagerService {

	List<PromptMasterDTO> getAllPromptMaster();

	int deletePromptMasterById(String promptId);

	List<ModelMasterDTO> getAllPromptModelList();

	int updateUseYNPromptMaster(String promptId, String useYN);

	List<PromptTestDataDTO> getPromptTestDataById(String promptTestId);

	List<PromptRateHistoryDTO> getPromptRateHistoryByPromptId(String promptId, String promptVer);

	int savePromptRateHistory(PromptRateHistoryDTO promptRateHistoryDTO);

	String getPromptRateHistoryNextHistoryId();

	int updatePromptRateHistoryRate(String promptRateHistId, double promptRate);

	List<PromptResultDTO> getPromptResultByHistoryId(String promptRateHistId);

	int savePromptResult(PromptResultDTO promptResultDTO);

	int updatePromptMasterPromptRateById(String promptId, double promptRate);

}
