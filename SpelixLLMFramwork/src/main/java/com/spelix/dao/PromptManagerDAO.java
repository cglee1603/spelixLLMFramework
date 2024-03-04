package com.spelix.dao;

import java.util.List;

import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptTestDataDTO;

public interface PromptManagerDAO {

	List<PromptMasterDTO> getAllPromptMaster();

	List<PromptMasterDTO> getModelPromptData();

	int deletePromptMasterById(String promptId);

	List<ModelMasterDTO> getAllPromptModelList();

	int updateUseYNPromptMaster(String promptId);

	List<PromptTestDataDTO> getPromptTestDataById(String promptTestId);

}
