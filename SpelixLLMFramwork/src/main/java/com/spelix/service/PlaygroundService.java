package com.spelix.service;

import java.util.List;

import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptSystemDTO;

public interface PlaygroundService {

	List<PromptBaseDTO> getAllPromptBase();

	List<PromptSystemDTO> getPromptSystemInfo();

	List<PromptMasterDTO> getAllPromptMaster();
	
	List<String> getAllPromptModelList();
	
	String getModelParamJsonStr(String selectedModel);

}
