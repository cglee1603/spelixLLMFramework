package com.spelix.service;

import java.util.List;

import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;

public interface PromptManagerService {

	public List<PromptMasterDTO> getAllPromptMaster();

	public int deletePromptMasterById(String promptId);

	List<ModelMasterDTO> getAllPromptModelList();

	int updateUseYNPromptMaster(String promptId);
}
