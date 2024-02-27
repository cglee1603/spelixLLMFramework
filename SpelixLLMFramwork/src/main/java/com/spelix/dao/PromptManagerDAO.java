package com.spelix.dao;

import java.util.List;

import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;

public interface PromptManagerDAO {

	List<PromptMasterDTO> getAllPromptMaster();
	
	List<PromptMasterDTO> getModelPromptData();

	int deletePromptMasterById(String promptId);

	public List<ModelMasterDTO> getAllPromptModelList();
}
